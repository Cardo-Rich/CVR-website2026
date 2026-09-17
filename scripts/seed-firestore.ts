// One-time migration: seed the initial case studies into Firestore.
//
// Run with `npm run seed`. Requires Firestore access via one of:
//   - FIRESTORE_EMULATOR_HOST (local emulator)
//   - FIREBASE_SERVICE_ACCOUNT (CI / prod)
//   - GOOGLE_APPLICATION_CREDENTIALS (local ADC)
//
// Idempotent: each doc id is the slug and writes use { merge: true }, so
// re-running this script is safe and will not duplicate or clobber data
// added later via the CMS.
//
// Journal articles are no longer seeded here: they live only in Firestore
// (see scripts/blog-migrate.ts for the one-time move and scripts/blog-draft.ts
// for adding a post).
import { getDb } from '../src/lib/content/firestore';
import { caseStudies } from '../src/data/case-studies';

const db = getDb();
if (!db) {
  console.error('No Firestore (set FIRESTORE_EMULATOR_HOST or FIREBASE_SERVICE_ACCOUNT)');
  process.exit(1);
}

try {
  for (const c of caseStudies as any[]) {
    await db.collection('caseStudies').doc(c.slug).set({ ...c, status: 'published' }, { merge: true });
  }
} catch (err) {
  console.error('Failed to seed Firestore (mid-loop write error):', err);
  process.exit(1);
}

console.log('Seeded', (caseStudies as any[]).length, 'case studies');
