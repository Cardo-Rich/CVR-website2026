// Site content CMS backend: case studies + reviews, edited in the admin app
// and served to the public site via GET /api/content. Google review data can
// be synced live from the Places API (New); Airbnb has no public API, so its
// reviews are managed in the CMS.
import type { Firestore } from 'firebase-admin/firestore';

export interface CaseStudyItem {
  id: string;        // matches data-case on the owners page (falcon, nute, ...)
  name: string;
  hood: string;
  beds: string;      // e.g. "4 BR"
  hook: string;
  revenue: string;   // e.g. "$214,800"
  nightly: string;   // e.g. "$589 / night"
  lift: string;      // e.g. "+57% over market"
  img?: string;      // optional image URL override
  featured?: boolean; // true → shown on the owners page; all cases appear in the blog library
  blurb?: string;     // longer story for the preview modal (falls back to hook)
}

// "Homes we love" cards on the home page. Fully CMS-managed: name, photo, and
// the booking-site URL each card links to.
export interface FeaturedHomeItem {
  id: string;
  name: string;
  neighborhood: string;
  beds: string;        // e.g. "4 bedrooms"
  baths: string;       // e.g. "3 bathrooms"
  guests: string;      // e.g. "8 guests"
  photo: string;       // image URL
  bookingUrl: string;  // where the card links (the booking-site page)
  premier?: boolean;   // shows the "Premier" ribbon
  featured?: boolean;  // shown on the home page
}

// Guest-photo gallery tiles on the home page.
export interface GuestPhotoItem {
  id: string;
  photo: string;
  location: string;
  big?: boolean; // the large lead tile
}

export interface ReviewCard { name: string; meta: string; stars: number; text: string; }

export interface ReviewsDoc {
  google: { placeId?: string; rating?: number; count?: number; minStars?: number; reviews?: ReviewCard[]; syncedAt?: string };
  airbnb: { rating?: number; count?: number; reviews?: ReviewCard[] };
}

// Two parallel copies of every content doc: what the public site reads
// (PUBLISHED) and what an admin is editing but hasn't shipped yet (DRAFT).
// Inline edits write to DRAFT; "Publish" promotes DRAFT → PUBLISHED.
const PUBLISHED = 'siteContent';
const DRAFT = 'siteContentDraft';
export type ContentRoot = typeof PUBLISHED | typeof DRAFT;
const DOCS = ['caseStudies', 'reviews', 'sections', 'featuredHomes', 'guestPhotos'] as const;
const casesRef = (db: Firestore, root: ContentRoot) => db.doc(`${root}/caseStudies`);
const reviewsRef = (db: Firestore, root: ContentRoot) => db.doc(`${root}/reviews`);
const sectionsRef = (db: Firestore, root: ContentRoot) => db.doc(`${root}/sections`);
const featuredRef = (db: Firestore, root: ContentRoot) => db.doc(`${root}/featuredHomes`);
const guestRef = (db: Firestore, root: ContentRoot) => db.doc(`${root}/guestPhotos`);

// Section visibility switches: key → shown? Missing keys default to shown,
// so the static site is unaffected until an editor turns something off.
export type SectionsMap = Record<string, boolean>;

export interface SiteContentData { caseStudies: CaseStudyItem[]; reviews: ReviewsDoc; sections: SectionsMap; featuredHomes: FeaturedHomeItem[]; guestPhotos: GuestPhotoItem[] }

// forPublic: apply display rules (e.g. Google minimum-star filter) so the
// site only ever receives what should be shown. root selects the published
// copy (default, served at /api/content) or the draft copy (admin preview).
export async function getContent(db: Firestore, forPublic = false, root: ContentRoot = PUBLISHED): Promise<SiteContentData> {
  const [cs, rv, sec, fh, gp] = await Promise.all([casesRef(db, root).get(), reviewsRef(db, root).get(), sectionsRef(db, root).get(), featuredRef(db, root).get(), guestRef(db, root).get()]);
  const reviews = ((rv.data() as ReviewsDoc) || { google: {}, airbnb: {} });
  if (forPublic && reviews.google) {
    const min = Number(reviews.google.minStars) || 0;
    if (min > 1 && Array.isArray(reviews.google.reviews)) {
      reviews.google = { ...reviews.google, reviews: reviews.google.reviews.filter((r) => (r.stars || 0) >= min) };
    }
  }
  return {
    caseStudies: ((cs.data()?.items as CaseStudyItem[]) || []),
    reviews,
    sections: ((sec.data()?.map as SectionsMap) || {}),
    featuredHomes: ((fh.data()?.items as FeaturedHomeItem[]) || []),
    guestPhotos: ((gp.data()?.items as GuestPhotoItem[]) || []),
  };
}

