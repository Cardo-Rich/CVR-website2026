// Journal article model shared by the Cloud Functions, the build, and the
// repo scripts (scripts/blog-*.ts import this file directly with tsx). Keep it
// dependency-free apart from node:crypto so it runs in all three places.
//
// Storage layout (Firestore):
//   articles/{slug}                 the published article the site builds from
//   articleDrafts/{slug}            pending edits, or a new article not yet live;
//                                   carries previewKey for the unlisted preview page
//   articles/{slug}/revisions/{id}  a snapshot per save/publish/delete, kept 30 days
import { randomBytes } from 'node:crypto';

export interface ArticleCaseStudy {
  name: string; hood: string; beds: string; revenue: string; nightly: string; lift: string; gallery?: string[];
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  dateFull: string;    // display, e.g. "June 18, 2026"
  dateShort: string;   // display, e.g. "Jun 2026"
  date: string;        // ISO yyyy-mm-dd derived from dateFull; drives ordering
  img: string;
  featured: boolean;
  seo: { title: string; description: string };
  author: { name: string; initials: string };
  heroCaption: string;
  bodyHtml: string;
  localTip: string;
  showOnHome: boolean;
  showOnOwners: boolean;
  caseStudy?: ArticleCaseStudy;
}

export interface PublishedArticle extends Article {
  status: 'published';
  publishedAt: string; // ISO
  updatedAt: string;   // ISO
}

export interface DraftArticle extends Article {
  previewKey: string;  // random; the preview page lives at /blog/preview/{previewKey}
  createdAt: string;
  updatedAt: string;
  source: 'admin' | 'script' | 'restore';
}

export type RevisionSource = 'save' | 'publish' | 'delete' | 'restore' | 'migrate';

export interface Revision {
  savedAt: string;     // ISO
  expiresAt: string;   // ISO; the daily prune removes revisions past this
  source: RevisionSource;
  title: string;       // denormalised so the history list needs no snapshot read
  article: Article;
}

export const REVISION_TTL_DAYS = 30;
export const MAX_REVISIONS_LISTED = 50;

export function previewKey(): string {
  return randomBytes(16).toString('base64url');
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100);
}

// "June 18, 2026" → "2026-06-18". Unparseable input falls back to `fallback`
// (the caller passes today) so a typo in the date field never hides a post.
export function deriveDate(dateFull: string, fallback: Date = new Date()): string {
  const t = Date.parse(dateFull);
  const d = isNaN(t) ? fallback : new Date(t);
  return d.toISOString().slice(0, 10);
}

function str(v: unknown, max: number): string {
  return String(v ?? '').slice(0, max);
}
function strArr(a: unknown, max: number, len: number): string[] {
  return Array.isArray(a) ? a.slice(0, max).map((s) => str(s, len)).filter(Boolean) : [];
}

// Coerce untrusted input into an Article with every field bounded. Throws on
// the two things that cannot be defaulted: a missing title, or a slug that is
// empty after sanitising.
export function cleanArticle(input: unknown, now: Date = new Date()): Article {
  const it = (input ?? {}) as Record<string, unknown>;
  const title = str(it.title, 240).trim();
  if (!title) throw new Error('Title is required.');
  const slug = slugify(str(it.slug, 100) || title);
  if (!slug) throw new Error('Slug is required.');
  const seo = (it.seo ?? {}) as Record<string, unknown>;
  const author = (it.author ?? {}) as Record<string, unknown>;
  const dateFull = str(it.dateFull, 60);
  const out: Article = {
    slug,
    title,
    category: str(it.category, 60),
    excerpt: str(it.excerpt, 600),
    readTime: str(it.readTime, 40),
    dateFull,
    dateShort: str(it.dateShort, 40),
    date: deriveDate(dateFull, now),
    img: str(it.img, 600),
    featured: it.featured === true,
    seo: { title: str(seo.title, 240), description: str(seo.description, 400) },
    author: { name: str(author.name, 120), initials: str(author.initials, 6) },
    heroCaption: str(it.heroCaption, 400),
    bodyHtml: str(it.bodyHtml, 200000),
    localTip: str(it.localTip, 300),
    showOnHome: it.showOnHome === true,
    showOnOwners: it.showOnOwners === true,
  };
  // Only carry the case-study block when it holds something; Firestore
  // rejects undefined fields, and an empty block would render an empty card.
  const cs = (it.caseStudy ?? null) as Record<string, unknown> | null;
  if (cs && (cs.hood || cs.revenue || cs.nightly || cs.lift || cs.beds || cs.name)) {
    out.caseStudy = {
      name: str(cs.name, 120), hood: str(cs.hood, 120), beds: str(cs.beds, 24),
      revenue: str(cs.revenue, 40), nightly: str(cs.nightly, 60), lift: str(cs.lift, 60),
      gallery: strArr(cs.gallery, 8, 600),
    };
  }
  return out;
}

// Newest first by the derived date, then title, so the Journal reads as a
// chronological feed and a new post lands at the top without anyone
// reordering anything.
export function sortArticles<T extends { date: string; title: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => (b.date.localeCompare(a.date)) || a.title.localeCompare(b.title));
}

export function revisionExpiry(from: Date = new Date()): string {
  return new Date(from.getTime() + REVISION_TTL_DAYS * 86400000).toISOString();
}

export function previewPath(key: string): string {
  return `/blog/preview/${key}`;
}
