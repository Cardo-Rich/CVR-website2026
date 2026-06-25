// @ts-check
import { defineConfig } from 'astro/config';

// Cardo Vacation Rentals marketing site.
// Static-first: the homepage is content + light client islands (header frost,
// FAQ accordion, lead form). No UI framework needed — plain Astro + vanilla JS.
export default defineConfig({
  site: 'https://cardorentals.com',
});
