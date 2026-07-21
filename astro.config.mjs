// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cardo Vacation Rentals marketing site.
// Static-first: the homepage is content + light client islands (header frost,
// FAQ accordion, lead form). No UI framework needed — plain Astro + vanilla JS.
export default defineConfig({
  site: 'https://cardorentals.com',
  // Generates /sitemap-index.xml (+ /sitemap-0.xml) at build time from all
  // static routes. Referenced by /robots.txt so crawlers discover every page.
  integrations: [
    sitemap({
      // Keep private/utility routes out of the sitemap.
      filter: (page) =>
        !page.includes('/agreement') &&
        !page.includes('/admin') &&
        !page.includes('/portal'),
    }),
  ],
  // /portal is the owner-login entry. Interim: send it to the owners page
  // until the authenticated owner portal ships (owners currently sign via
  // emailed tokenized links). Staff use /admin.
  redirects: {
    '/portal': '/owners',
  },
});
