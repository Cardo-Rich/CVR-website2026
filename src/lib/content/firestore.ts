import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let cached: Firestore | null | undefined;

export function getDb(): Firestore | null {
  if (cached !== undefined) return cached;
  const hasEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;
  const svcJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  const adc = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!hasEmulator && !svcJson && !adc) { cached = null; return cached; }
  try {
    if (!getApps().length) {
      if (svcJson) initializeApp({ credential: cert(JSON.parse(svcJson)), projectId: 'cardo-website-2026' });
      else if (hasEmulator) initializeApp({ projectId: 'cardo-website-2026' });
      else initializeApp({ credential: applicationDefault(), projectId: 'cardo-website-2026' });
    }
    cached = getFirestore();
    return cached;
  } catch (err) {
    console.warn('[firestore] Failed to initialize Firebase app (malformed credentials?) — falling back to seed content.', err);
    cached = null;
    return cached;
  }
}
