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
    const snap = await db.collection('articles').where('status', '==', 'published').get();
    return snap.empty ? fromSeed() : snap.docs.map(d => d.data() as Article);
  } catch {
    return fromSeed();
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return (await getPublishedArticles()).find(a => a.slug === slug) ?? null;
}
