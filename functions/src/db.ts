import { getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Initialize once and pass the explicit App to every service. In the gen2/ESM
// functions runtime, the no-arg default-app lookup (getFirestore()) is not
// reliable — it can throw "default Firebase app does not exist" — so we hand
// the app instance directly to getFirestore/getStorage/getAuth.
let cachedApp: App | undefined;
export function getAdminApp(): App {
  if (!cachedApp) cachedApp = getApps()[0] ?? initializeApp();
  return cachedApp;
}
// Name the bucket explicitly. In the deployed functions runtime FIREBASE_CONFIG
// supplies the default bucket, but out-of-runtime callers (e.g. the migration
// CLI) have no default — so pass the project's default bucket name directly.
const STORAGE_BUCKET = 'cardo-website-2026.firebasestorage.app';
export function getDb() { return getFirestore(getAdminApp()); }
export function getBucket() { return getStorage(getAdminApp()).bucket(STORAGE_BUCKET); }