// Admin view: prefer the draft copy of each doc, falling back to published for
// any doc that has no draft yet. hasDraft flags which docs carry unpublished
// edits, so the toolbar can show "draft changes pending".
export async function getContentForAdmin(db: Firestore): Promise<SiteContentData & { hasDraft: boolean; draftDocs: string[] }> {
  const draftSnaps = await Promise.all(DOCS.map((d) => db.doc(`${DRAFT}/${d}`).get()));
  const draftDocs = DOCS.filter((_, i) => draftSnaps[i].exists);
  const pub = await getContent(db, false, PUBLISHED);
  const draft = await getContent(db, false, DRAFT);
  // DOCS order: caseStudies, reviews, sections, featuredHomes, guestPhotos
  const merged: SiteContentData = {
    caseStudies: draftSnaps[0].exists ? draft.caseStudies : pub.caseStudies,
    reviews: draftSnaps[1].exists ? draft.reviews : pub.reviews,
    sections: draftSnaps[2].exists ? draft.sections : pub.sections,
    featuredHomes: draftSnaps[3].exists ? draft.featuredHomes : pub.featuredHomes,
    guestPhotos: draftSnaps[4].exists ? draft.guestPhotos : pub.guestPhotos,
  };
  return { ...merged, hasDraft: draftDocs.length > 0, draftDocs };
}

// Copy every existing draft doc onto its published counterpart, then delete
// the drafts. Returns the list of docs that were published.
export async function publishDrafts(db: Firestore): Promise<{ published: string[] }> {
  const published: string[] = [];
  for (const d of DOCS) {
    const snap = await db.doc(`${DRAFT}/${d}`).get();
    if (!snap.exists) continue;
    await db.doc(`${PUBLISHED}/${d}`).set(snap.data() as Record<string, unknown>, { merge: false });
    await db.doc(`${DRAFT}/${d}`).delete();
    published.push(d);
  }
  return { published };
}

// Throw away all pending draft edits.
export async function discardDrafts(db: Firestore): Promise<{ discarded: string[] }> {
  const discarded: string[] = [];
  for (const d of DOCS) {
    const ref = db.doc(`${DRAFT}/${d}`);
    if ((await ref.get()).exists) { await ref.delete(); discarded.push(d); }
  }
  return { discarded };
}

export async function setSections(db: Firestore, map: unknown, root: ContentRoot = DRAFT): Promise<void> {
  if (typeof map !== 'object' || map === null || Array.isArray(map)) throw new Error('sections must be an object');
  const clean: SectionsMap = {};
  for (const [k, v] of Object.entries(map as Record<string, unknown>).slice(0, 40)) {
    if (/^[a-z0-9-]{1,40}$/.test(k)) clean[k] = v !== false;
  }
  await sectionsRef(db, root).set({ map: clean }, { merge: false });
}

export async function setCaseStudies(db: Firestore, items: CaseStudyItem[], root: ContentRoot = DRAFT): Promise<void> {
  if (!Array.isArray(items)) throw new Error('items must be an array');
  const clean = items.slice(0, 60).map((it) => ({
    id: String(it.id || '').slice(0, 64),
    name: String(it.name || '').slice(0, 120),
    hood: String(it.hood || '').slice(0, 120),
    beds: String(it.beds || '').slice(0, 24),
    hook: String(it.hook || '').slice(0, 300),
    revenue: String(it.revenue || '').slice(0, 40),
    nightly: String(it.nightly || '').slice(0, 60),
    lift: String(it.lift || '').slice(0, 60),
    img: String(it.img || '').slice(0, 500),
    featured: it.featured !== false,
    blurb: String(it.blurb || '').slice(0, 1500),
  }));
  await casesRef(db, root).set({ items: clean }, { merge: false });
}

export async function setFeaturedHomes(db: Firestore, items: FeaturedHomeItem[], root: ContentRoot = DRAFT): Promise<void> {
  if (!Array.isArray(items)) throw new Error('items must be an array');
  const clean = items.slice(0, 24).map((it) => ({
    id: String(it.id || '').slice(0, 64),
    name: String(it.name || '').slice(0, 120),
    neighborhood: String(it.neighborhood || '').slice(0, 120),
    beds: String(it.beds || '').slice(0, 40),
    baths: String(it.baths || '').slice(0, 40),
    guests: String(it.guests || '').slice(0, 40),
    photo: String(it.photo || '').slice(0, 600),
    bookingUrl: String(it.bookingUrl || '').slice(0, 600),
    premier: it.premier === true,
    featured: it.featured !== false,
  }));
  await featuredRef(db, root).set({ items: clean }, { merge: false });
}

