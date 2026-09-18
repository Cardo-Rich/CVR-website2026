// List Journal articles in Firestore: live posts and pending drafts.
//
//   npm run blog:list
//   npm run blog:list -- --export file.json   also write the published set to a
//                                             file usable as BLOG_FIXTURE for an
//                                             offline build (see src/lib/content/articles.ts)
import { writeFileSync } from 'node:fs';
import { getDb } from '../src/lib/content/firestore';
import { listPublished, listDrafts } from '../functions/src/articles';
import { previewPath } from '../functions/src/article';

const db = getDb();
if (!db) { console.error('No Firestore (set FIREBASE_SERVICE_ACCOUNT or FIRESTORE_EMULATOR_HOST)'); process.exit(1); }

const [published, drafts] = await Promise.all([listPublished(db as any), listDrafts(db as any)]);
console.log(`Published (${published.length}):`);
for (const a of published) console.log(`  ${a.date}  ${a.slug}  [${a.category}]${a.featured ? '  featured' : ''}`);
console.log(`\nDrafts (${drafts.length}):`);
for (const d of drafts) console.log(`  ${d.date}  ${d.slug}  saved ${d.updatedAt} by ${d.source}  preview ${previewPath(d.previewKey)}`);

const i = process.argv.indexOf('--export');
if (i !== -1) {
  const out = process.argv[i + 1];
  if (!out) { console.error('--export needs a file path'); process.exit(1); }
  writeFileSync(out, JSON.stringify({ exportedAt: new Date().toISOString(), articles: published }, null, 2) + '\n');
  console.log(`\nWrote ${published.length} published articles to ${out}`);
}
