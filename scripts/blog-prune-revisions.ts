// Delete Journal article revisions past their 30-day expiry. Run daily by
// .github/workflows/daily-data-refresh.yml; safe to run by hand any time.
//
//   npm run blog:prune-revisions
import { getDb } from '../src/lib/content/firestore';
import { pruneRevisions } from '../functions/src/articles';
import { REVISION_TTL_DAYS } from '../functions/src/article';

const db = getDb();
if (!db) { console.error('No Firestore (set FIREBASE_SERVICE_ACCOUNT or FIRESTORE_EMULATOR_HOST)'); process.exit(1); }

const removed = await pruneRevisions(db as any);
console.log(`Removed ${removed} revision${removed === 1 ? '' : 's'} older than ${REVISION_TTL_DAYS} days.`);
