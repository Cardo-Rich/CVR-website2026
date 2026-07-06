# Brand V3 — Phase 1 (Foundation + Home) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bump the repo's design tokens to Brand V3 and ship the new V3 guest home page (`/`), replacing the legacy home, with all chrome, styles, and interactions ported into the Astro repo.

**Architecture:** Port the handoff's proven, page-oriented CSS into two global stylesheets (`src/styles/site.css` shared chrome + `src/styles/home.css` home layer with `v3-overrides.css` folded in last). Rebuild the home as markup-only Astro section components under `src/components/home/`, composed by `src/pages/index.astro`. Port the two vanilla scripts (`guest.js`, `v3-home.js`) as bundled `<script>` islands. Rewrite `.html` links to extensionless routes and `assets/…` paths to `/assets/…`.

**Tech Stack:** Astro 7, vanilla CSS (CSS custom properties / token layer), vanilla JS islands. No test runner in repo — verification is `npm run build` success + visual review in the dev server.

## Global Constraints

- **Fidelity:** high — pixel-for-pixel from the token layer; do not invent color/spacing/radius values. All values come from `src/styles/tokens/*` after the V3 bump.
- **Brand V3 tokens (verbatim from handoff):** display font **Cardo** (weight 400); page background **white `#FFFFFF`** (sand `#F8F3EC` = accent band only); ink **`#0E111B`**; radii **`0`** for buttons/inputs/cards/photos, pill `999px` for chips/tags only; eyebrows **gold `#C19A5B`** (rose reserved for actions).
- **Links:** extensionless Astro routes only — `owners.html` → `/owners`, `neighborhood-la-jolla.html` → `/neighborhoods/la-jolla`, `blog.html` → `/blog`, `index.html` → `/`, `portal.html` → `/portal`, `home-designs.html` → `/home-designs`, `neighborhoods.html` → `/neighborhoods`. Anchor targets keep their hash (`owners.html#estimate` → `/owners#estimate`).
- **Asset paths:** `assets/…` → `/assets/…`. Missing local photos (`assets/photos/designs-*.jpg`) and the hero video are NOT in the bundle — substitute Unsplash placeholders (Task 4); the two logos (`logo-horizontal-color.png`, `logo-horizontal-white-color.png`) DO exist in `public/assets/`.
- **Motion:** every scroll/hover animation gated behind `prefers-reduced-motion` (the ported JS already does this — preserve it).
- **Branch:** `feat/brand-v3-site` (already checked out). Commit after every task. Do NOT push to `main`.
- **Node:** `>=20`.

## File Structure

- `src/styles/tokens/*.css` — **modified** (Task 1): replaced with V3 versions.
- `src/styles/site.css` — **created** (Task 2): shared chrome + section utilities (from reference `site.css`), imported globally by `Base.astro`.
- `src/styles/home.css` — **created** (Task 3): home/guest experience CSS (`guest.css` + `home-extra.css` + home slice of `additions.css` + `v3-overrides.css` folded last), imported by `index.astro`.
- `src/data/home.ts` — **created** (Task 4): home content + Unsplash image map for the home page.
- `src/layouts/Base.astro` — **modified** (Task 2): white bg, import `site.css`.
- `src/components/sections/Header.astro` — **modified** (Task 5): V3 guest header + PM control + reveal overlay, extensionless links, markup-only (styles global).
- `src/components/sections/Footer.astro` — **modified** (Task 6): extensionless nav links matching the reference footer.
- `src/scripts/guest.js`, `src/scripts/v3-home.js` — **created** (Task 7): ported interaction islands.
- `src/components/home/*.astro` — **created** (Tasks 8a–8d): 10 markup-only section components.
- `src/pages/index.astro` — **modified** (Task 9): composes the V3 home, imports `home.css` + scripts.

Legacy section components (`Hero`, `StatsBar`, `Pillars`, `CaseStudies`, `Neighborhoods`, `Testimonials`, `FAQ`, `LeadForm`) are left in place but unused after Task 9 (may be reused in later phases).

---

## Task 1: Bump design tokens to Brand V3

**Files:**
- Modify: `src/styles/tokens/colors.css`, `typography.css`, `fonts.css`, `spacing.css`, `base.css`

**Interfaces:**
- Produces: V3 CSS custom properties (`--ink:#0E111B`, `--radius-sm/-/-lg:0`, `--eyebrow`, `--sunset`, `--sunny`, `--gradient-gold`, `--gradient-accent`, `--font-display:"Cardo"`, `--weight-display`) and new base utilities (`.gold-bar`, `.accent-fill`, `.bleed`, `.media`, `.media-label`, `.surface-sand`) consumed by all later tasks.

- [ ] **Step 1: Copy the five V3 token files over the repo's**

