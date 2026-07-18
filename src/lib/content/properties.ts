import { getDb } from './firestore';
import { homePhotos } from '../../data/home';
import type { Property, FeaturedEntry } from './types';

export interface FeaturedCard {
  slug: string;
  name: string;
  neighborhood: string;
  specs: string[];
  photo: string;
  premier: boolean;
  href: string;
}

// Copied verbatim from src/components/home/FeaturedHomes.astro `cards` array.
const seedCards = [
  { slug: 'la-jolla',      photo: 'living-craftsman', name: 'Bluff Villa',       loc: 'La Jolla',      specs: ['4 bedrooms', '3 bathrooms', '8 guests'],  premier: true },
  { slug: 'pacific-beach', photo: 'living-bright',    name: 'Surf Bungalow',     loc: 'Pacific Beach', specs: ['3 bedrooms', '2 bathrooms', '6 guests'],  premier: false },
  { slug: 'del-mar',       photo: 'dining',           name: 'Craftsman Retreat', loc: 'Del Mar',       specs: ['4 bedrooms', '3 bathrooms', '8 guests'],  premier: false },
  { slug: 'mission-beach', photo: 'bedroom-floral',   name: 'Sand Cottage',      loc: 'Mission Beach', specs: ['2 bedrooms', '2 bathrooms', '4 guests'],  premier: false },
  { slug: 'encinitas',     photo: 'gameroom',         name: 'Surf House',        loc: 'Encinitas',     specs: ['3 bedrooms', '2 bathrooms', '6 guests'],  premier: false },
  { slug: 'coronado',      photo: 'pool',             name: 'Island Estate',    loc: 'Coronado',      specs: ['5 bedrooms', '4 bathrooms', '10 guests'], premier: true },
];

function fromSeed(): FeaturedCard[] {
  return seedCards.map(c => ({
    slug: c.slug,
    name: c.name,
    neighborhood: c.loc,
    specs: c.specs,
    photo: homePhotos[c.photo as keyof typeof homePhotos],
    premier: c.premier,
    href: `/neighborhoods/${c.slug}`,
  }));
}

// CMS-managed "Homes we love" cards (siteContent/featuredHomes), edited inline
// on the site. Takes precedence over the Guesty-synced properties path below.
interface CmsFeaturedItem {
  id?: string; name?: string; neighborhood?: string; beds?: string; baths?: string;
  guests?: string; photo?: string; bookingUrl?: string; premier?: boolean; featured?: boolean;
}
function cmsToCards(items: CmsFeaturedItem[]): FeaturedCard[] {
  return items
    .filter((it) => it && it.featured !== false && it.name)
    .map((it) => ({
      slug: it.id || (it.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      name: it.name || '',
      neighborhood: it.neighborhood || '',
      specs: [it.beds, it.baths, it.guests].filter(Boolean) as string[],
      photo: it.photo || '',
      premier: it.premier === true,
      href: it.bookingUrl || '#',
    }));
}

export async function getFeaturedProperties(): Promise<FeaturedCard[]> {
  const db = getDb();
  if (!db) return fromSeed();

  try {
    const cmsDoc = await db.collection('siteContent').doc('featuredHomes').get();
    if (cmsDoc.exists) {
      const cards = cmsToCards((cmsDoc.data()?.items as CmsFeaturedItem[]) || []);
      if (cards.length) return cards;
    }

    const featuredDoc = await db.collection('homepage').doc('featured').get();
    if (!featuredDoc.exists) return fromSeed();

    const data = featuredDoc.data() as { propertyIds?: FeaturedEntry[] } | FeaturedEntry[] | undefined;
    const entries: FeaturedEntry[] = Array.isArray(data) ? data : (data?.propertyIds ?? []);
    if (!entries.length) return fromSeed();

    const cards: FeaturedCard[] = [];
    for (const entry of entries) {
      const propSnap = await db.collection('properties').doc(entry.id).get();
      if (!propSnap.exists) continue;
      const p = propSnap.data() as Property;
      cards.push({
        slug: entry.id,
        name: p.name,
        neighborhood: p.neighborhood,
        specs: [p.beds, p.baths, p.guests],
        photo: p.photos?.[0] ?? '',
        premier: entry.premier,
        href: p.bookingUrl,
      });
    }

    return cards.length ? cards : fromSeed();
  } catch {
    return fromSeed();
  }
}
