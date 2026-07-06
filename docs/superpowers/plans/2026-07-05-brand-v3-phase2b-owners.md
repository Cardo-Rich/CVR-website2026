# Brand V3 — Phase 2b (Owners page) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Ship the owner-acquisition page at `/owners` — the site's largest page (16 sections + lead form + income calculator + RevPAR chart + case-study modal + team modal + FAQ) — reusing existing chrome, the global `home.css`, and `homePhotos`.

**Architecture:** Build the page as markup-only section components under `src/components/owners/`, composed by `src/pages/owners.astro`, which imports the global `home.css` (owners' CSS = `home-extra` + `additions`, both already bundled there) and three ported script islands. The owners page uses the `MarketingHeader` (extended with an optional floating "Free estimate" CTA). Reveal via the shared `reveal.js` is superseded here by the owners inline script's own reveal (kept together with the chart/FAQ/calculator logic in one island).

**Tech Stack:** Astro 7, global CSS, vanilla JS islands. No test runner — verify via `npm run build` + visual review.

## Global Constraints

- **Fidelity:** high — pixel-for-pixel from the token layer; invent nothing.
- **Reference:** `design_handoff_v3_site/design-reference/owners.html` (header 336–347; `<main>` 351–936; team modal 937–965; case modal 966–989; inline script 990–1131) and `js/home-interactive.js`, `js/team-modal.js`.
- **Links (extensionless, applied everywhere):** `owners.html`→`/owners`, `owners.html#estimate`→`/owners#estimate`, `owners.html#neighborhoods`→`/neighborhoods`, `home-designs.html`→`/home-designs`, `home-designs.html#case-studies`→`/home-designs#case-studies`, `blog.html`→`/blog`, `neighborhood-<slug>.html`→`/neighborhoods/<slug>`, `case-study-<key>.html`→`/case-studies/<key>`, `portal.html?welcome=1`→`/portal?welcome=1`. Same-page anchors (`#care`,`#performance`,`#marketing`,`#estimate`,`#compare`,`#team`,`#process`) stay. `tel:` unchanged. NO `.html` may remain.
- **Images:**
  - `assets/photos/designs-<name>.jpg` → `homePhotos['<name>']` (keys: living-craftsman, living-bright, dining, bedroom-floral, gameroom, pool, amenities, living-fireplace).
  - `assets/logo-horizontal-white-color.png` → `/assets/logo-horizontal-white-color.png` (real file).
  - `images.unsplash.com/...` URLs → unchanged.
  - **User-provided (not shipped) — keep the intended `/assets/...` path so they resolve when dropped in; do NOT substitute:** partner badges `assets/badges/airbnb-superhost.png`→`/assets/badges/airbnb-superhost.png`, `assets/badges/vrbo-premier-host.png`→`/assets/badges/vrbo-premier-host.png`, `assets/logos/expedia.png`→`/assets/logos/expedia.png`; team thumbnails `assets/photos/team-brandon-rivera.png`→`/assets/photos/team-brandon-rivera.png`, `assets/photos/team-rich-scherf.png`→`/assets/photos/team-rich-scherf.png`.
- **Motion:** every reveal/animation gated behind `prefers-reduced-motion` (the ported scripts already do this — preserve it).
- **Branch:** continue on `feat/brand-v3-site` (extends PR #10). Commit after every task. Do NOT push to `main`.
- **Shared chrome:** reuse `Base.astro`, `MarketingHeader.astro`, `Footer.astro`.

## File Structure

- `src/components/sections/MarketingHeader.astro` — **modified** (Task 1): optional floating CTA.
- `src/scripts/home-interactive.js` — **created** (Task 2): owners subset (pickers, greviews, case modal, more-toggle, amenity pills, address autocomplete), with modal path/link rewrites; wizard/estmo/lead-form/oauth blocks omitted.
- `src/scripts/team-modal.js` — **created** (Task 3): verbatim port.
- `src/scripts/owners.js` — **created** (Task 4): the inline script (header scroll + floating-CTA reveal, income calculator, RevPAR chart, FAQ accordion, lead-form success, reveal observer).
- `src/components/owners/*.astro` — **created** (Tasks 5–9): 16 section components + 2 modal components.
- `src/pages/owners.astro` — **created** (Task 10): composes it all; imports `home.css` + the three scripts.

## Interfaces

`MarketingHeader` Props (extended):
```ts
interface Props {
  logoHref?: string;
  nav: { label: string; href: string; active?: boolean }[];
  cta?: { label: string; href: string; floating?: boolean };
}
```
When `cta.floating` is true, render the CTA as `<a class="site-header__cta btn btn-sm" data-header-cta href={cta.href}>{cta.label}</a>` (the owners inline script reveals/centers it on scroll). When falsy, keep the existing plain `.btn.btn-sm` nav CTA.

---

## Task 1: Extend MarketingHeader with an optional floating CTA

**Files:** Modify `src/components/sections/MarketingHeader.astro`

- [ ] **Step 1:** In the Props interface add `floating?: boolean` to `cta`. Replace the CTA render line so that when `cta.floating` is set it emits the floating variant, else the existing nav button:

```astro
{cta && (cta.floating
  ? <a class="site-header__cta btn btn-sm" data-header-cta href={cta.href}>{cta.label}</a>
  : <a class="btn btn-sm" href={cta.href}>{cta.label}</a>
)}
```

- [ ] **Step 2:** `npm run build` → succeeds (home-designs still passes `cta` without `floating`, so its rendering is unchanged).
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): MarketingHeader optional floating CTA (owners)"`

---

## Task 2: Port home-interactive.js (owners subset)

**Files:** Create `src/scripts/home-interactive.js`

Port `design_handoff_v3_site/design-reference/js/home-interactive.js` with these edits:
- **Keep:** click-to-expand pickers (`[data-picker]`), Google-reviews carousel (`[data-greviews]`), case-study preview modal (`[data-cmodal]`/`[data-case]`), "Add more details" disclosure (`[data-more-toggle]`), amenity pills (`[data-amenities]`), address autocomplete (`[data-addr]`).
- **Omit** (owners uses the inline `owners.js` success behavior instead, and these features aren't on the page): the "Lead form → owner account" block (`[data-lead-form]` submit + `[data-oauth]`), the "Estimate wizard" block (`[data-wiz]`), and the "Estimate motion graphic" block (`[data-estmo]`).
- **Rewrite inside the case-study modal block:** `heroImg.src = 'assets/photos/' + d.imgs[0]` and the thumbs `'assets/photos/' + f` must resolve to the placeholder photos. Since `d.imgs` are `designs-*.jpg` basenames, map them through `homePhotos`. Simplest: at the top of the modal IIFE add a small map from basename→URL using the same Unsplash URLs as `src/data/home.ts`, OR change the DATA `imgs` to full `homePhotos` URLs. Use this approach: replace `'assets/photos/' + d.imgs[0]` with `d.imgs[0]` and `'assets/photos/' + f` with `f`, and change each DATA entry's `imgs` array to the corresponding `homePhotos` URL strings (living-craftsman, living-bright, dining, bedroom-floral, gameroom, pool, amenities, living-fireplace, plus `bedroom-fan` which has no homePhotos key → reuse the `bedroom-floral` URL). Keep the exact Unsplash URLs from `src/data/home.ts` so they match the rest of the site.
- **Rewrite the case link:** `els.full.href = 'case-study-' + key + '.html'` → `els.full.href = '/case-studies/' + key`.

- [ ] **Step 1:** Create the edited `src/scripts/home-interactive.js` per above (self-invoking IIFE; no import/export).
- [ ] **Step 2:** `grep -e "data-wiz" -e "data-estmo" -e "portal.html" -e "\.html'" src/scripts/home-interactive.js` → expect no matches (wizard/estmo/lead-nav removed, case link rewritten). `grep -e "import " -e "export " src/scripts/home-interactive.js` → none.
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): port home-interactive.js (owners subset)"`

---

## Task 3: Port team-modal.js

**Files:** Create `src/scripts/team-modal.js`

The reference `js/team-modal.js` uses hosted `cardorentals.com` photo URLs (work as-is) and no `.html` links. Copy verbatim.

- [ ] **Step 1:** `cp design_handoff_v3_site/design-reference/js/team-modal.js src/scripts/team-modal.js`
- [ ] **Step 2:** `grep -e "import " -e "export " -e "\.html" src/scripts/team-modal.js` → no matches.
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): port team-modal.js"`

