import { getDb } from './firestore';
import { neighborhoods as seed, type Neighborhood } from '../../data/neighborhoods';

// CMS-managed neighborhoods (siteContent/neighborhoods, edited inline). Read at
// build time so both the index cards and the /neighborhoods/[slug] detail pages
// bake from published CMS content. Falls back to the committed seed whenever
// Firestore is unavailable or the doc is empty — a build must never break.
export async function getNeighborhoods(): Promise<Neighborhood[]> {
  const db = getDb();
  if (!db) return seed;
  try {
    const doc = await db.collection('siteContent').doc('neighborhoods').get();
    const items = doc.exists ? (doc.data()?.items as Neighborhood[] | undefined) : null;
    return items && items.length ? items : seed;
  } catch {
    return seed;
  }
}