export async function setGuestPhotos(db: Firestore, items: GuestPhotoItem[], root: ContentRoot = DRAFT): Promise<void> {
  if (!Array.isArray(items)) throw new Error('items must be an array');
  const clean = items.slice(0, 40).map((it) => ({
    id: String(it.id || '').slice(0, 64),
    photo: String(it.photo || '').slice(0, 600),
    location: String(it.location || '').slice(0, 80),
    big: it.big === true,
  }));
  await guestRef(db, root).set({ items: clean }, { merge: false });
}

function cleanCards(cards: unknown): ReviewCard[] {
  if (!Array.isArray(cards)) return [];
  return cards.slice(0, 12).map((c) => {
    const card = c as Partial<ReviewCard>;
    return {
      name: String(card.name || '').slice(0, 80),
      meta: String(card.meta || '').slice(0, 120),
      stars: Math.min(5, Math.max(1, Number(card.stars) || 5)),
      text: String(card.text || '').slice(0, 1200),
    };
  });
}

export async function setReviews(db: Firestore, patch: Partial<ReviewsDoc>, root: ContentRoot = DRAFT): Promise<void> {
  const update: Record<string, unknown> = {};
  if (patch.google) {
    update.google = {
      placeId: String(patch.google.placeId || '').slice(0, 120),
      rating: Number(patch.google.rating) || null,
      count: Number(patch.google.count) || null,
      minStars: Math.min(5, Math.max(1, Number(patch.google.minStars) || 5)),
      reviews: cleanCards(patch.google.reviews),
      syncedAt: patch.google.syncedAt || null,
    };
  }
  if (patch.airbnb) {
    update.airbnb = {
      rating: Number(patch.airbnb.rating) || null,
      count: Number(patch.airbnb.count) || null,
      reviews: cleanCards(patch.airbnb.reviews),
    };
  }
  await reviewsRef(db, root).set(update, { merge: true });
}

// Pull rating, review count, and the latest review cards from the Places API
// (New) and store them on the reviews doc. Requires a SERVER key (no referrer
// restriction) and the business's place ID.
export async function syncGoogleReviews(db: Firestore, apiKey: string, placeIdOverride?: string): Promise<{ rating: number; count: number; reviews: number }> {
  // Read the place ID from the draft copy first (an admin may have just typed
  // it), then fall back to the published copy. Sync results land in the draft.
  const draftDoc = await reviewsRef(db, DRAFT).get();
  const pubDoc = await reviewsRef(db, PUBLISHED).get();
  const placeId = placeIdOverride
    || (draftDoc.data()?.google?.placeId as string | undefined)
    || (pubDoc.data()?.google?.placeId as string | undefined);
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY secret is not set');
  if (!placeId) throw new Error('No Google place ID configured — set it in the CMS Reviews tab first');

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const r = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      Accept: 'application/json',
    },
  });
  if (!r.ok) throw new Error(`Places details ${r.status}: ${await r.text()}`);
  const data = (await r.json()) as {
    rating?: number; userRatingCount?: number;
    reviews?: { authorAttribution?: { displayName?: string }; relativePublishTimeDescription?: string; rating?: number; text?: { text?: string } }[];
  };
  const reviews: ReviewCard[] = (data.reviews || []).slice(0, 8).map((rv) => ({
    name: rv.authorAttribution?.displayName || 'Google guest',
    meta: `Guest · ${rv.relativePublishTimeDescription || 'recently'}`,
    stars: Math.min(5, Math.max(1, rv.rating || 5)),
    text: rv.text?.text?.slice(0, 1200) || '',
  })).filter((rv) => rv.text);

  // Preserve the admin's chosen minStars from whichever copy already has it.
  const existingMin = (draftDoc.data()?.google?.minStars ?? pubDoc.data()?.google?.minStars) as number | undefined;
  await reviewsRef(db, DRAFT).set({
    google: {
      placeId,
      rating: data.rating ?? null,
      count: data.userRatingCount ?? null,
      minStars: existingMin ?? 5,
      reviews,
      syncedAt: new Date().toISOString(),
    },
  }, { merge: true });
  return { rating: data.rating ?? 0, count: data.userRatingCount ?? 0, reviews: reviews.length };
}
