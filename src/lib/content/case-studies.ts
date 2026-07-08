import { getDb } from './firestore';
import { caseStudies as seedCaseStudies } from '../../data/case-studies';
import type { CaseStudy } from './types';

function fromSeed(): CaseStudy[] {
  return (seedCaseStudies as any[]).map(c => ({ ...c, status: 'published' as const }));
}

export async function getPublishedCaseStudies(): Promise<CaseStudy[]> {
  const db = getDb();
  if (!db) return fromSeed();
  // Firestore-if-available, else seed. A build-time query failure (perms,
  // connectivity, unpopulated collection) must never break the static build.
  try {
    const snap = await db.collection('caseStudies').where('status', '==', 'published').get();
    return snap.empty ? fromSeed() : snap.docs.map(d => d.data() as CaseStudy);
  } catch {
    return fromSeed();
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  return (await getPublishedCaseStudies()).find(c => c.slug === slug) ?? null;
}
