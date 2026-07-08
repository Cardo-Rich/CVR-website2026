import { getDb } from '../src/lib/content/firestore';
const email = process.argv[2] || 'rich@cardorentals.com';
const db = getDb();
if (!db) { console.error('No Firestore (set FIRESTORE_EMULATOR_HOST or FIREBASE_SERVICE_ACCOUNT)'); process.exit(1); }
await db.doc('config/admins').set({ emails: [email] }, { merge: true });
console.log('Seeded config/admins with', email);