---

## Task 4: Port the owners inline script

**Files:** Create `src/scripts/owners.js`

Port the reference inline script (owners.html:991–1130, the IIFE body) verbatim into `src/scripts/owners.js` as a self-invoking IIFE. It contains: header scroll-frost + floating-CTA reveal (`[data-header-cta]`), income calculator (`#calc-hood`/`#calc-beds`/`#calc-num`/`#calc-note`), RevPAR performance chart (`[data-perf-chart]` + `#perf-avg`), FAQ accordion (`[data-faq]`), lead-form success (`[data-lead-form]`→`[data-lead-success]`), and the reveal observer. No `.html` links inside — no rewrites needed.

- [ ] **Step 1:** Create `src/scripts/owners.js` wrapping the reference script body in `(function(){ 'use strict'; ... })();`.
- [ ] **Step 2:** `grep -e "import " -e "export " -e "\.html" src/scripts/owners.js` → no matches. `grep -c "data-perf-chart" src/scripts/owners.js` → ≥1.
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): port owners inline script (chart, calc, FAQ, CTA)"`

---

## Task 5: Owner sections A — Hero+lead form, Pillars, Partners

**Files:** Create `src/components/owners/OwnerHero.astro`, `Pillars.astro`, `Partners.astro`

Port reference ranges, applying Global-Constraints rewrites:
- `OwnerHero.astro` ← 351–409: the `.hero` with the `#estimate` lead form (`data-lead-form`, `data-addr`, `data-amenities`, `data-more-toggle`, OAuth buttons) **and** the adjacent lead-success panel (`data-lead-success`, hidden). No local photos (hero bg is CSS). Imports nothing unless an image appears.
- `Pillars.astro` ← 412–440: three `.pillar--link` cards (anchors to `#care`/`#performance`/`#marketing`). No images.
- `Partners.astro` ← 444–453: partner badges — keep the `/assets/badges/...` + `/assets/logos/expedia.png` paths (user-provided) and the word-marks (Zillow, Hopper) as-is.

