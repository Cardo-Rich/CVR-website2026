// One-time migration: seed the initial articles + case studies into Firestore.
//
// Run with `npm run seed`. Requires Firestore access via one of:
//   - FIRESTORE_EMULATOR_HOST (local emulator)
//   - FIREBASE_SERVICE_ACCOUNT (CI / prod)
//   - GOOGLE_APPLICATION_CREDENTIALS (local ADC)
//
// Idempotent: each doc id is the slug and writes use { merge: true }, so
// re-running this script is safe and will not duplicate or clobber data
// added later via the CMS.
import { getDb } from '../src/lib/content/firestore';
import { articles } from '../src/data/blog';
import { caseStudies } from '../src/data/case-studies';

const db = getDb();
if (!db) {
  console.error('No Firestore (set FIRESTORE_EMULATOR_HOST or FIREBASE_SERVICE_ACCOUNT)');
  process.exit(1);
}

try {
  for (const a of articles as any[]) {
    await db.collection('articles').doc(a.slug).set({ ...a, status: 'published' }, { merge: true });
  }
  for (const c of caseStudies as any[]) {
    await db.collection('caseStudies').doc(c.slug).set({ ...c, status: 'published' }, { merge: true });
  }
} catch (err) {
  console.error('Failed to seed Firestore (mid-loop write error):', err);
  process.exit(1);
}

console.log('Seeded', (articles as any[]).length, 'articles,', (caseStudies as any[]).length, 'case studies');
