// Firebase client for the public-site inline admin layer. Shares the same
// project/origin as the /admin SPA, so a Firebase Auth session created there is
// visible here automatically (persistence is per-origin). Everything is loaded
// lazily by inline.ts, so non-admin visitors never pay for it beyond a tiny
// idle-time auth check.
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const config = {
  apiKey: 'AIzaSyDEvpX1WsRtgaLOSHWh6Pf6SP9pzk-g0UE',
  authDomain: 'cardo-website-2026.firebaseapp.com',
  projectId: 'cardo-website-2026',
  storageBucket: 'cardo-website-2026.firebasestorage.app',
  messagingSenderId: '350974726921',
  appId: '1:350974726921:web:ad0d1bee9a616c9715f9d8',
};

const app = getApps()[0] || initializeApp(config);
export const auth = getAuth(app);
const functions = getFunctions(app, 'us-central1');
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// Upload an image to Storage (media/** is admin-writable, public-readable) and
// return its permanent download URL, for use as a photo field value.
export async function uploadPhoto(file: File): Promise<string> {
  if (!/^image\//.test(file.type)) throw new Error('Please choose an image file.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Image is too large (max 10 MB).');
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-60);
  // No Date.now() in this env is not a concern here (browser runtime), but keep
  // the path collision-resistant with a random suffix.
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `media/uploads/${rand}-${safe}`;
  const snap = await uploadBytes(storageRef(storage, path), file, { contentType: file.type });
  return getDownloadURL(snap.ref);
}

export interface CaseStudyItem {
  id: string; name: string; hood: string; beds: string; hook: string;
  revenue: string; nightly: string; lift: string; img?: string;
  featured?: boolean; blurb?: string;
}
export interface FeaturedHomeItem {
  id: string; name: string; neighborhood: string; beds: string; baths: string;
  guests: string; photo: string; bookingUrl: string; premier?: boolean; featured?: boolean;
}
export interface GuestPhotoItem { id: string; photo: string; location: string; big?: boolean }
export interface TeamMemberItem { id: string; name: string; role: string; photo: string }
export interface ReviewCard { name: string; meta: string; stars: number; text: string }
export interface ReviewsDoc {
  google: { placeId?: string; rating?: number | null; count?: number | null; minStars?: number; reviews?: ReviewCard[]; syncedAt?: string | null };
  airbnb: { rating?: number | null; count?: number | null; reviews?: ReviewCard[] };
}
export type SectionsMap = Record<string, boolean>;
export interface SiteContent { caseStudies: CaseStudyItem[]; reviews: ReviewsDoc; sections: SectionsMap; featuredHomes: FeaturedHomeItem[]; guestPhotos: GuestPhotoItem[]; teamMembers: TeamMemberItem[]; hasDraft?: boolean; draftDocs?: string[] }

export function watchAdmin(cb: (isAdmin: boolean, user: User | null) => void): void {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return cb(false, null);
    try {
      const token = await user.getIdTokenResult();
      cb(token.claims.admin === true, user);
    } catch { cb(false, user); }
  });
}

export async function login(): Promise<void> { await signInWithPopup(auth, provider); }
export async function logout(): Promise<void> { await signOut(auth); }

export const getContent = () => httpsCallable<unknown, SiteContent>(functions, 'adminContentGet')().then((r) => r.data);
export const saveContent = (patch: { caseStudies?: CaseStudyItem[]; reviews?: Partial<ReviewsDoc>; sections?: SectionsMap; featuredHomes?: FeaturedHomeItem[]; guestPhotos?: GuestPhotoItem[]; teamMembers?: TeamMemberItem[] }) =>
  httpsCallable<typeof patch, { ok: true }>(functions, 'adminContentSet')(patch).then((r) => r.data);
export const publishDrafts = () => httpsCallable<unknown, { published: string[]; rebuild: string }>(functions, 'adminPublish')().then((r) => r.data);
export const discardDrafts = () => httpsCallable<unknown, { discarded: string[] }>(functions, 'adminDiscardDraft')().then((r) => r.data);
export const syncGoogle = (placeId?: string) =>
  httpsCallable<{ placeId?: string }, { rating: number; count: number; reviews: number }>(functions, 'adminSyncGoogleReviews')({ placeId }).then((r) => r.data);