- [ ] **Step 1:** Create the three components (markup-only). Preserve all `data-*` hooks.
- [ ] **Step 2:** `npm run build` → succeeds.
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): owners hero+lead form, pillars, partners"`

---

## Task 6: Owner sections B — Airbnb showcase, Google reviews, Airbnb reviews

**Files:** Create `src/components/owners/AirbnbShowcase.astro`, `GoogleReviews.astro`, `AirbnbReviews.astro`

Port + rewrite:
- `AirbnbShowcase.astro` ← 456–504: the `.abshow` phones. Images `designs-living-craftsman/-living-bright/-living-fireplace.jpg` → `homePhotos[...]` (imports `homePhotos`). CTA `#estimate` stays.
- `GoogleReviews.astro` ← 507–564: `.greviews` (`data-greviews`) — all avatars Unsplash (unchanged). `surface-cream2` kept.
- `AirbnbReviews.astro` ← 567–621: `.greviews.greviews--airbnb` (`data-greviews`) — all Unsplash.

- [ ] **Step 1:** Create the three components; keep `data-greviews`/`data-grev-*` intact.
- [ ] **Step 2:** `npm run build` → succeeds.
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): owners airbnb showcase + google/airbnb reviews"`

---

## Task 7: Owner sections C — Performance, Case studies, Marketing

**Files:** Create `src/components/owners/Performance.astro`, `CaseStudies.astro`, `Marketing.astro`

