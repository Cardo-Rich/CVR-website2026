import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export interface CaseStudyItem {
  id: string; name: string; hood: string; beds: string; hook: string;
  revenue: string; nightly: string; lift: string; img?: string;
  featured?: boolean; blurb?: string;
}
export interface FeaturedHomeItem {
  id: string; name: string; neighborhood: string; beds: string; baths: string;
  guests: string; photo: string; bookingUrl: string; premier?: boolean; featured?: boolean;
}
export interface ReviewCard { name: string; meta: string; stars: number; text: string; }
export interface ReviewsDoc {
  google: { placeId?: string; rating?: number | null; count?: number | null; minStars?: number; reviews?: ReviewCard[]; syncedAt?: string | null };
  airbnb: { rating?: number | null; count?: number | null; reviews?: ReviewCard[] };
}
export type SectionsMap = Record<string, boolean>;
export interface SiteContent { caseStudies: CaseStudyItem[]; reviews: ReviewsDoc; sections?: SectionsMap; featuredHomes?: FeaturedHomeItem[]; hasDraft?: boolean; draftDocs?: string[]; }

// Reads draft-over-published (unpublished edits preview here).
export async function getContent(): Promise<SiteContent> {
  const r = await httpsCallable<unknown, SiteContent>(functions, 'adminContentGet')();
  return r.data;
}
// Saves are DRAFT until publish().
export async function saveContent(patch: { caseStudies?: CaseStudyItem[]; reviews?: Partial<ReviewsDoc>; sections?: SectionsMap }): Promise<void> {
  await httpsCallable<typeof patch, { ok: true }>(functions, 'adminContentSet')(patch);
}
export async function publish(): Promise<{ published: string[]; rebuild: string }> {
  const r = await httpsCallable<unknown, { published: string[]; rebuild: string }>(functions, 'adminPublish')();
  return r.data;
}
export async function discardDraft(): Promise<{ discarded: string[] }> {
  const r = await httpsCallable<unknown, { discarded: string[] }>(functions, 'adminDiscardDraft')();
  return r.data;
}
export async function syncGoogle(placeId?: string): Promise<{ rating: number; count: number; reviews: number }> {
  const r = await httpsCallable<{ placeId?: string }, { rating: number; count: number; reviews: number }>(functions, 'adminSyncGoogleReviews')({ placeId });
  return r.data;
}
