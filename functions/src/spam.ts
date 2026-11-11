// Spam screening + loud-failure helpers for the public lead endpoints
// (/api/lead and the /api/ghl booking action). Both endpoints are
// unauthenticated, so without this a bot can POST junk straight into the CRM.
//
// Defense is layered and server-side so it also catches raw POSTs that never
// load the page:
//   1. Honeypot  — a hidden field no human fills; any value means a bot.
//   2. Timing    — the page reports how long the form was open; an instant or
//                  missing timing token means an automated submit.
//   3. Contact   — a real lead has a valid email OR a usable phone number.
//   4. Rate limit — a per-IP cap so one source can't flood the CRM.
import type { Firestore } from 'firebase-admin/firestore';

// The hidden field name the front-end injects. Kept here so client and server
// agree; the client sends its value as `honeypot` on the JSON payload.
export const HONEYPOT_FIELD = 'url';

export interface SpamInput {
  honeypot?: unknown; // value of the hidden field; bots fill it, humans can't see it
  elapsedMs?: unknown; // ms the form was open before submit; bots submit instantly
  email?: string;
  phone?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// A human filling even a one-field form takes longer than this. Raw POST bots
// send no timing token at all, which also trips this check.
const MIN_ELAPSED_MS = 1500;

// Returns a short reason when the submission is junk, or null when it looks
// like a real person. Pure and side-effect free so it is easy to unit-test.
export function spamReason(input: SpamInput): string | null {
  // 1) Honeypot — any non-empty value (string or otherwise) is a bot.
  const hp = input.honeypot;
  if (hp !== undefined && hp !== null && String(hp).trim() !== '') return 'honeypot';

  // 2) Timing token — must be present and plausibly human.
  const elapsed = typeof input.elapsedMs === 'number' ? input.elapsedMs : Number(input.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) return 'too-fast';

  // 3) Contactability — need a valid email OR a phone with enough digits.
  const email = (input.email || '').trim();
  const phoneDigits = (input.phone || '').replace(/\D/g, '');
  if (!EMAIL_RE.test(email) && phoneDigits.length < 10) return 'no-valid-contact';

  return null;
}

// Fixed-window per-IP rate limit, backed by Firestore (admin SDK, so it
// bypasses security rules). Returns true when the caller is over the cap.
// Fails open: if the IP is unknown or the store errors, the request proceeds.
export async function rateLimited(
  db: Firestore, ip: string, max: number, windowMs: number,
): Promise<boolean> {
  if (!ip) return false;
  const key = ip.replace(/[^a-zA-Z0-9_.:-]/g, '_').slice(0, 200);
  const ref = db.collection('rateLimits').doc(key);
  try {
    return await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const now = Date.now();
      const data = snap.exists ? (snap.data() as { count: number; windowStart: number }) : null;
      if (!data || now - data.windowStart > windowMs) {
        tx.set(ref, { count: 1, windowStart: now });
        return false;
      }
      if (data.count >= max) return true;
      tx.update(ref, { count: data.count + 1 });
      return false;
    });
  } catch (e) {
    console.error('rateLimited check failed (failing open)', e);
    return false;
  }
}

// Loud failure: a lead that should have been captured but wasn't. Logs with a
// greppable marker (set a log-based alert on "[LEAD_ALERT]") and persists a
// durable record to Firestore so no lead is ever silently lost.
export async function recordAlert(
  db: Firestore, kind: string, detail: Record<string, unknown>,
): Promise<void> {
  console.error('[LEAD_ALERT]', kind, JSON.stringify(detail));
  try {
    await db.collection('leadAlerts').add({ kind, detail, at: new Date().toISOString() });
  } catch (e) {
    console.error('leadAlert write failed', e);
  }
}

// First client IP from the proxy chain (Firebase Hosting → function).
export function clientIp(req: { headers: Record<string, unknown>; ip?: string }): string {
  const xff = req.headers['x-forwarded-for'];
  const raw = Array.isArray(xff) ? String(xff[0]) : String(xff || '');
  return raw.split(',')[0].trim() || req.ip || '';
}
