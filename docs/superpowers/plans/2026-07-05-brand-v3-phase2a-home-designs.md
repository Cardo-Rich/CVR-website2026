# Brand V3 — Phase 2a (Home Designs page) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the "Home Designs by Cardo" marketing page at `/home-designs`, and introduce the reusable marketing-page header + a shared scroll-reveal island that later Phase-2/3/4/5 pages will also use.

**Architecture:** `home-designs` is a small, mostly-static page whose styling is fully covered by the global `site.css` + token layer plus ~44 lines of page-specific CSS (kept in a scoped `<style>` on the page). It uses a new props-driven `MarketingHeader.astro` (logo + text nav + one CTA button, scroll-frost) — distinct from the guest `Header` (search + "Manage my home"). A shared `reveal.js` island drives the `.reveal` scroll-in used across marketing pages.

**Tech Stack:** Astro 7, global CSS + scoped page `<style>`, vanilla JS island. No test runner — verify via `npm run build` + visual review.

## Global Constraints

- **Fidelity:** high — pixel-for-pixel from the token layer; do not invent values.
- **Links:** extensionless routes only. Rewrites used on this page: `owners.html`→`/owners`, `home-designs.html`→`/home-designs`, `home-designs.html#case-studies`→`/home-designs#case-studies` (same-page anchor may be `#case-studies`), `blog.html`→`/blog`, `case-study-<name>.html`→`/case-studies/<name>`, `owners.html#estimate`→`/owners#estimate`, `owners.html#neighborhoods`→`/neighborhoods`, `neighborhood-<slug>.html`→`/neighborhoods/<slug>`. `tel:` links unchanged. (Case-study, owners, neighborhood, blog routes land in later phases — those links will 404 until then; that is expected, not a defect.)
- **Asset paths:** `assets/…`→`/assets/…`. Local `assets/photos/designs-*.jpg` → `homePhotos[...]` from `src/data/home.ts` (existing). Logos already in `public/assets/`.
- **Motion:** the reveal island must be gated behind `prefers-reduced-motion` (show everything immediately when reduced).
- **Branch:** continue on `feat/brand-v3-site` (extends PR #10). Commit after every task. Do NOT push to `main`.
- **Shared Footer:** reuse the existing `src/components/sections/Footer.astro` (one canonical footer for the whole site; the reference's minor per-page footer link variations are intentionally NOT reproduced).

## File Structure

- `src/components/sections/MarketingHeader.astro` — **created** (Task 1): reusable header for owner/design/neighborhood/blog/case-study pages. Props: nav links + CTA. Scroll-frost script. Styles from global `site.css`.
- `src/scripts/reveal.js` — **created** (Task 2): shared IntersectionObserver island for `.reveal`, reduced-motion aware.
- `src/pages/home-designs.astro` — **created** (Task 3): the page — 7 sections ported from the reference, scoped `<style>` for page-specific classes, `MarketingHeader` + `Footer`, imports `reveal.js`.

## Interfaces (locked signatures for cross-task use)

`MarketingHeader.astro` Props:
```ts
interface Props {
  logoHref?: string;                                   // default '/'
  nav: { label: string; href: string; active?: boolean }[];
  cta?: { label: string; href: string };
}
```

---

## Task 1: Reusable marketing header

**Files:**
- Create: `src/components/sections/MarketingHeader.astro`

**Interfaces:**
- Consumes: global `site.css` `.site-header*` classes (already in repo).
- Produces: `<MarketingHeader nav={[...]} cta={{...}} />` used by `home-designs.astro` (Task 3) and later marketing pages.

The reference marketing header (home-designs.html:57–68) is: logo link + a text nav of `<a>`s (one may have `is-active`) + a trailing `.btn.btn-sm` CTA inside the nav. Uses the same `.site-header`/`.site-header__inner`/`.site-header__nav` classes as the guest header, which live in global `site.css`, plus the scroll-frost `.is-scrolled` toggle.

- [ ] **Step 1: Create `MarketingHeader.astro`**

```astro
---
interface Props {
  logoHref?: string;
  nav: { label: string; href: string; active?: boolean }[];
  cta?: { label: string; href: string };
}
const { logoHref = '/', nav, cta } = Astro.props;
---

<header class="site-header" data-header data-screen-label="Header">
  <div class="site-header__inner">
    <a href={logoHref} class="site-header__logo" aria-label="Cardo — home">
      <img src="/assets/logo-horizontal-color.png" alt="Cardo Vacation Rentals" />
    </a>
    <nav class="site-header__nav">
      {nav.map((n) => (
        <a href={n.href} class={n.active ? 'is-active' : undefined}>{n.label}</a>
      ))}
      {cta && <a href={cta.href} class="btn btn-sm">{cta.label}</a>}
    </nav>
  </div>
</header>

<script>
  const header = document.querySelector('[data-header]');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
</script>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: succeeds (component compiles; not yet imported by a page).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/MarketingHeader.astro
git commit -m "feat(v3): reusable props-driven marketing header"
```

---

## Task 2: Shared scroll-reveal island

**Files:**
- Create: `src/scripts/reveal.js`

**Interfaces:**
- Produces: a self-invoking island that adds `.is-in` to `.reveal` elements as they enter view (or immediately under reduced motion). Imported by `home-designs.astro` (Task 3) and later marketing pages. `site.css` already defines the `.reveal`/`.reveal.is-in` transition (gated behind `prefers-reduced-motion: no-preference`).

- [ ] **Step 1: Create `src/scripts/reveal.js`** (ported from home-designs.html:212–219)

```js
/* reveal.js — reveal .reveal elements on scroll; show all immediately under reduced motion. */
(function () {
  'use strict';
  var els = document.querySelectorAll('.reveal');
  if (('IntersectionObserver' in window) && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    [].forEach.call(els, function (el) { el.classList.add('is-in'); });
  }
})();
```

- [ ] **Step 2: Sanity-check (no module syntax)**

Run: `grep -e "import " -e "export " src/scripts/reveal.js`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add src/scripts/reveal.js
git commit -m "feat(v3): shared scroll-reveal island for marketing pages"
```

---

## Task 3: Home Designs page

**Files:**
- Create: `src/pages/home-designs.astro`

**Interfaces:**
- Consumes: `MarketingHeader` (Task 1), `reveal.js` (Task 2), `Footer` (existing), `Base` (existing), `homePhotos` from `../data/home`, global `site.css`.
- Produces: the `/home-designs` route.

Port the reference `design_handoff_v3_site/design-reference/home-designs.html` `<main>` (lines 70–200) verbatim into the page, applying the Global-Constraints link + image rewrites, and carry the reference's inline `<style>` (lines 11–54) into a scoped `<style>` block on the page.

- [ ] **Step 1: Create `src/pages/home-designs.astro`**

Frontmatter + composition:
```astro
---
import Base from '../layouts/Base.astro';
import MarketingHeader from '../components/sections/MarketingHeader.astro';
import Footer from '../components/sections/Footer.astro';
import { homePhotos } from '../data/home';
import '../scripts/reveal.js'; // NOTE: prefer a <script> import at the bottom instead — see Step 2

const nav = [
  { label: 'For Owners', href: '/owners' },
  { label: 'Design', href: '/home-designs', active: true },
  { label: 'Case studies', href: '/home-designs#case-studies' },
  { label: 'Blog', href: '/blog' },
];
const cta = { label: 'Start a design consult', href: '#consult' };
---
```

Then `<Base title="Home Designs by Cardo — In-house interior design, San Diego" description="Home Designs by Cardo furnishes and styles your San Diego rental end to end — so it photographs beautifully and commands higher nightly rates.">`, containing `<MarketingHeader {nav} {cta} />`, `<main>` with the 7 ported sections, `<Footer />`.

**Image rewrites in the ported sections** (all keys exist in `homePhotos`):
- phero `assets/photos/designs-living-craftsman.jpg` → `{homePhotos['living-craftsman']}`
- case cards: `designs-living-craftsman.jpg`→`living-craftsman` (Falcon), `designs-living-bright.jpg`→`living-bright` (Nute), `designs-dining.jpg`→`dining` (Twain), `designs-bedroom-floral.jpg`→`bedroom-floral` (Sixth), `designs-gameroom.jpg`→`gameroom` (Kane), `designs-pool.jpg`→`pool` (Mt Ainsworth)

**Link rewrites in the ported sections:**
- `#process`, `#consult`, `#case-studies` same-page anchors stay as `#...`
- case-study cards: `case-study-falcon.html`→`/case-studies/falcon`, `case-study-nute.html`→`/case-studies/nute`, `case-study-twain.html`→`/case-studies/twain`, `case-study-sixth.html`→`/case-studies/sixth`, `case-study-kane.html`→`/case-studies/kane`, `case-study-mt-ainsworth.html`→`/case-studies/mt-ainsworth`
- CTA section: `owners.html#estimate`→`/owners#estimate`; `tel:+16197195282` unchanged

**Scoped style:** copy the reference's `<style>` block (home-designs.html:11–54: `.hd-intro__grid`, `.hd-stats`, `.hd-stat*`, `.proc*`, `.incl*`, `.gal*`, `.qband*`) verbatim into a `<style>` block at the bottom of the page. (`.gal` rules are unused on this page but port verbatim — harmless.)

- [ ] **Step 2: Load the reveal island as a bundled `<script>`**

Instead of the frontmatter import shown above, load `reveal.js` via a `<script>` at the bottom of the page so Astro bundles it as a client island:
```astro
<script>
  import '../scripts/reveal.js';
</script>
```
Remove the frontmatter `import '../scripts/reveal.js';` line if present (frontmatter runs at build time, not in the browser).

- [ ] **Step 3: Build + verify the route and content**

Run: `npm run build`
Expected: succeeds; `dist/home-designs/index.html` exists. Verify: `grep -c -e "hd-intro__grid" -e "cases__grid" -e "id=\"case-studies\"" dist/home-designs/index.html` → non-zero; `grep -c "\.html" dist/home-designs/index.html` → `0` (no leftover `.html` links).

- [ ] **Step 4: Commit**

```bash
git add src/pages/home-designs.astro
git commit -m "feat(v3): Home Designs by Cardo page (/home-designs)"
```

---

## Task 4: Phase 2a verification + push

**Files:** none.

- [ ] **Step 1: Clean build**

Run: `npm run build`
Expected: succeeds, no errors; both `/` and `/home-designs` present in `dist/`.

- [ ] **Step 2: Visual smoke test (dev server)**

Start the dev server and open `/home-designs`. Confirm against `design_handoff_v3_site/design-reference/home-designs.html`:
- Marketing header: logo, nav (For Owners / Design[active] / Case studies / Blog) + "Start a design consult" button; frosts on scroll.
- `.phero` hero image + overlay + heading + two buttons.
- Intro stats grid; 4-step process (sand band); 6 case-study cards (`.case`) linking to `/case-studies/...`; included grid; quote band; CTA band.
- Gold eyebrows, white bg, square-ish tokens, `.reveal` sections fade in on scroll.
- No console errors (a `/case-studies/*` 404 on click is expected — those pages are Phase 5).

- [ ] **Step 3: Push (updates PR #10 preview)**

```bash
git push
```
Confirm the branch pushed; the existing PR #10 preview deploy will rebuild with `/home-designs` included.

- [ ] **Step 4: Report the Phase 2a checkpoint** to the user (home-designs live on the preview) before starting Phase 2b (owners).

---

## Self-Review

**Spec coverage:** `/home-designs` route with `#case-studies` anchor ✓ (Task 3); marketing header variant ✓ (Task 1); shared reveal island ✓ (Task 2); extensionless links + image rewrites ✓ (Global Constraints, applied Task 3); reduced-motion gating ✓ (Task 2); shared Footer reused ✓; build+visual verification ✓ (Task 4).

**Deviations, noted:** (1) The reference's per-page footer link variations are not reproduced — one canonical `Footer` is reused site-wide (consistency). (2) Case-study/owners/blog/neighborhood links point at routes built in later phases and will 404 until then (expected). (3) The reference `.gal` gallery CSS is ported verbatim though unused on this page (faithful, harmless).

**Placeholder scan:** none.

**Type consistency:** `MarketingHeader` Props (`logoHref?`, `nav[]`, `cta?`) defined in Task 1 and consumed exactly in Task 3. `homePhotos` keys used (`living-craftsman`, `living-bright`, `dining`, `bedroom-floral`, `gameroom`, `pool`) all exist in `src/data/home.ts`.
