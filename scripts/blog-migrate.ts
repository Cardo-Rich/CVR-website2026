// One-time move of the Journal from the seed + siteContent/blog snapshot to
// one Firestore document per article.
//
//   npm run blog:migrate               write articles/{slug} from the fixture (idempotent)
//   npm run blog:migrate -- --dry-run  show what would be written
//   npm run blog:migrate -- --cutover  delete siteContent/blog + siteContentDraft/blog
//                                      (run only after the first step is verified)
//
// Needs Firestore access: FIREBASE_SERVICE_ACCOUNT (or FIRESTORE_EMULATOR_HOST).
// Safe to run before the new site code is deployed: the old code prefers
// siteContent/blog, so populating `articles` changes nothing live until cutover.
import { readFileSync } from 'node:fs';
import { getDb } from '../src/lib/content/firestore';
import { cleanArticle, revisionExpiry, type PublishedArticle, type Revision } from '../functions/src/article';
import { listPublished } from '../functions/src/articles';

const FIXTURE = 'scripts/data/blog-articles-2026-09-17.json';
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const cutover = args.has('--cutover');

const db = getDb();
if (!db) { console.error('No Firestore (set FIREBASE_SERVICE_ACCOUNT or FIRESTORE_EMULATOR_HOST)'); process.exit(1); }

if (cutover) {
  const live = await listPublished(db as any);
  const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8')).articles as unknown[];
  if (live.length < fixture.length) {
    console.error(`Refusing cutover: articles has ${live.length} published docs but the fixture holds ${fixture.length}. Run the first step and check it.`);
    process.exit(1);
  }
  for (const path of ['siteContent/blog', 'siteContentDraft/blog']) {
    const ref = db.doc(path);
    const exists = (await ref.get()).exists;
    if (dryRun) { console.log(exists ? `would delete ${path}` : `${path} already absent`); continue; }
    if (exists) { await ref.delete(); console.log('deleted', path); } else console.log(path, 'already absent');
  }
  console.log('Cutover complete. The site now builds and hydrates from the articles collection only.');
  process.exit(0);
}

const now = new Date();
const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8')).articles as unknown[];
let written = 0, kept = 0;
for (const raw of fixture) {
  const article = cleanArticle(raw, now);
  const ref = db.collection('articles').doc(article.slug);
  const prior = (await ref.get()).data() as PublishedArticle | undefined;
  const doc: PublishedArticle = {
    ...article,
    status: 'published',
    // Treat the display date as the original publish moment; keep an earlier
    // value if the doc already exists so re-runs never move it.
    publishedAt: prior?.publishedAt || `${article.date}T16:00:00.000Z`,
    updatedAt: now.toISOString(),
  };
  if (dryRun) { console.log(prior ? 'would update' : 'would create', article.slug, '|', article.date, '|', article.category); continue; }
  const batch = db.batch();
  batch.set(ref, doc, { merge: false });
  const rev: Revision = { savedAt: now.toISOString(), expiresAt: revisionExpiry(now), source: 'migrate', title: article.title, article };
  batch.set(ref.collection('revisions').doc(), rev);
  await batch.commit();
  if (prior) kept++; else written++;
  console.log(prior ? 'updated' : 'created', article.slug);
}
if (!dryRun) {
  const live = await listPublished(db as any);
  console.log(`\n${written} created, ${kept} updated. articles collection now holds ${live.length} published articles.`);
  console.log('Next: verify on a preview build, then `npm run blog:migrate -- --cutover`.');
}
