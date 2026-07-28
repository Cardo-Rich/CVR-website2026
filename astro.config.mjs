// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cardo Vacation Rentals marketing site.
// Static-first: the homepage is content + light client islands (header frost,
// FAQ accordion, lead form). No UI framework needed — plain Astro + vanilla JS.
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
        !page.includes('/careers'),
    }),
  ],
  // /portal is the owner-login entry. Interim: a branded splash
  // (src/pages/portal.astro) holds for ~4s with a progress bar, then forwards
  // to the owners page (owners currently sign via emailed tokenized links).
  // Staff use /admin. (Was an instant redirect; now a real page.)
});
