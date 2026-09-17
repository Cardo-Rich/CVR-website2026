// Firestore operations for Journal articles. One document per article, so a
// save touches one post and nothing else, and the collection has no practical
// size limit. See article.ts for the layout and the shared model.
import type { Firestore, WriteBatch } from 'firebase-admin/firestore';
import {
  cleanArticle, previewKey, revisionExpiry, sortArticles, MAX_REVISIONS_LISTED,
  type Article, type PublishedArticle, type DraftArticle, type Revision, type RevisionSource,
} from './article.js';

export class NotFound extends Error {}

const PUBLISHED = 'articles';
const DRAFTS = 'articleDrafts';
const pubRef = (db: Firestore, slug: string) => db.collection(PUBLISHED).doc(slug);
const draftRef = (db: Firestore, slug: string) => db.collection(DRAFTS).doc(slug);
const revisionsRef = (db: Firestore, slug: string) => pubRef(db, slug).collection('revisions');

// What the admin editor sees: every article, with the draft copy winning over
// the published one where both exist, and flags saying which is which.
export interface AdminArticle extends Article {
  published: boolean;   // a live copy exists
  draft: boolean;       // a pending copy exists (new post, or edits to a live one)
  previewKey?: string;  // set when draft
  publishedAt?: string;
  updatedAt?: string;
}

export interface RevisionSummary { id: string; savedAt: string; expiresAt: string; source: RevisionSource; title: string }

export async function listPublished(db: Firestore): Promise<PublishedArticle[]> {
  const snap = await db.collection(PUBLISHED).get();
  const list = snap.docs.map((d) => d.data() as PublishedArticle).filter((a) => a && a.slug && a.status === 'published');
  return sortArticles(list);
}

export async function listDrafts(db: Firestore): Promise<DraftArticle[]> {
  const snap = await db.collection(DRAFTS).get();
  return sortArticles(snap.docs.map((d) => d.data() as DraftArticle).filter((a) => a && a.slug));
}

export async function listForAdmin(db: Firestore): Promise<AdminArticle[]> {
  const [pub, drafts] = await Promise.all([listPublished(db), listDrafts(db)]);
  const bySlug = new Map<string, AdminArticle>();
  for (const a of pub) bySlug.set(a.slug, { ...a, published: true, draft: false });
  for (const d of drafts) {
    const existing = bySlug.get(d.slug);
    bySlug.set(d.slug, { ...d, published: !!existing, draft: true, publishedAt: existing?.publishedAt });
  }
  return sortArticles([...bySlug.values()]);
}

export async function hasDrafts(db: Firestore): Promise<boolean> {
  const snap = await db.collection(DRAFTS).limit(1).get();
  return !snap.empty;
}

function queueRevision(batch: WriteBatch, db: Firestore, article: Article, source: RevisionSource, now: Date): void {
  const rev: Revision = { savedAt: now.toISOString(), expiresAt: revisionExpiry(now), source, title: article.title, article };
  batch.set(revisionsRef(db, article.slug).doc(), rev);
}

// Save a draft. Keeps the preview key of an existing draft so a link already
// shared stays valid across edits.
export async function saveDraft(db: Firestore, input: unknown, source: DraftArticle['source'], now: Date = new Date()): Promise<DraftArticle> {
  const article = cleanArticle(input, now);
  const existing = (await draftRef(db, article.slug).get()).data() as DraftArticle | undefined;
  const draft: DraftArticle = {
    ...article,
    previewKey: existing?.previewKey || previewKey(),
    createdAt: existing?.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
    source,
  };
  const batch = db.batch();
  batch.set(draftRef(db, article.slug), draft, { merge: false });
  queueRevision(batch, db, article, source === 'restore' ? 'restore' : 'save', now);
  await batch.commit();
  return draft;
}

