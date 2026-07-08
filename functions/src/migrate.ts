import type { Firestore } from 'firebase-admin/firestore';
import { buildPdf } from './pdf.js';
import type { AgreementDoc } from './types.js';
import type { BucketLike } from './actions.js';

export interface SupabaseRow {
  token: string; status: string; client_name: string | null; client_email: string;
  terms: Record<string, string>; addendum: string | null; owner: Record<string, string> | null;
  acks: Record<string, boolean> | null; sig_name: string | null; sig_date: string | null;
  sig_data: string | null; signed_at: string | null; created_at: string;
}

export function toAgreementDoc(r: SupabaseRow): AgreementDoc {
  return {
    token: r.token, status: r.status === 'signed' ? 'signed' : 'sent',
    clientName: r.client_name, clientEmail: r.client_email, terms: r.terms || {}, addendum: r.addendum,
    owner: r.owner, acks: r.acks, sigName: r.sig_name, sigDate: r.sig_date, sigData: r.sig_data,
    signedAt: r.signed_at, createdAt: r.created_at, pdfPath: null,
  };
}

export async function migrateAgreements(
  rows: SupabaseRow[], settings: { notifyEmail: string; fromEmail: string },
  db: Firestore, bucket: BucketLike,
): Promise<{ migrated: number; pdfs: number }> {
  let pdfs = 0;
  for (const r of rows) {
    const doc = toAgreementDoc(r);
    if (doc.status === 'signed') {
      try {
        const pdf = await buildPdf(doc);
        doc.pdfPath = `agreements/${doc.token}/executed.pdf`;
        await bucket.file(doc.pdfPath).save(Buffer.from(pdf), { contentType: 'application/pdf', resumable: false });
        pdfs++;
      } catch (e) { console.error('pdf regen failed for', doc.token, e); }
    }
    await db.doc(`agreements/${doc.token}`).set(doc); // token preserved as doc id
  }
  await db.doc('config/portalSettings').set({ notifyEmail: settings.notifyEmail, fromEmail: settings.fromEmail }, { merge: true });
  return { migrated: rows.length, pdfs };
}
