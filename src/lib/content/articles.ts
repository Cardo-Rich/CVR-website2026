import { getDb } from './firestore';
import { articles as seedArticles } from '../../data/blog';
import type { Article } from './types';

function fromSeed(): Article[] {
  return (seedArticles as any[]).map(a => ({ ...a, status: 'published' as const }));
}

// The committed seed decides which articles exist; the CMS supplies edits to
// them. Merging the two, rather than letting the CMS replace the list, is what
// lets a post added in code appear without anyone republishing from the admin
// app. The consequence is that removing a post means removing it from the seed:
// deleting it in the CMS alone leaves the seed copy standing.
export function mergeWithSeed(cmsItems: Article[] | null | undefined): Article[] {
  const seed = fromSeed();
  if (!cmsItems || !cmsItems.length) return seed;
  const byCms = new Map(cmsItems.filter(a => a && a.slug).map(a => [a.slug, a]));
  const merged = seed.map(a => {
    const edit = byCms.get(a.slug);
    byCms.delete(a.slug);
    return edit ? { ...a, ...edit, status: 'published' as const } : a;
  });
  // Anything the CMS has that the seed does not (a post authored entirely in
  // the admin app) keeps its place at the end.
  return merged.concat([...byCms.values()].map(a => ({ ...a, status: 'published' as const })));
}

export async function getPublishedArticles(): Promise<Article[]> {
  const db = getDb();
  if (!db) return fromSeed();
  // Firestore-if-available, else seed. A build-time query failure (perms,
  // connectivity, unpopulated collection) must never break the static build.
  try {
    // The inline-CMS doc (siteContent/blog) first, then the legacy `articles`
    // collection; either way its entries are merged over the committed seed.
    const cms = await db.collection('siteContent').doc('blog').get();
    const cmsItems = cms.exists ? (cms.data()?.items as Article[] | undefined) : null;
    if (cmsItems && cmsItems.length) return mergeWithSeed(cmsItems);

    const snap = await db.collection('articles').where('status', '==', 'published').get();
    return snap.empty ? fromSeed() : mergeWithSeed(snap.docs.map(d => d.data() as Article));
  } catch {
    return fromSeed();
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return (await getPublishedArticles()).find(a => a.slug === slug) ?? null;
}