```bash
cp design_handoff_v3_site/design-reference/styles/tokens/colors.css     src/styles/tokens/colors.css
cp design_handoff_v3_site/design-reference/styles/tokens/typography.css  src/styles/tokens/typography.css
cp design_handoff_v3_site/design-reference/styles/tokens/fonts.css       src/styles/tokens/fonts.css
cp design_handoff_v3_site/design-reference/styles/tokens/spacing.css     src/styles/tokens/spacing.css
cp design_handoff_v3_site/design-reference/styles/tokens/base.css        src/styles/tokens/base.css
```

- [ ] **Step 2: Verify the deltas landed**

Run: `grep -e "--ink:" -e "--radius-sm:" -e "font-display" -e "gradient-gold" src/styles/tokens/*.css`
Expected: `--ink: #0E111B`, `--radius-sm: 0px`, `--font-display: "Cardo"…`, and a `--gradient-gold` line.

- [ ] **Step 3: Build to confirm the token layer still compiles**

Run: `npm run build`
Expected: build succeeds (the existing `index.astro` still builds; it now renders in V3 — white bg, square corners, Cardo display — which is intended).

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens
git commit -m "feat(v3): bump design tokens to Brand V3"
```

---

## Task 2: Global site chrome stylesheet + Base layout

**Files:**
- Create: `src/styles/site.css`
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Consumes: V3 tokens (Task 1).
- Produces: global classes `.section-wrap`, `.section-narrow`, `.section-pad`, `.section-pad-sm`, `.section-head`, `.reveal`/`.reveal.is-in`, `.site-header*`, `.footer*`, `.phero*`, `.cta*`, `.case*` — used by Header/Footer (Tasks 5–6) and home sections (Task 8).

- [ ] **Step 1: Create `src/styles/site.css` from the reference**

Copy `design_handoff_v3_site/design-reference/styles/site.css` (79 lines) verbatim into `src/styles/site.css`, with **one edit**: replace the always-frosted header rule (reference line 26) so the header is transparent by default and frosts only after scroll (matches the handoff "frosts only after scroll" + the existing scroll script). Replace:

```css
.site-header { position: sticky; top: 0; z-index: 50; background: rgba(248,243,236,.86); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); transition: all .3s var(--ease); }
```

with:

```css
.site-header { position: sticky; top: 0; z-index: 50; background: transparent; border-bottom: 1px solid transparent; transition: background .3s var(--ease), border-color .3s var(--ease); }
.site-header.is-scrolled { background: rgba(255,255,255,.86); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
```

Leave all other rules (`.section-*`, `.reveal`, `.phero`, `.cta`, `.footer`, `.case*`) exactly as in the reference.

- [ ] **Step 2: Import `site.css` globally and set white background in `Base.astro`**

In `src/layouts/Base.astro`, add the import after the existing styles import, and change the body background.

Change the frontmatter import block from:
```astro
import '../styles/styles.css';
```
to:
```astro
import '../styles/styles.css';
import '../styles/site.css';
```

Change the `<style>` block at the bottom from:
```astro
<style>
  body {
    background: var(--cream);
  }
</style>
```
to:
```astro
<style>
  body {
    background: var(--surface-page); /* V3: white */
  }
</style>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/styles/site.css src/layouts/Base.astro
git commit -m "feat(v3): add global site chrome stylesheet, white page bg"
```

---

## Task 3: Global home stylesheet (guest experience + V3 overrides)

**Files:**
- Create: `src/styles/home.css`

**Interfaces:**
- Consumes: V3 tokens (Task 1), `site.css` utilities (Task 2).
- Produces: global classes for every home section — `.ghero*`, `.bookbar*`, `.gtrust*`, `.showcase*`, `.scard*`, `.locals*`, `.welcome*`, `.guarantee*`, `.cphoto(s)*`, `.todo*`, `.jshow*`/`.jpost*`, `.post-meta`, `.crossover*`, `.ownrev*`, `.feed*`, `.revtab(s)*`/`.revpanel`, `.greview(s)*`, `.abnb*`, `.navsearch*`, `.pm-*` — used by Header (Task 5) and home sections (Task 8).

Build the file by concatenating the reference sheets **in this exact order** (so `v3-overrides` wins), each under a labeled comment banner. Copy each source file's contents verbatim; only the `v3-overrides` block changes anything already defined.

- [ ] **Step 1: Assemble `src/styles/home.css` in load order**

```bash
{
  echo "/* ============ home.css — ported home/guest experience layer ============ */"
  echo "/* Source order preserved: home-extra → guest → additions → v3-overrides. */"
  echo ""
  echo "/* ---- from styles/home-extra.css ---- */"
  cat design_handoff_v3_site/design-reference/styles/home-extra.css
  echo ""
  echo "/* ---- from styles/guest.css ---- */"
  cat design_handoff_v3_site/design-reference/styles/guest.css
  echo ""
  echo "/* ---- from styles/additions.css ---- */"
  cat design_handoff_v3_site/design-reference/styles/additions.css
  echo ""
  echo "/* ---- from styles-v3/v3-overrides.css (folded last — V3 retunes win) ---- */"
  cat design_handoff_v3_site/design-reference/styles-v3/v3-overrides.css
} > src/styles/home.css
```

Note: `additions.css` also carries owner-page CSS (wizard/estimate) that the home doesn't use — leaving it in is harmless (unused selectors) and keeps later phases covered. Do NOT hand-trim it.

- [ ] **Step 2: Remove the Tweaks A/B toggle block (authoring-only)**

In `src/styles/home.css`, delete the `v3-overrides` block titled "Live A/B toggles (driven by the retuned Tweaks panel)" — the `html[data-corners="rounded"]` and `html[data-eyebrow="rose"]` rules (reference `v3-overrides.css` lines 37–63). The defaults are already V3; these are authoring controls only. **Keep** the two lines that force white eyebrows on dark sections — re-add them immediately after the deletion so home-page dark-section eyebrows stay white:

```css
/* keep: white-on-dark eyebrows */
.ghero .eyebrow,
.crossover .eyebrow,
.crossover__owners .eyebrow { color: #fff !important; }
```

- [ ] **Step 3: Verify the new home selectors exist and the toggle block is gone**

Run: `grep -c -e "\.cphoto" -e "\.jpost" -e "data-corners" src/styles/home.css`
Expected: non-zero counts for `.cphoto` and `.jpost`, and `0` for `data-corners`.

- [ ] **Step 4: Commit**

```bash
git add src/styles/home.css
git commit -m "feat(v3): add global home stylesheet (guest layer + v3 overrides)"
```

---

## Task 4: Home content + image map

**Files:**
- Create: `src/data/home.ts`

**Interfaces:**
- Produces: `homePhotos` (Record of local-photo key → Unsplash URL) and typed home content arrays consumed by the section components (Task 8). Section components import from `../../data/home`.

The reference's local `assets/photos/designs-*.jpg` are not in the bundle. Centralize substitutions here so production swaps are one-file changes.

- [ ] **Step 1: Create `src/data/home.ts`**

```ts
// =============================================================
// Cardo V3 home — content + image map.
// Local `assets/photos/designs-*.jpg` were not shipped in the handoff;
// these Unsplash placeholders stand in. Swap for Cardo photography in
// production by replacing the URLs here (or dropping files in
// public/assets/photos and pointing these keys at them).
// =============================================================

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// keyed by the reference's designs-*.jpg basename (without extension)
export const homePhotos = {
  'living-craftsman': U('1618221195710-dd6b41faaea6'),
  'living-bright': U('1616486338812-3dadae4b4ace'),
  'dining': U('1617806118233-18e1de247200'),
  'bedroom-floral': U('1522708323590-d24dbb6b0267'),
  'gameroom': U('1598928506311-c55ded91a20c'),
  'pool': U('1613490493576-7fde63acd811'),
  'amenities': U('1600585154340-be6161a56a0c'),
  'living-fireplace': U('1600607687939-ce8a6c25118c', 1600),
} as const;

export type HomePhotoKey = keyof typeof homePhotos;

// Hero video: no source shipped. Leave the poster as the visible hero;
// drop a file at public/assets/video/san-diego-hero.mp4 to enable video.
export const heroPoster = U('1613490493576-7fde63acd811', 2000);
```

- [ ] **Step 2: Type-check**

Run: `npm run build`
Expected: build succeeds (unused module compiles).

- [ ] **Step 3: Commit**

```bash
git add src/data/home.ts
git commit -m "feat(v3): add home content + Unsplash image map"
```

---

## Task 5: V3 guest header + Property-Management reveal

**Files:**
- Modify: `src/components/sections/Header.astro`

**Interfaces:**
- Consumes: `site.css` + `home.css` classes (`.site-header*`, `.navsearch*`, `.pm-*`), `guest.js` (Task 7) which drives `[data-navsearch]`, `[data-pm-control]`, `[data-pm-overlay]`.
- Produces: the guest header markup + reveal overlay rendered on the home page.

Replace the whole component with the V3 guest header ported from `index-v3.html` lines 18–58 (header + `pm-overlay`), rewriting `assets/…`→`/assets/…` and `.html` links→routes. Keep the scroll-frost script.

- [ ] **Step 1: Replace `Header.astro` contents**

```astro
---
// V3 guest header: centered nav search + black "Manage my home" control with
// a hover reveal overlay. Styles live in global site.css + home.css.
---

<header class="site-header" data-header data-screen-label="Header">
  <div class="site-header__inner">
    <a href="/" class="site-header__logo" aria-label="Cardo — home">
      <img src="/assets/logo-horizontal-color.png" alt="Cardo Vacation Rentals" />
    </a>
    <nav class="site-header__nav site-header__nav--guest">
      <form class="navsearch" data-navsearch aria-label="Search rentals">
        <svg class="navsearch__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <select aria-label="Where"><option>Anywhere</option><option>La Jolla</option><option>Pacific Beach</option><option>Mission Beach</option><option>Del Mar</option><option>Encinitas</option><option>Carlsbad</option><option>Coronado</option></select>
        <span class="navsearch__div"></span>
        <input type="date" value="2026-07-10" aria-label="Check in" />
        <span class="navsearch__div"></span>
        <input type="date" value="2026-07-15" aria-label="Check out" />
        <button type="submit" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></button>
      </form>
      <span class="pm-control" data-pm-control>
        <a class="pm-link" href="/owners" data-pm-link>Manage my home</a>
        <a class="pm-cta pm-cta--v3" href="/owners" data-pm-cta tabindex="-1"><span class="pm-cta__swipe"><span>Manage my home</span><span aria-hidden="true">Manage my home</span></span></a>
      </span>
    </nav>
  </div>
</header>

<!-- Property Management reveal overlay -->
<div class="pm-overlay" data-pm-overlay aria-hidden="true">
  <div class="pm-overlay__inner">
    <p class="pm-overlay__head" data-pm-anim>
      <span>Premium Care.</span>
      <span>Proven Performance.</span>
      <span>Peace of Mind.</span>
    </p>
    <p class="pm-overlay__sub">Thoughtful management that protects your home, delights your guests, and drives stronger results.</p>
    <div class="pm-overlay__reviews">
      <span class="pm-grev">
        <svg class="pm-grev__g" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        <b>Google</b>
      </span>
      <span class="pm-grev__score">4.9</span>
      <span class="pm-grev__stars" aria-label="4.9 out of 5">★★★★★</span>
      <span class="pm-grev__count">2,000+ reviews</span>
    </div>
  </div>
</div>

<script>
  const header = document.querySelector('[data-header]');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
</script>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds. (The header is now unused by `index.astro` until Task 9, but must compile; it no longer imports `Button`/`nav`.)

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Header.astro
git commit -m "feat(v3): V3 guest header + property-management reveal overlay"
```

---

## Task 6: Footer with extensionless V3 links

**Files:**
- Modify: `src/components/sections/Footer.astro`

**Interfaces:**
- Consumes: `site.css` `.footer*` classes, `company` from `data/site`.
- Produces: the footer rendered on every page.

Match the reference footer (`index-v3.html` lines 502–510): four link columns (Guests / Markets / Owners) with extensionless hrefs. Keep the existing scoped `<style>` OR drop it in favor of global `site.css` — **drop it** (site.css already defines `.footer*`), so the component is markup-only.

- [ ] **Step 1: Replace `Footer.astro` contents**

```astro
---
import { company } from '../../data/site';
---

<footer class="footer" data-screen-label="Footer">
  <div class="footer__main">
    <div class="footer__brand">
      <img src="/assets/logo-horizontal-white-color.png" alt="Cardo" class="footer__logo" />
      <p>Luxury short-term rental management in San Diego. 5-star Superhost since 2013.</p>
      <a href={`tel:${company.phoneHref}`} class="footer__phone">{company.phone}</a>
    </div>
    <div class="footer__col">
      <div class="footer__h">Guests</div>
      <ul>
        <li><a href="/">Find a rental</a></li>
        <li><a href="/#results">The Cardo stay</a></li>
        <li><a href="/neighborhoods">Neighborhoods</a></li>
        <li><a href="/#results">Guest support</a></li>
      </ul>
    </div>
    <div class="footer__col">
      <div class="footer__h">Markets</div>
      <ul>
        <li><a href="/neighborhoods/la-jolla">La Jolla</a></li>
        <li><a href="/neighborhoods/pacific-beach">Pacific Beach</a></li>
        <li><a href="/neighborhoods/del-mar">Del Mar</a></li>
        <li><a href="/neighborhoods/coronado">Coronado</a></li>
      </ul>
    </div>
    <div class="footer__col">
      <div class="footer__h">Owners</div>
      <ul>
        <li><a href="/owners">For owners</a></li>
        <li><a href="/home-designs">Home Designs by Cardo</a></li>
        <li><a href="/owners#estimate">Free estimate</a></li>
        <li><a href="/portal">Owner login</a></li>
      </ul>
    </div>
  </div>
  <div class="footer__bar">
    <div class="footer__barinner">
      <span>© 2026 {company.name} · {company.domain}</span>
      <span>STRO compliant · DRE licensed</span>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Footer.astro
git commit -m "feat(v3): footer with extensionless V3 nav links"
```

---

## Task 7: Interaction islands (guest.js + v3-home.js)

**Files:**
- Create: `src/scripts/guest.js`, `src/scripts/v3-home.js`

**Interfaces:**
- Consumes: DOM produced by Header (Task 5) + home sections (Task 8) via data-attributes/classes.
- Produces: booking-bar scroll, featured-homes + journal carousels, reviews carousel + platform tabs, scroll-reveal, sticky nav-search, PM reveal, heading wipe-reveal, concierge drift. Imported by `index.astro` (Task 9).

- [ ] **Step 1: Copy the two scripts verbatim**

```bash
cp design_handoff_v3_site/design-reference/js/guest.js   src/scripts/guest.js
cp design_handoff_v3_site/design-reference/js/v3-home.js  src/scripts/v3-home.js
```

These are self-invoking IIFEs with `'use strict'`, no imports/exports — safe to bundle as-is. Do NOT copy `home-interactive.js` (owner-page script; not loaded on the home page in the reference).

- [ ] **Step 2: Sanity-check no module syntax needs changing**

Run: `grep -e "import " -e "export " src/scripts/guest.js src/scripts/v3-home.js`
Expected: no matches (plain IIFEs).

- [ ] **Step 3: Commit**

```bash
git add src/scripts/guest.js src/scripts/v3-home.js
git commit -m "feat(v3): port guest.js + v3-home.js interaction scripts"
```

---

## Task 8a: Home sections — Booking hero + Featured homes

**Files:**
- Create: `src/components/home/BookingHero.astro`, `src/components/home/FeaturedHomes.astro`

**Interfaces:**
- Consumes: `home.css` classes, `home.ts` (`homePhotos`, `heroPoster`).
- Produces: `<BookingHero />`, `<FeaturedHomes />` for `index.astro`.

- [ ] **Step 1: Create `BookingHero.astro`**

Port `index-v3.html` lines 62–97 (the `.ghero` section). Replace the `<video>` `<source>` (missing file) so the poster shows; import `heroPoster`.

```astro
---
import { heroPoster } from '../../data/home';
---

<section class="ghero" data-screen-label="Hero">
  <video class="ghero__bg" autoplay muted loop playsinline preload="auto" poster={heroPoster}>
    <source src="/assets/video/san-diego-hero.mp4" type="video/mp4" />
  </video>
  <div class="ghero__inner">
    <div class="ghero__copy">
      <h1>Vacation in San Diego</h1>
      <p>Curated vacation homes and thoughtful services to experience living like a local.</p>
    </div>

    <form class="bookbar bookbar--hero" data-bookbar aria-label="Search rentals">
      <div class="bookbar__card">
        <label class="bookbar__field"><span>Where</span>
          <select aria-label="Neighborhood">
            <option>Anywhere in San Diego</option><option>La Jolla</option><option>Pacific Beach</option><option>Mission Beach</option><option>Del Mar</option><option>Encinitas</option><option>Carlsbad</option><option>Coronado</option>
          </select>
        </label>
        <label class="bookbar__field"><span>Check in</span><input type="date" value="2026-07-10" aria-label="Check in" /></label>
        <label class="bookbar__field"><span>Check out</span><input type="date" value="2026-07-15" aria-label="Check out" /></label>
        <label class="bookbar__field"><span>Guests</span>
          <select aria-label="Guests"><option>2 guests</option><option>4 guests</option><option>6 guests</option><option>8 guests</option><option>10+ guests</option></select>
        </label>
        <button type="submit" class="bookbar__search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg> Search</button>
      </div>
    </form>

    <div class="gtrust gtrust--hero">
      <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 20l-5.2 2.7 1-5.8L3.6 8.1l5.8-.8z"/></svg> <b>4.9</b>&nbsp;· 2,000+ guest reviews</span>
      <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z"/></svg> <b>Spotless-home</b>&nbsp;guarantee</span>
      <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg> <b>Keyless</b>&nbsp;check-in</span>
      <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1118 0v5a2 2 0 01-2 2h-1v-7h3"/><path d="M3 12v5a2 2 0 002 2h1v-7H3"/></svg> <b>24/7</b>&nbsp;local concierge</span>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create `FeaturedHomes.astro`**

Port `index-v3.html` lines 100–177 (`#results` section). The six `.scard`s use `assets/photos/designs-*.jpg` — swap each to `homePhotos[key]`, and `neighborhood-*.html` links → `/neighborhoods/<slug>`. Build the cards from a local array to stay DRY:

```astro
---
import { homePhotos } from '../../data/home';

const cards = [
  { slug: 'la-jolla',      photo: 'living-craftsman', name: 'Bluff Villa',      loc: 'La Jolla',      specs: ['4 bedrooms', '3 bathrooms', '8 guests'],  premier: true,  alt: 'Bluff Villa in La Jolla' },
  { slug: 'pacific-beach', photo: 'living-bright',    name: 'Surf Bungalow',    loc: 'Pacific Beach', specs: ['3 bedrooms', '2 bathrooms', '6 guests'],  premier: false, alt: 'Surf Bungalow in Pacific Beach' },
  { slug: 'del-mar',       photo: 'dining',           name: 'Craftsman Retreat', loc: 'Del Mar',      specs: ['4 bedrooms', '3 bathrooms', '8 guests'],  premier: false, alt: 'Craftsman Retreat in Del Mar' },
  { slug: 'mission-beach', photo: 'bedroom-floral',   name: 'Sand Cottage',     loc: 'Mission Beach', specs: ['2 bedrooms', '2 bathrooms', '4 guests'],  premier: false, alt: 'Sand Cottage in Mission Beach' },
  { slug: 'encinitas',     photo: 'gameroom',         name: 'Surf House',       loc: 'Encinitas',     specs: ['3 bedrooms', '2 bathrooms', '6 guests'],  premier: false, alt: 'Surf House in Encinitas' },
  { slug: 'coronado',      photo: 'pool',             name: 'Island Estate',    loc: 'Coronado',      specs: ['5 bedrooms', '4 bathrooms', '10 guests'], premier: true,  alt: 'Island Estate in Coronado' },
];
const premierSvg = 'M12 1.6l2.1 6.4 6.7.2-5.3 4.1 1.9 6.5L12 15.6l-5.4 3.8 1.9-6.5-5.3-4.1 6.7-.2z';
---

<section class="section-pad" id="results" data-screen-label="Rentals">
  <div class="section-wrap">
    <div class="section-head reveal" style="max-width:680px">
      <p class="eyebrow">Homes that we love</p>
      <h2>Explore our collection of homes prepared with style, comfort, and YOU in mind.</h2>
    </div>

    <div class="showcase reveal">
      <button class="showcase__nav showcase__nav--prev" type="button" data-showcase-prev aria-label="Previous homes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
      <div class="showcase__track" data-showcase-track>
        {cards.map((c) => (
          <a class="scard" href={`/neighborhoods/${c.slug}`}>
            <img src={homePhotos[c.photo]} alt={c.alt} loading="lazy" />
            {c.premier && (
              <span class="scard__premier"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={premierSvg}/></svg>Premier</span>
            )}
            <div class="scard__scrim"></div>
            <div class="scard__body">
              <h3 class="scard__name">{c.name}</h3>
              <p class="scard__loc">{c.loc}</p>
              <div class="scard__specs">
                <span>{c.specs[0]}</span><i></i><span>{c.specs[1]}</span><i></i><span>{c.specs[2]}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <button class="showcase__nav showcase__nav--next" type="button" data-showcase-next aria-label="More homes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/BookingHero.astro src/components/home/FeaturedHomes.astro
git commit -m "feat(v3): home booking hero + featured homes sections"
```

---

## Task 8b: Home sections — Locals, Welcome + Clean Promise, Concierge

**Files:**
- Create: `src/components/home/Locals.astro`, `src/components/home/Welcome.astro`, `src/components/home/Concierge.astro`

**Interfaces:**
- Consumes: `home.css`, `homePhotos`.
- Produces: `<Locals />`, `<Welcome />`, `<Concierge />`.

- [ ] **Step 1: Create `Locals.astro`**

Port `index-v3.html` lines 180–195 verbatim (all images are Unsplash already — no path changes). Wrap in the component with no frontmatter.

- [ ] **Step 2: Create `Welcome.astro`**

Port `index-v3.html` lines 198–228 (the `.welcome` section incl. `.welcome__promise` Clean Promise band). Two local photos: `designs-amenities.jpg` (welcome media) → `homePhotos['amenities']`. The Clean Promise "Find your home" button keeps `class="btn btn-blackpink"` and `href="#results"`.

```astro
---
import { homePhotos } from '../../data/home';
---
<!-- paste lines 198–228, with:
     <img src="assets/photos/designs-amenities.jpg" ...>  ->  src={homePhotos['amenities']}
     href="#results" stays as-is (same-page anchor) -->
```

- [ ] **Step 3: Create `Concierge.astro`**

Port `index-v3.html` lines 231–248 (`#concierge` filmstrip, `data-cphotos`/`data-cphotos-track`). Five images are Unsplash; one is `designs-amenities.jpg` → `homePhotos['amenities']`.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/Locals.astro src/components/home/Welcome.astro src/components/home/Concierge.astro
git commit -m "feat(v3): home locals, welcome + clean promise, concierge sections"
```

---

## Task 8c: Home sections — Things to do + San Diego Journal

**Files:**
- Create: `src/components/home/ThingsToDo.astro`, `src/components/home/Journal.astro`

**Interfaces:**
- Consumes: `home.css`.
- Produces: `<ThingsToDo />`, `<Journal />`.

- [ ] **Step 1: Create `ThingsToDo.astro`**

Port `index-v3.html` lines 251–288 (`#explore`). All images Unsplash. The `.btn` "Discover San Diego" link `blog.html` → `/blog`. The three `.todo__card` links keep `href="#results"`.

- [ ] **Step 2: Create `Journal.astro`**

Port `index-v3.html` lines 291–329 (`#journal`, `surface-cream2`, `data-journal-track`). All six `.jpost` cards link `blog.html` → `/blog`. One image is `designs-pool.jpg` → `homePhotos['pool']`; the rest are Unsplash.

Note: `surface-cream2` now maps to light sand (V3 alias) — keep the class; do not rename.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/ThingsToDo.astro src/components/home/Journal.astro
git commit -m "feat(v3): home things-to-do + san diego journal sections"
```

---

## Task 8d: Home sections — Owner crossover, Guest photos, Reviews

**Files:**
- Create: `src/components/home/OwnerCrossover.astro`, `src/components/home/GuestPhotos.astro`, `src/components/home/Reviews.astro`

**Interfaces:**
- Consumes: `home.css`, `homePhotos`.
- Produces: `<OwnerCrossover />`, `<GuestPhotos />`, `<Reviews />`.

- [ ] **Step 1: Create `OwnerCrossover.astro`**

Port `index-v3.html` lines 332–370 (`.crossover`). `crossover__bg` = `designs-living-fireplace.jpg` → `homePhotos['living-fireplace']`. Links: `owners.html#estimate` → `/owners#estimate`, `owners.html` → `/owners`. The three `.ownrev__card` avatars are Unsplash — keep.

- [ ] **Step 2: Create `GuestPhotos.astro`**

Port `index-v3.html` lines 373–398 (`#photos` feed). The avatar uses `assets/logo-horizontal-white-color.png` → `/assets/logo-horizontal-white-color.png`. Feed items mixing local `designs-*.jpg` (→ `homePhotos[...]`) and Unsplash: map `pool`, `living-bright`, `bedroom-floral`, `dining`, `living-craftsman`, `gameroom`, `amenities` to `homePhotos`; leave the three Unsplash `images.unsplash.com` URLs as-is. All item links keep `href="#results"`.

- [ ] **Step 3: Create `Reviews.astro`**

Port `index-v3.html` lines 401–497 (`.section-pad.surface-cream2` reviews block: `data-revtabs`, Google `data-greviews` carousel, Airbnb `data-revpanel`). All avatars are Unsplash — no changes. No local photos here.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/OwnerCrossover.astro src/components/home/GuestPhotos.astro src/components/home/Reviews.astro
git commit -m "feat(v3): home owner crossover, guest photos, reviews sections"
```

---

## Task 9: Compose the V3 home page

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: all home section components (Task 8), `Header`/`Footer` (Tasks 5–6), `home.css`, `guest.js` + `v3-home.js` (Task 7).
- Produces: the live home route `/`.

Replace the legacy composition. Set `data-h2reveal="wipe"` on `<html>` (the reference set it on the `<html>` element to drive the heading wipe; Base.astro owns `<html>`, so pass it through). Simplest: set the attribute from the home page via a small inline script, OR add it in Base. Use an inline script in `index.astro` to avoid changing Base for all pages.

- [ ] **Step 1: Replace `index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Header from '../components/sections/Header.astro';
import Footer from '../components/sections/Footer.astro';
import BookingHero from '../components/home/BookingHero.astro';
import FeaturedHomes from '../components/home/FeaturedHomes.astro';
import Locals from '../components/home/Locals.astro';
import Welcome from '../components/home/Welcome.astro';
import Concierge from '../components/home/Concierge.astro';
import ThingsToDo from '../components/home/ThingsToDo.astro';
import Journal from '../components/home/Journal.astro';
import OwnerCrossover from '../components/home/OwnerCrossover.astro';
import GuestPhotos from '../components/home/GuestPhotos.astro';
import Reviews from '../components/home/Reviews.astro';
import '../styles/home.css';
---

<Base
  title="Book a San Diego Vacation Rental | Cardo Vacation Rentals"
  description="Book a luxury San Diego vacation rental with Cardo — keyless check-in, a spotless-home guarantee, 24/7 local concierge, and honest pricing. A 5-star Superhost since 2013."
>
  <Header />
  <main>
    <BookingHero />
    <FeaturedHomes />
    <Locals />
    <Welcome />
    <Concierge />
    <ThingsToDo />
    <Journal />
    <OwnerCrossover />
    <GuestPhotos />
    <Reviews />
  </main>
  <Footer />
</Base>

<script>
  document.documentElement.setAttribute('data-h2reveal', 'wipe');
  import('../scripts/guest.js');
  import('../scripts/v3-home.js');
</script>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds; `dist/index.html` contains the V3 sections (`grep -c "ghero\|showcase__track\|cphotos" dist/index.html` → non-zero).

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(v3): compose V3 guest home page, replacing legacy home"
```

---

## Task 10: Phase 1 verification + PR

**Files:** none (verification + PR).

- [ ] **Step 1: Clean build**

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 2: Visual review in the dev server**

Run: `npm run dev` and open the served URL (use the Preview tool / browser). Confirm against `design_handoff_v3_site/design-reference/index-v3.html` opened side-by-side:
- White page bg, square corners, Cardo display headings, gold eyebrows.
- Header transparent over hero, frosts on scroll; nav-search centered; "Manage my home" black button; hover reveal overlay dims page (not the nav); silver sheen wipes once.
- Booking bar submit smooth-scrolls to `#results`; featured-homes prev/next scroll; concierge filmstrip drifts opposite the cursor; journal arrows scroll; reviews Google/Airbnb tabs switch and the Google carousel pages.
- Section headings wipe-reveal on scroll.
- All images load (Unsplash placeholders); hero shows the poster image.

- [ ] **Step 3: Responsive + reduced-motion spot check**

Resize to mobile width: header compacts, nav-search hidden ≤860px, filmstrip/journal become horizontal-scroll with edge padding, Clean Promise stacks. Toggle OS "reduce motion": headings show fully (no wipe), concierge drift disabled.

- [ ] **Step 4: Push branch and open the PR (opens the Firebase preview deploy)**

```bash
git push -u origin feat/brand-v3-site
gh pr create --base main --title "Brand V3 site — Phase 1: foundation + home" --body "$(cat <<'EOF'
Phase 1 of the Brand V3 site build (spec: docs/superpowers/specs/2026-07-05-brand-v3-site-design.md).

- V3 token bump (Cardo display, white bg, square corners, gold eyebrows, gradients)
- Global site.css + home.css layers ported from the handoff
- New V3 guest home page replacing the legacy home, with all sections
- guest.js + v3-home.js interaction islands
- Extensionless routes; Unsplash placeholders for un-shipped local photos

Remaining phases (owners, neighborhoods, blog, case studies, portal) follow after review.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: Confirm the preview deploy renders**

Open the preview URL from the PR checks; confirm the home renders as in Step 2. **→ Review checkpoint: hand off to the user before starting Phase 2.**

---

## Self-Review

**Spec coverage:** V3 token bump (Task 1) ✓; Base white bg (Task 2) ✓; global CSS strategy — site.css + home.css with v3-overrides folded last (Tasks 2–3) ✓; Header V3 nav + PM control + reveal + scroll-frost (Task 5) ✓; Footer extensionless links (Task 6) ✓; all 10 home sections incl. booking bar, featured carousel, concierge filmstrip, journal carousel, Clean Promise, owner crossover, reviews (Tasks 8a–8d) ✓; JS islands with reduced-motion gating (Tasks 7, 9) ✓; link rewrite + asset rewrite (Global Constraints, applied per task) ✓; heading wipe-reveal (Task 9 `data-h2reveal`) ✓; responsive + reduced-motion verification (Task 10) ✓. Tweak panels excluded (Task 3 Step 2) ✓.

**Deviations from spec, noted:** (1) Missing local photos + hero video were not in the bundle → Unsplash placeholders + poster fallback centralized in `home.ts` (Task 4); flagged for production swap. (2) No unit-test runner in repo → verification is `npm run build` + visual review rather than TDD red/green; justified by static-site nature and absence of any test harness.

**Placeholder scan:** No TBD/TODO left as work items; the "TODO swap real assets" note in `home.ts` is intentional production guidance, not an incomplete step.

**Type consistency:** `homePhotos` keys (`living-craftsman`, `living-bright`, `dining`, `bedroom-floral`, `gameroom`, `pool`, `amenities`, `living-fireplace`) are defined in Task 4 and every Task 8 reference uses exactly those keys. `heroPoster` defined in Task 4, consumed in Task 8a. Data-attributes the scripts query (`data-bookbar`, `data-showcase-track/-prev/-next`, `data-cphotos(-track)`, `data-journal-track/-prev/-next`, `data-greviews`, `data-revtabs`, `data-navsearch`, `data-pm-control/-link/-overlay`) all appear in the corresponding markup tasks.
