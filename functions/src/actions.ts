import { randomBytes } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';
import { TERMS_META, ACKS } from './content.js';
import { buildPdf } from './pdf.js';
import type { AgreementDoc, PortalSettings, PublicAgreementView } from './types.js';

export function newToken(): string { return randomBytes(18).toString('hex'); } // 36 hex chars

export function isValidToken(token: string): boolean { return /^[0-9a-f]{20,}$/.test(token); }

export interface BucketLike {
  file(path: string): { save(data: Buffer, opts?: unknown): Promise<unknown>; download(): Promise<Buffer[]> };
}

export async function getSettings(db: Firestore): Promise<PortalSettings> {
  const snap = await db.doc('config/portalSettings').get();
  const d = snap.data() as Partial<PortalSettings> | undefined;
  return { notifyEmail: d?.notifyEmail ?? '', fromEmail: d?.fromEmail ?? '' };
}

export async function setSettings(db: Firestore, patch: Partial<PortalSettings>): Promise<void> {
  const clean: Partial<PortalSettings> = {};
  if (typeof patch.notifyEmail === 'string' && patch.notifyEmail.trim()) clean.notifyEmail = patch.notifyEmail.trim();
  if (typeof patch.fromEmail === 'string' && patch.fromEmail.trim()) clean.fromEmail = patch.fromEmail.trim();
  if (Object.keys(clean).length) await db.doc('config/portalSettings').set(clean, { merge: true });
}

export async function createAgreement(
  db: Firestore,
  input: { clientName?: string; clientEmail: string; terms?: Record<string, string>; addendum?: string },
): Promise<AgreementDoc> {
  const clientEmail = String(input.clientEmail || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clientEmail)) throw new HttpErr('A valid client email is required', 400);
  const terms: Record<string, string> = {};
  for (const m of TERMS_META) {
    const raw = String(input.terms?.[m.key] ?? m.default).trim();
    terms[m.key] = raw === '' ? m.default : raw;
  }
  const doc: AgreementDoc = {
    token: newToken(), status: 'sent',
    clientName: String(input.clientName || '').trim() || null,
    clientEmail, terms, addendum: String(input.addendum || ''),
    owner: null, acks: null, sigName: null, sigDate: null, sigData: null,
    signedAt: null, createdAt: new Date().toISOString(), pdfPath: null,
  };
  await db.doc(`agreements/${doc.token}`).set(doc);
  return doc;
}

async function getDoc(db: Firestore, token: string): Promise<AgreementDoc> {
  if (!isValidToken(token)) throw new HttpErr('Invalid link', 404);
  const snap = await db.doc(`agreements/${token}`).get();
  if (!snap.exists) throw new HttpErr('Agreement not found', 404);
  return snap.data() as AgreementDoc;
}

export async function getAgreementPublic(db: Firestore, token: string): Promise<PublicAgreementView> {
  const d = await getDoc(db, token);
  const signed = d.status === 'signed';
  return {
    status: d.status, clientName: d.clientName, clientEmail: d.clientEmail,
    terms: d.terms, addendum: d.addendum,
    owner: signed ? d.owner : null, acks: signed ? d.acks : null,
    sigName: d.sigName, sigDate: d.sigDate, sigData: signed ? d.sigData : null, signedAt: d.signedAt,
  };
}

export async function signAgreement(
  db: Firestore, bucket: BucketLike, token: string,
  input: { owner: Record<string, string>; acks: Record<string, boolean>; sigName: string; sigDate: string; sigData: string },
  sendMail: (to: string[], subject: string, html: string, attachments?: { filename: string; content: string }[]) => Promise<boolean>,
): Promise<{ signedAt: string; emailed: boolean }> {
  const d = await getDoc(db, token);
  if (d.status === 'signed') throw new HttpErr('This agreement has already been signed.', 409);
  const owner = input.owner || {}, acks = input.acks || {};
  const sigName = String(input.sigName || '').trim();
  const sigData = String(input.sigData || '');
  const missing: string[] = [];
  if (!owner.fullName?.trim()) missing.push('full legal name');
  if (!owner.homeAddress?.trim()) missing.push('managed property address');
  if (!owner.email?.trim()) missing.push('email address');
  if (!sigName) missing.push('typed signature');
  if (!sigData.startsWith('data:image/png;base64,')) missing.push('drawn signature');
  for (const ack of ACKS) if (ack.required && !acks[ack.key]) missing.push('all acknowledgements');
  if (missing.length) throw new HttpErr('Please complete: ' + [...new Set(missing)].join(', ') + '.', 400);

  const signedAt = new Date().toISOString();
  const signed: AgreementDoc = {
    ...d, status: 'signed', owner, acks, sigName,
    sigDate: String(input.sigDate || '').trim(), sigData, signedAt,
  };
  // Executed PDF → Storage
  let pdfPath: string | null = null;
  try {
    const pdf = await buildPdf(signed);
    pdfPath = `agreements/${token}/executed.pdf`;
    await bucket.file(pdfPath).save(Buffer.from(pdf), { contentType: 'application/pdf', resumable: false });
  } catch (e) { console.error('pdf/store failed', e); }
  await db.doc(`agreements/${token}`).set({ ...signed, pdfPath }, { merge: true });

  // Notify (best-effort)
  let emailed = false;
  try {
    const settings = await getSettings(db);
    let attachments: { filename: string; content: string }[] = [];
    if (pdfPath) {
      const [buf] = await bucket.file(pdfPath).download();
      attachments = [{ filename: 'Cardo-Rental-Management-Agreement.pdf', content: buf.toString('base64') }];
    }
    const recipients = [...new Set([owner.email.trim(), d.clientEmail, settings.notifyEmail].filter(Boolean))];
    emailed = await sendMail(
      recipients,
      `Signed: Rental Management Agreement — ${owner.homeAddress}`,
      `<h2>Agreement signed ✓</h2><p>${sigName} executed the Rental Management Agreement for ${owner.homeAddress}.</p>`,
      attachments,
    );
  } catch (e) { console.error('post-sign email failed', e); }
  return { signedAt, emailed };
}

export async function listAgreements(db: Firestore) {
  const snap = await db.collection('agreements').orderBy('createdAt', 'desc').limit(50).get();
  return snap.docs.map((s) => {
    const d = s.data() as AgreementDoc;
    return { token: d.token, status: d.status, clientName: d.clientName, clientEmail: d.clientEmail,
      terms: d.terms, createdAt: d.createdAt, signedAt: d.signedAt, sigName: d.sigName };
  });
}

export class HttpErr extends Error { constructor(msg: string, public status: number) { super(msg); } }
