// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: confirm the production domain (assumes cardorentals.com for now).
// Keep this in sync with SITE.url in src/lib/site-config.js.
export default defineConfig({
  site: 'https://www.cardorentals.com',
  integrations: [
    sitemap({
      // Keep internal owner tooling out of the sitemap (also blocked in robots.txt).
      filter: (page) => !page.includes('/portal') && !page.includes('/agreement'),
    }),
  ],
});