// Promote a draft to the live copy and remove the draft.
export async function publishArticle(db: Firestore, slug: string, now: Date = new Date()): Promise<PublishedArticle> {
  const [draftSnap, pubSnap] = await Promise.all([draftRef(db, slug).get(), pubRef(db, slug).get()]);
  const draft = draftSnap.data() as DraftArticle | undefined;
  if (!draft) throw new NotFound(`No draft to publish for "${slug}".`);
  const { previewKey: _k, createdAt: _c, updatedAt: _u, source: _s, ...article } = draft;
  const prior = pubSnap.data() as PublishedArticle | undefined;
  const published: PublishedArticle = {
    ...(article as Article),
    status: 'published',
    publishedAt: prior?.publishedAt || now.toISOString(),
    updatedAt: now.toISOString(),
  };
  const batch = db.batch();
  batch.set(pubRef(db, slug), published, { merge: false });
  batch.delete(draftRef(db, slug));
  queueRevision(batch, db, article as Article, 'publish', now);
  await batch.commit();
  return published;
}

export async function publishAllDrafts(db: Firestore, now: Date = new Date()): Promise<string[]> {
  const drafts = await listDrafts(db);
  for (const d of drafts) await publishArticle(db, d.slug, now);
  return drafts.map((d) => d.slug);
}

export async function discardDraft(db: Firestore, slug: string): Promise<boolean> {
  const ref = draftRef(db, slug);
  if (!(await ref.get()).exists) return false;
  await ref.delete();
  return true;
}

export async function discardAllDrafts(db: Firestore): Promise<string[]> {
  const drafts = await listDrafts(db);
  const batch = db.batch();
  for (const d of drafts) batch.delete(draftRef(db, d.slug));
  await batch.commit();
  return drafts.map((d) => d.slug);
}

// Remove an article from the site (and any pending draft). A revision is
// written first, so the article can be restored from History for 30 days.
export async function deleteArticle(db: Firestore, slug: string, now: Date = new Date()): Promise<{ removedPublished: boolean; removedDraft: boolean }> {
  const [draftSnap, pubSnap] = await Promise.all([draftRef(db, slug).get(), pubRef(db, slug).get()]);
  if (!draftSnap.exists && !pubSnap.exists) throw new NotFound(`No article "${slug}".`);
  const source = (draftSnap.data() || pubSnap.data()) as Article;
  const batch = db.batch();
  queueRevision(batch, db, cleanArticle(source, now), 'delete', now);
  if (draftSnap.exists) batch.delete(draftRef(db, slug));
  if (pubSnap.exists) batch.delete(pubRef(db, slug));
  await batch.commit();
  return { removedPublished: pubSnap.exists, removedDraft: draftSnap.exists };
}

// Newest first. Expired revisions of this article are removed on the way,
// so History never shows something the daily prune is about to delete.
export async function listRevisions(db: Firestore, slug: string, now: Date = new Date()): Promise<RevisionSummary[]> {
  const snap = await revisionsRef(db, slug).orderBy('savedAt', 'desc').limit(MAX_REVISIONS_LISTED).get();
  const cutoff = now.toISOString();
  const out: RevisionSummary[] = [];
  const expired = db.batch();
  let nExpired = 0;
  for (const d of snap.docs) {
    const r = d.data() as Revision;
    if (r.expiresAt <= cutoff) { expired.delete(d.ref); nExpired++; continue; }
    out.push({ id: d.id, savedAt: r.savedAt, expiresAt: r.expiresAt, source: r.source, title: r.title });
  }
  if (nExpired) await expired.commit();
  return out;
}

// Put a past snapshot back as the draft. Publishing stays a separate,
// explicit step, so a restore never changes the live site by itself.
export async function restoreRevision(db: Firestore, slug: string, revisionId: string, now: Date = new Date()): Promise<DraftArticle> {
  const snap = await revisionsRef(db, slug).doc(revisionId).get();
  const rev = snap.data() as Revision | undefined;
  if (!rev) throw new NotFound(`No revision "${revisionId}" for "${slug}".`);
  return saveDraft(db, { ...rev.article, slug }, 'restore', now);
}

// Delete every revision past its expiry, across all articles. listDocuments
// includes slugs whose published doc is gone but whose revisions remain, so
// a deleted article's history is pruned on the same schedule.
export async function pruneRevisions(db: Firestore, now: Date = new Date()): Promise<number> {
  const cutoff = now.toISOString();
  const refs = await db.collection(PUBLISHED).listDocuments();
  let removed = 0;
  for (const ref of refs) {
    const snap = await ref.collection('revisions').where('expiresAt', '<=', cutoff).get();
    if (snap.empty) continue;
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    removed += snap.size;
  }
  return removed;
}