Port + rewrite:
- `Performance.astro` ← 624–654: `#performance` with the empty `<svg data-perf-chart>` (owners.js draws it) and `#perf-avg`. No images.
- `CaseStudies.astro` ← 657–695: `.cases-feature`; bg `designs-pool.jpg` → `homePhotos['pool']`; six `.gcase` buttons with `data-case="falcon|nute|twain|sixth|kane|mt-ainsworth"` (the modal is opened by home-interactive.js) — keep `data-case` values. Any `designs-*.jpg` thumbnails → `homePhotos`.
- `Marketing.astro` ← 696–749: `#marketing`; map any `designs-*.jpg`/logo/unsplash per Global Constraints.

- [ ] **Step 1:** Create the three components (`Performance`, `CaseStudies` import `homePhotos`).
- [ ] **Step 2:** `npm run build` → succeeds.
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): owners performance, case studies, marketing"`

---

## Task 8: Owner sections D — Care, Investors, Compare

**Files:** Create `src/components/owners/Care.astro`, `Investors.astro`, `Compare.astro`

Port + rewrite reference ranges: `Care.astro` ← 750–816 (`#care`, `.included--dark`); `Investors.astro` ← 817–828 (`.invest`); `Compare.astro` ← 829–857 (`#compare`). Apply image/link rewrites per Global Constraints (map any `designs-*.jpg`→`homePhotos`, unsplash unchanged).

- [ ] **Step 1:** Create the three components.
- [ ] **Step 2:** `npm run build` → succeeds.
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): owners care, investors, compare"`

---

## Task 9: Owner sections E — Team, Founder, Process, FAQ + modals

**Files:** Create `src/components/owners/Team.astro`, `Founder.astro`, `Process.astro`, `Faq.astro`, `TeamModal.astro`, `CaseModal.astro`

Port + rewrite:
- `Team.astro` ← 858–887: `#team` (`data-team`); member cards use `data-member` + team thumbnails `/assets/photos/team-*.png` (user-provided paths). Keep `data-member` values.
- `Founder.astro` ← 888–900: `.founder`.
- `Process.astro` ← 901–917: `#process`.
- `Faq.astro` ← 918–936: `.faq` (`data-faq`, `data-faq-item`).
- `TeamModal.astro` ← 937–965: `.tmodal` (`data-team-modal`, `data-tm-photo/-name/-role/-bio/-close`).
- `CaseModal.astro` ← 966–989: `.cmodal` (`data-cmodal`, `data-cm-*`, `data-cmodal-close`).

- [ ] **Step 1:** Create the six components; preserve all modal `data-*` hooks.
- [ ] **Step 2:** `npm run build` → succeeds.
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): owners team, founder, process, FAQ + modals"`

---

## Task 10: Compose owners.astro + verify + push

**Files:** Create `src/pages/owners.astro`

