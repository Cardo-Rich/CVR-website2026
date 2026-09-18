import { getDb } from './firestore';
import type { Article, DraftArticle } from './types';

// The Journal builds from Firestore: `articles` holds the live posts (one
// document each) and `articleDrafts` the pending ones, which get unlisted
// preview pages. There is no seed fallback on purpose. A build that cannot
// reach Firestore fails here rather than deploying an empty Journal.

function noDb(): never {
  throw new Error(
    'The Journal builds from Firestore, but no credentials are set. ' +
    'Set FIREBASE_SERVICE_ACCOUNT (the service-account JSON) or FIRESTORE_EMULATOR_HOST before building.',
  );
}

// Newest first by the derived ISO date, then title. Mirrors sortArticles in
// functions/src/article.ts so the built pages and /api/content agree.
function sortNewestFirst<T extends { date?: string; title: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => ((b.date || '').localeCompare(a.date || '')) || a.title.localeCompare(b.title));
}

// Every page that shows articles calls these during one build, so the
// collection is read once per process.
let publishedCache: Promise<Article[]> | null = null;
let draftCache: Promise<DraftArticle[]> | null = null;
export function resetArticleCache(): void { publishedCache = null; draftCache = null; }

// Offline builds: BLOG_FIXTURE=path/to/export.json makes the build read the
// Journal from that file instead of Firestore: `articles` (published) and,
// optionally, `drafts` (each with a previewKey). Produce one with
// `npm run blog:list -- --export file.json`. Local dev only; CI always builds
// from Firestore.
interface Fixture { articles?: Article[]; drafts?: DraftArticle[] }
async function readFixture(path: string): Promise<Fixture> {
  const { readFile } = await import('node:fs/promises');
  const raw = JSON.parse(await readFile(path, 'utf8')) as Fixture | Article[];
  return Array.isArray(raw) ? { articles: raw } : raw;
}
async function loadFixture(path: string): Promise<Article[]> {
  // A raw export may predate the derived `date`; fill it from the display
  // date so the offline build orders the way production does.
  const isoDate = (a: Article) => a.date || (isNaN(Date.parse(a.dateFull)) ? '' : new Date(Date.parse(a.dateFull)).toISOString().slice(0, 10));
  const list = ((await readFixture(path)).articles || []).map((a) => ({ status: 'published' as const, ...a, date: isoDate(a) }));
  console.warn(`[articles] BLOG_FIXTURE set: building the Journal from ${path} (${list.length} articles), not Firestore.`);
  return list;
}

async function loadPublished(): Promise<Article[]> {
  if (process.env.BLOG_FIXTURE) return sortNewestFirst(await loadFixture(process.env.BLOG_FIXTURE));
  const db = getDb();
  if (!db) noDb();
  const snap = await db.collection('articles').get();
  const list = snap.docs.map((d) => d.data() as Article).filter((a) => a && a.slug && a.status === 'published');
  if (!list.length && process.env.ALLOW_EMPTY_BLOG !== '1') {
    throw new Error('Firestore returned zero published articles. Refusing to build an empty Journal; set ALLOW_EMPTY_BLOG=1 to override (bootstrap only).');
  }
  return sortNewestFirst(list);
}

async function loadDrafts(): Promise<DraftArticle[]> {
  if (process.env.BLOG_FIXTURE) return sortNewestFirst(((await readFixture(process.env.BLOG_FIXTURE)).drafts || []).filter((a) => a && a.slug && a.previewKey));
  const db = getDb();
  if (!db) noDb();
  const snap = await db.collection('articleDrafts').get();
  return sortNewestFirst(snap.docs.map((d) => d.data() as DraftArticle).filter((a) => a && a.slug && a.previewKey));
}

export function getPublishedArticles(): Promise<Article[]> {
  return (publishedCache ??= loadPublished());
}

export function getDraftArticles(): Promise<DraftArticle[]> {
  return (draftCache ??= loadDrafts());
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return (await getPublishedArticles()).find((a) => a.slug === slug) ?? null;
}
