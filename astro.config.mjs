// @ts-check
import { defineConfig } from 'astro/config';

// Cardo Vacation Rentals marketing site.
// Static-first: the homepage is content + light client islands (header frost,
// FAQ accordion, lead form). No UI framework needed — plain Astro + vanilla JS.
export default defineConfig({
  site: 'https://cardorentals.com',
  // /portal is the owner portal entry; for now the only portal surface is the
  // Supabase-backed agreements page. Redirect the bare route (and the site's
  // "Owner login" / form-success links) there until the full portal ships.
  redirects: {
    '/portal': '/portal/agreements',
  },
});
