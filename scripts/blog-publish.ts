// Save and publish Journal articles from JSON files in one step. Used by the
// journal-publish workflow for the scheduled SEO job (Rich approved fully
// automatic publishing for that job, Nov 2026). Interactive sessions should
// keep using blog:draft so Rich reviews first.
//
//   npm run blog:publish -- content/journal/some-post.json [more.json ...]
//
// Each file is one article object (same shape as blog:draft). The same house
// copy checks run first; a file that fails them is skipped and the run exits
// non-zero after the others are processed.
import { readFileSync } from 'node:fs';
import { getDb } from '../src/lib/content/firestore';
import { saveDraft, publishArticle } from '../functions/src/articles';

const files = process.argv.slice(2);
if (!files.length) { console.error('Usage: npm run blog:publish -- file.json [file.json ...]'); process.exit(1); }
const db = getDb();
if (!db) { console.error('No Firestore (set FIREBASE_SERVICE_ACCOUNT or FIRESTORE_EMULATOR_HOST)'); process.exit(1); }

let failed = 0;
for (const file of files) {
  try {
    const raw = JSON.parse(readFileSync(file, 'utf8'));
    const input = raw && typeof raw === 'object' && 'article' in raw ? raw.article : raw;
    const text = [input.title, input.excerpt, input.heroCaption, input.bodyHtml, input.seo?.title, input.seo?.description].filter(Boolean).join('\n');
    const problems: string[] = [];
    if (/—/.test(text)) problems.push('contains an em dash');
    if (/VRBO/.test(text)) problems.push('uses "VRBO" (brand casing is "Vrbo")');
    if (/luxur/i.test(text)) problems.push('uses "luxury"');
    if (problems.length) throw new Error('breaks the copy rules: ' + problems.join('; '));
    const draft = await saveDraft(db as any, input, 'script');
    await publishArticle(db as any, draft.slug);
    console.log(`Published: https://cardorentals.com/blog/${draft.slug} (live after the next hosting build)`);
  } catch (e) {
    failed++;
    console.error(`FAILED ${file}: ${(e as Error).message}`);
  }
}
process.exit(failed ? 1 : 0);