- [ ] **Step 1:** Create `src/pages/owners.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import MarketingHeader from '../components/sections/MarketingHeader.astro';
import Footer from '../components/sections/Footer.astro';
import OwnerHero from '../components/owners/OwnerHero.astro';
import Pillars from '../components/owners/Pillars.astro';
import Partners from '../components/owners/Partners.astro';
import AirbnbShowcase from '../components/owners/AirbnbShowcase.astro';
import GoogleReviews from '../components/owners/GoogleReviews.astro';
import AirbnbReviews from '../components/owners/AirbnbReviews.astro';
import Performance from '../components/owners/Performance.astro';
import CaseStudies from '../components/owners/CaseStudies.astro';
import Marketing from '../components/owners/Marketing.astro';
import Care from '../components/owners/Care.astro';
import Investors from '../components/owners/Investors.astro';
import Compare from '../components/owners/Compare.astro';
import Team from '../components/owners/Team.astro';
import Founder from '../components/owners/Founder.astro';
import Process from '../components/owners/Process.astro';
import Faq from '../components/owners/Faq.astro';
import TeamModal from '../components/owners/TeamModal.astro';
import CaseModal from '../components/owners/CaseModal.astro';
import '../styles/home.css';

const nav = [
  { label: 'Interior Decorating', href: '/home-designs' },
  { label: 'Case studies', href: '/home-designs#case-studies' },
];
const cta = { label: 'Free estimate', href: '/owners#estimate', floating: true };
---

<Base title="Get your home's revenue estimate | Cardo Vacation Rentals" description="Submit your San Diego home for an instant earning estimate, verified by a personal account manager. Premium care, above-market performance, and full-service marketing since 2013.">
  <MarketingHeader {nav} {cta} />
  <main>
    <OwnerHero />
    <Pillars />
    <Partners />
    <AirbnbShowcase />
    <GoogleReviews />
    <AirbnbReviews />
    <Performance />
    <CaseStudies />
    <Marketing />
    <Care />
    <Investors />
    <Compare />
    <Team />
    <Founder />
    <Process />
    <Faq />
  </main>
  <TeamModal />
  <CaseModal />
  <Footer />
</Base>

<script>
  import '../scripts/owners.js';
  import '../scripts/home-interactive.js';
  import '../scripts/team-modal.js';
</script>
```

- [ ] **Step 2:** `npm run build`. Verify `dist/owners/index.html` exists; `grep -c -e "data-perf-chart" -e "data-lead-form" -e "data-team-modal" -e "data-cmodal" dist/owners/index.html` → non-zero; `grep -c "\.html" dist/owners/index.html` → `0`.
- [ ] **Step 3:** Visual smoke (dev server, `/owners`): header floating "Free estimate" appears after scrolling past the form; lead form shows the success panel on submit; RevPAR chart draws (two lines, `#perf-avg` shows `+51%`); FAQ accordion toggles; case cards open the case modal; team cards open the team modal; both review carousels page; reveals fire; no console errors. Broken images limited to the user-provided badge/team files (expected).
- [ ] **Step 4:** Commit `owners.astro`, then `git push` (updates PR #10 preview).
- [ ] **Step 5:** Report the Phase 2b checkpoint to the user, including the **asset checklist** they must drop into `public/assets/`: `badges/airbnb-superhost.png`, `badges/vrbo-premier-host.png`, `logos/expedia.png`, `photos/team-brandon-rivera.png`, `photos/team-rich-scherf.png`.

---

## Self-Review

**Spec coverage:** `/owners` route with `#estimate` lead form ✓ (Tasks 5,10); all 16 sections ✓ (Tasks 5–9); income calculator + RevPAR chart + FAQ + floating CTA + lead success ✓ (Tasks 1,4); case-study + team modals ✓ (Tasks 2,3,9); reviews carousels ✓ (Task 6); extensionless links + image rewrites ✓ (Global Constraints); reduced-motion preserved ✓; shared chrome reused ✓ (Task 10).

**Deviations, noted:** (1) The reference's competing lead-form handlers are resolved to ONE behavior — the inline success panel (Task 2 omits home-interactive's portal-navigation) — avoiding a submit that navigates to the not-yet-built `/portal`. (2) Partner badges + team thumbnails use the intended `/assets/...` paths and will 404 until the user drops the files (their explicit choice); everything else renders. (3) Case-study/neighborhood/blog/portal links point at later-phase routes and 404 until built (expected).

**Placeholder scan:** none (the "user provides files" note is intentional per the user's decision).

**Type consistency:** `MarketingHeader` `cta.floating?` added in Task 1, consumed in Task 10. `homePhotos` keys used are all defined in `src/data/home.ts`. Script `data-*` hooks (`data-lead-form`, `data-lead-success`, `data-perf-chart`, `perf-avg`, `data-faq(-item)`, `data-header-cta`, `data-case`, `data-cmodal`/`data-cm-*`, `data-team-modal`/`data-tm-*`/`data-member`, `data-greviews`/`data-grev-*`, `data-addr`, `data-amenities`, `data-more-toggle`, `data-picker`) each produced by a component task and consumed by the matching script task.
