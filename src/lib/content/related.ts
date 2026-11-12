// Picks the "More from the Journal" cards for an article by topic, so a guest
// guide links to other guest guides and an owner post to other owner posts,
// instead of whatever happens to sit next to it in the list. Internal links
// between related posts help readers and help search engines understand which
// pages belong together.
import { categoryGroups } from '../../data/blog';

interface RelatedSource {
  slug: string;
  title: string;
  category: string;
  excerpt?: string;
  showOnHome?: boolean;
}

const guestCategories = new Set<string>([
  'Explore like a local',
  ...(categoryGroups['Explore like a local'] || []),
]);

// Same rule the article page uses for the booking CTA.
export const isGuestArticle = (a: RelatedSource) =>
  a.showOnHome === true || guestCategories.has(a.category);

/**
 * Score every other article against `a`: same category first, then same
 * audience (guest vs owner), then a shared neighborhood name. Ties keep the
 * original list order (newest first), so the result is stable between builds.
 */
export function pickRelated<T extends RelatedSource>(
  a: RelatedSource,
  articles: T[],
  neighborhoodNames: string[] = [],
  count = 3,
): T[] {
  const guest = isGuestArticle(a);
  const own = `${a.title} ${a.excerpt || ''}`;
  const areas = neighborhoodNames.filter((n) => own.includes(n));
  return articles
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => p.slug !== a.slug)
    .map(({ p, i }) => {
      const text = `${p.title} ${p.excerpt || ''}`;
      let score = 0;
      if (p.category === a.category) score += 3;
      if (isGuestArticle(p) === guest) score += 2;
      if (areas.some((n) => text.includes(n))) score += 1;
      return { p, i, score };
    })
    .sort((x, y) => y.score - x.score || x.i - y.i)
    .slice(0, count)
    .map(({ p }) => p);
}
