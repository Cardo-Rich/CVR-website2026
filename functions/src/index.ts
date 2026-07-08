import { onRequest, onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { getAuth } from 'firebase-admin/auth';
import { getDb, getBucket } from './db.js';
import { makeSendEmail, signingInviteHtml } from './email.js';
import { buildPdf } from './pdf.js';
import {
  createAgreement, getAgreementPublic, signAgreement, listAgreements,
  getSettings, setSettings, HttpErr, isValidToken,
} from './actions.js';
import { resolveAdmin } from './claims.js';
import type { AgreementDoc } from './types.js';

const RESEND_API_KEY = defineSecret('RESEND_API_KEY');
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function requireAdmin(auth: { token?: { admin?: boolean; [key: string]: unknown } } | undefined) {
  if (!auth?.token?.admin) throw new HttpsError('permission-denied', 'Admin access required.');
}

// ---- Owner-facing, token-guarded HTTPS (mirrors today's request contract) ----
export const agreements = onRequest({ secrets: [RESEND_API_KEY], cors: false }, async (req, res) => {
  Object.entries(CORS).forEach(([k, v]) => res.set(k, v));
  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
  try {
    const db = getDb();
    if (req.method === 'GET' && req.query.action === 'pdf') {
      const token = String(req.query.t || '');
      if (!isValidToken(token)) throw new HttpErr('Agreement not found', 404);
      const snap = await db.doc(`agreements/${token}`).get();
      if (!snap.exists) throw new HttpErr('Agreement not found', 404);
      const doc = snap.data() as AgreementDoc;
      const bytes = doc.pdfPath
        ? (await getBucket().file(doc.pdfPath).download())[0]
        : Buffer.from(await buildPdf(doc));
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'inline; filename="Cardo-Rental-Management-Agreement.pdf"');
      res.status(200).send(bytes);
      return;
    }
    const body = req.body ?? {};
    if (body.action === 'get') { res.json(await getAgreementPublic(db, String(body.token || ''))); return; }
    if (body.action === 'sign') {
      const settings = await getSettings(db);
      const send = makeSendEmail(RESEND_API_KEY.value(), settings);
      res.json(await signAgreement(db, getBucket(), String(body.token || ''), body, send));
      return;
    }
    res.status(400).json({ error: 'Unknown action' });
  } catch (e) {
    const status = (e as HttpErr).status ?? 500;
    if (status === 500) console.error(e);
    res.status(status).json({ error: (e as Error).message || 'Server error' });
  }
});

// ---- Staff callables (require the admin claim) ----
export const adminCreate = onCall({ secrets: [RESEND_API_KEY] }, async (req) => {
  requireAdmin(req.auth);
  let doc;
  try {
    doc = await createAgreement(getDb(), req.data);
  } catch (e) {
    if (e instanceof HttpErr && e.status === 400) throw new HttpsError('invalid-argument', e.message);
    throw e; // real failures propagate and log as internal errors
  }
  const origin = String(req.data?.siteOrigin || '').replace(/\/$/, '');
  const url = `${origin}/agreement/?t=${doc.token}`;
  let emailed = false;
  try {
    const settings = await getSettings(getDb());
    const send = makeSendEmail(RESEND_API_KEY.value(), settings);
    emailed = await send([doc.clientEmail], 'Your Cardo Vacation Rentals management agreement is ready to sign', signingInviteHtml(doc.clientName || '', url));
  } catch (e) { console.error('invite email failed', e); }
  return { token: doc.token, url, emailed };
});
export const adminList = onCall(async (req) => { requireAdmin(req.auth); return { agreements: await listAgreements(getDb()) }; });
export const adminGetSettings = onCall({ secrets: [RESEND_API_KEY] }, async (req) => {
  requireAdmin(req.auth);
  const s = await getSettings(getDb());
  return { ...s, hasResendKey: !!RESEND_API_KEY.value() };
});
export const adminSetSettings = onCall(async (req) => { requireAdmin(req.auth); await setSettings(getDb(), req.data); return { ok: true }; });

// ---- Claim bootstrap: any signed-in user calls this; allowlist decides ----
export const bootstrapAdmin = onCall(async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const t = req.auth.token as { email?: string; email_verified?: boolean; firebase?: { sign_in_provider?: string } };
  const verified = t.email_verified === true && t.firebase?.sign_in_provider === 'google.com';
  const isAdmin = verified ? await resolveAdmin(getDb(), t.email) : false;
  await getAuth().setCustomUserClaims(req.auth.uid, { admin: isAdmin }); // only 'admin' claim today; overwrites the claims object
  return { admin: isAdmin };
});
