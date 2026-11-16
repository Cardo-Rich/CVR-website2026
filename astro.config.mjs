// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { getPublishedArticles } from './src/lib/content/articles.ts';

// <lastmod> for Journal URLs in the sitemap, so crawlers can tell which posts
// are new or were refreshed without re-fetching all of them. Each post uses its
// Firestore updatedAt (set on every save/publish), falling back to its display
// date; /blog uses the newest post's value. Read from the same source the pages
// build from (Firestore, or BLOG_FIXTURE offline). It is loaded here, while the
// config is evaluated, because the sitemap's serialize step runs after Astro has
// closed the module runner that config imports depend on. Builds only; on any
// failure the sitemap is written without lastmod rather than not at all.
/** @type {Map<string, string>} */
const journalLastmod = new Map();
if (process.argv.includes('build')) {
  try {
    for (const a of await getPublishedArticles()) {
      const raw = a.updatedAt || a.date || a.dateFull;
      const t = raw ? Date.parse(raw) : NaN;
      if (isNaN(t)) continue;
      const iso = new Date(t).toISOString();
      journalLastmod.set(`https://cardorentals.com/blog/${a.slug}`, iso);
      const newest = journalLastmod.get('https://cardorentals.com/blog');
      if (!newest || iso > newest) journalLastmod.set('https://cardorentals.com/blog', iso);
    }
  } catch (err) {
    console.warn('[sitemap] Journal lastmod skipped:', err instanceof Error ? err.message : err);
  }
}

export default defineConfig({
  site: 'https://cardorentals.com',
  // Firebase Hosting serves this site with `cleanUrls: true` + `trailingSlash:
  // false`, so /owners is the real URL and /owners/ 301s to it. Tell Astro the
  // same thing, or the sitemap and canonical tags advertise the slashed form
  // and every entry Google fetches is a redirect. Build format stays
  // `directory` (dist/owners/index.html) — that's what cleanUrls expects.
  trailingSlash: 'never',
  // Generates /sitemap-index.xml (+ /sitemap-0.xml) at build time from all
  // static routes. Referenced by /robots.txt so crawlers discover every page.
  integrations: [
    sitemap({
      // Keep private/utility routes — and pages still carrying placeholder
      // copy (/careers) — out of the sitemap. Anything listed here should
      // also be noindex'd, since the sitemap is a hint and not a gate.
      filter: (page) =>
        !page.includes('/agreement') &&
        !page.includes('/admin') &&
        !page.includes('/portal') &&
        !page.includes('/careers') &&
        // Unlisted, noindex previews of unpublished Journal drafts.
        !page.includes('/blog/preview/'),
      serialize: (item) => {
        const lastmod = journalLastmod.get(item.url.replace(/\/$/, ''));
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  // /portal is the owner-login entry. Interim: a branded splash
  // (src/pages/portal.astro) holds for ~4s with a progress bar, then forwards
  // to the owners page (owners currently sign via emailed tokenized links).
  // Staff use /admin. (Was an instant redirect; now a real page.)
});
