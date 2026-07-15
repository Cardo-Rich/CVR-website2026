import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export interface CaseStudyItem {
  id: string; name: string; hood: string; beds: string; hook: string;
  revenue: string; nightly: string; lift: string; img?: string;
  featured?: boolean; blurb?: string;
}
export interface ReviewCard { name: string; meta: string; stars: number; text: string; }
export interface ReviewsDoc {
  google: { placeId?: string; rating?: number | null; count?: number | null; minStars?: number; reviews?: ReviewCard[]; syncedAt?: string | null };
  airbnb: { rating?: number | null; count?: number | null; reviews?: ReviewCard[] };
}
export interface SiteContent { caseStudies: CaseStudyItem[]; reviews: ReviewsDoc; }

export async function getContent(): Promise<SiteContent> {
  const r = await httpsCallable<unknown, SiteContent>(functions, 'adminContentGet')();
  return r.data;
}
export async function saveContent(patch: { caseStudies?: CaseStudyItem[]; reviews?: Partial<ReviewsDoc> }): Promise<void> {
  await httpsCallable<typeof patch, { ok: true }>(functions, 'adminContentSet')(patch);
}
export async function syncGoogle(placeId?: string): Promise<{ rating: number; count: number; reviews: number }> {
  const r = await httpsCallable<{ placeId?: string }, { rating: number; count: number; reviews: number }>(functions, 'adminSyncGoogleReviews')({ placeId });
  return r.data;
}
