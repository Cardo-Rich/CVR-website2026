// Write a Journal draft to Firestore from a JSON file. This is how a coding
// session (Claude Code) adds or revises an article: the draft gets an unlisted
// preview page, and publishing stays a separate step in the admin editor.
//
//   npm run blog:draft -- path/to/article.json
//
// The JSON is one article object (the fields in src/data/blog.ts: slug, title,
// category, excerpt, readTime, dateFull, dateShort, img, seo, author,
// heroCaption, bodyHtml, and the optional flags). A missing slug is derived
// from the title. Re-running with the same slug updates the draft and keeps
// its preview link.
//
// Needs FIREBASE_SERVICE_ACCOUNT. The preview page exists after the next site
// build: with GITHUB_DEPLOY_TOKEN set this script requests one; otherwise run
// the "Deploy to Firebase Hosting (live)" workflow with hosting_only=true.
import { readFileSync } from 'node:fs';
import { getDb } from '../src/lib/content/firestore';
import { saveDraft } from '../functions/src/articles';
import { previewPath } from '../functions/src/article';
import { requestDeploy } from '../functions/src/deploy';

const file = process.argv[2];
if (!file) { console.error('Usage: npm run blog:draft -- path/to/article.json'); process.exit(1); }
const db = getDb();
if (!db) { console.error('No Firestore (set FIREBASE_SERVICE_ACCOUNT or FIRESTORE_EMULATOR_HOST)'); process.exit(1); }

const raw = JSON.parse(readFileSync(file, 'utf8'));
const input = raw && typeof raw === 'object' && 'article' in raw ? raw.article : raw;

// The house copy rules are easy to check mechanically; fail early rather than
// hand Rich a draft that needs the same fixes every time.
const text = [input.title, input.excerpt, input.heroCaption, input.bodyHtml, input.seo?.title, input.seo?.description].filter(Boolean).join('\n');
const problems: string[] = [];
if (/—/.test(text)) problems.push('contains an em dash (use a period, comma, or colon)');
if (/VRBO/.test(text)) problems.push('uses "VRBO" (brand casing is "Vrbo")');
if (/luxur/i.test(text)) problems.push('uses "luxury" (never used for Cardo in site copy)');
if (problems.length) { console.error('Draft breaks the copy rules:\n - ' + problems.join('\n - ')); process.exit(1); }

const draft = await saveDraft(db as any, input, 'script');
const path = previewPath(draft.previewKey);
console.log(`Draft saved: ${draft.slug}`);
console.log(`Preview (after the next build): https://cardorentals.com${path}`);
console.log(`Will publish to: https://cardorentals.com/blog/${draft.slug}`);

const token = process.env.GITHUB_DEPLOY_TOKEN || '';
if (token) {
  const r = await requestDeploy(db as any, token, `draft:${draft.slug}`, { hostingOnly: true });
  console.log(`Deploy request: ${r}`);
} else {
  console.log('No GITHUB_DEPLOY_TOKEN in this environment: run the "Deploy to Firebase Hosting (live)" workflow with hosting_only=true so the preview page is built.');
}
