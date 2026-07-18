import { getDb } from './firestore';
import { articles as seedArticles } from '../../data/blog';
import type { Article } from './types';

function fromSeed(): Article[] {
  return (seedArticles as any[]).map(a => ({ ...a, status: 'published' as const }));
}

export async function getPublishedArticles(): Promise<Article[]> {
  const db = getDb();
  if (!db) return fromSeed();
  // Firestore-if-available, else seed. A build-time query failure (perms,
  // connectivity, unpopulated collection) must never break the static build.
  try {
    // Prefer the inline-CMS doc (siteContent/blog), then the legacy `articles`
    // collection, then the committed seed.
    const cms = await db.collection('siteContent').doc('blog').get();
    const cmsItems = cms.exists ? (cms.data()?.items as Article[] | undefined) : null;
    if (cmsItems && cmsItems.length) return cmsItems.map(a => ({ ...a, status: 'published' as const }));

    const snap = await db.collection('articles').where('status', '==', 'published').get();
    return snap.empty ? fromSeed() : snap.docs.map(d => d.data() as Article);
  } catch {
    return fromSeed();
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return (await getPublishedArticles()).find(a => a.slug === slug) ?? null;
}
