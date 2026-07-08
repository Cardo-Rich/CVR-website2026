import { getDb } from './firestore';
import { articles as seedArticles } from '../../data/blog';
import type { Article } from './types';

function fromSeed(): Article[] {
  return (seedArticles as any[]).map(a => ({ ...a, status: 'published' as const }));
}

export async function getPublishedArticles(): Promise<Article[]> {
  const db = getDb();
  if (!db) return fromSeed();
  const snap = await db.collection('articles').where('status', '==', 'published').get();
  return snap.docs.map(d => d.data() as Article);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return (await getPublishedArticles()).find(a => a.slug === slug) ?? null;
}
