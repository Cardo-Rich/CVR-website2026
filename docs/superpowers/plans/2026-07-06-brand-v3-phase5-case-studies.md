# Brand V3 — Phase 5 (Case Studies) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Ship the 6 design case-study detail pages at `/case-studies/<slug>` from **one CMS-ready data-driven template** (`case-studies/[slug].astro` + `src/data/case-studies.ts`), so a future CMS can populate/replace case studies without touching the template. (No index page — case studies are reached from `/home-designs#case-studies` and the owners case modal, which already link `/case-studies/<slug>`.)

**Architecture:** All per-case content lives in `src/data/case-studies.ts` as a typed `caseStudies[]`. `src/pages/case-studies/[slug].astro` uses `getStaticPaths()` to generate the 6 pages; `related` is derived (next 3, wrapping). The template reuses `MarketingHeader` + `Footer`, the global `site.css`, the shared `reveal.js`, and carries the ported `case-study.css` in a **scoped** `<style>` (scoped so its `.related`/`.rpost` don't collide with the blog article's). The 6 slugs already targeted by earlier phases: falcon, nute, twain, sixth, kane, mt-ainsworth.

**Tech Stack:** Astro 7 (`getStaticPaths`), global CSS + scoped `<style>`, `reveal.js` + a small contact-form island. No test runner — verify via `npm run build` + visual review.

## Global Constraints

- **Fidelity:** high — pixel-for-pixel from the token layer; copy verbatim.
- **Reference:** `design_handoff_v3_site/design-reference/case-study-<slug>.html` (6 files, identical structure) + `styles/case-study.css`.
- **CMS-ready:** all case content is data (`caseStudies[]`); the template renders it. Story paragraphs are a `string[]`; scope is a `{label,amount}[]`. Do NOT hardwire case content into the template.
- **Links (extensionless):** `owners.html`→`/owners`, `owners.html#estimate`→`/owners#estimate`, `home-designs.html`→`/home-designs`, `home-designs.html#case-studies`→`/home-designs#case-studies`, `blog.html`→`/blog`, `case-study-<slug>.html`→`/case-studies/<slug>`, `portal.html`→`/portal`. `tel:` unchanged. No `.html` may remain.
- **Images:** the gallery + related-card images are the real local `/assets/photos/designs-*.jpg` (all now present, incl. `designs-bedroom-fan.jpg`). Store full paths in the data.
- **Motion:** `.reveal` via the shared `reveal.js`.
- **Branch:** continue on `feat/brand-v3-site` (extends PR #10). Commit after each task. Do NOT push to `main`.
- **Shared chrome:** `Base`, `MarketingHeader` (nav: For Owners→/owners, Design→/home-designs, Case studies→/home-designs#case-studies, Blog→/blog; cta Free estimate→/owners#estimate), `Footer`.

## Data model (`src/data/case-studies.ts`)

```ts
export interface ScopeLine { label: string; amount: string; }
export interface CaseStudy {
  slug: string;             // falcon | nute | twain | sixth | kane | mt-ainsworth
  name: string;             // 'Falcon'
  neighborhood: string;     // 'La Jolla'
  beds: string;             // '4 BR'
  date: string;             // 'June 2026'
  hook: string;             // the .hook paragraph
  seo: { title: string; description: string };
  cardImg: string;          // representative image for the related-card (use the first gallery image)
  gallery: string[];        // 4 local /assets/photos/designs-*.jpg paths (the .cspost-gallery grid)
  story: string[];          // 3 paragraphs (.cspost-story)
  stats: { annualRevenue: string; avgNight: string; overMarket: string; totalInvested: string };
  scope: ScopeLine[];       // the 7 .cspost-line items
  scopeTotal: string;       // '$78,400'
  contactTitle: string;     // 'Like what Falcon became? Let’s talk about yours.'
}
export const caseStudies: CaseStudy[];  // 6, in order: falcon, nute, twain, sixth, kane, mt-ainsworth
```

---

## Task 1: Case studies data (CMS-ready `caseStudies[]`)

**Files:** Create `src/data/case-studies.ts`

Extract each case's content from `design_handoff_v3_site/design-reference/case-study-<slug>.html`:
- `name` (`<h1>`), `hook` (`.hook`), `.cspost-meta` → `neighborhood`/`beds`/`date` (the 3 spans), `seo` (title/description).
- `gallery` = the 4 `.cspost-gallery__grid img` — rewrite `assets/photos/<f>.jpg` → `/assets/photos/<f>.jpg` (keep each file's exact basename).
- `story` = the 3 `.cspost-story p`.
- `stats` = the 4 `.cspost-stat` values in order: `annualRevenue` (is-hero), `avgNight` (2nd), `overMarket` (is-lift), `totalInvested` (4th).
- `scope` = the 7 `.cspost-line` → `{label, amount}`; `scopeTotal` = `.cspost-total b`.
- `contactTitle` = the `.cspost-contact__copy h3` text.
- `cardImg` = the first entry of `gallery`.

- [ ] **Step 1:** Read all 6 case files. Create `src/data/case-studies.ts` (interface + `caseStudies` array, 6 entries in order falcon, nute, twain, sixth, kane, mt-ainsworth). Copy copy VERBATIM (decode entities: `&amp;`→`&`; keep curly apostrophes). Each entry: exactly 4 gallery, 3 story, 4 stats, 7 scope lines.
- [ ] **Step 2:** `npm run build` (compiles). Confirm 6 array entries; each has 4 gallery / 3 story / 7 scope (spot-check).
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): case-studies data — CMS-ready caseStudies[]"`

---

## Task 2: Case-study template

**Files:** Create `src/pages/case-studies/[slug].astro`

Port `case-study-falcon.html` (27–123), data-driven. `related` = next 3 wrapping.

- [ ] **Step 1: Frontmatter**
```astro
---
import Base from '../../layouts/Base.astro';
import MarketingHeader from '../../components/sections/MarketingHeader.astro';
import Footer from '../../components/sections/Footer.astro';
import { caseStudies } from '../../data/case-studies';

export function getStaticPaths() {
  return caseStudies.map((c, i) => ({
    params: { slug: c.slug },
    props: { c, related: [caseStudies[(i+1)%caseStudies.length], caseStudies[(i+2)%caseStudies.length], caseStudies[(i+3)%caseStudies.length]] },
  }));
}
const { c, related } = Astro.props;
const nav = [
  { label: 'For Owners', href: '/owners' },
  { label: 'Design', href: '/home-designs' },
  { label: 'Case studies', href: '/home-designs#case-studies' },
  { label: 'Blog', href: '/blog' },
];
const cta = { label: 'Free estimate', href: '/owners#estimate' };
---
```
- [ ] **Step 2: Body** — `<Base title={c.seo.title} description={c.seo.description}>` > `<MarketingHeader {nav} {cta} />` > `<main>`:
  - `<article>`:
    - `.cspost-head` (back link → `/home-designs#case-studies`, `.post-cat` "Design case study", `<h1>{c.name}</h1>`, `.hook`={c.hook}, `.cspost-meta` = neighborhood · beds · date with the `.dot` spans).
    - `.cspost-gallery` `.cspost-gallery__grid`: `c.gallery.map(src => <a href="#"><img src={src} alt={c.name} loading="lazy" /></a>)`.
    - `.cspost-body`: `.cspost-story` = `c.story.map(p => <p>{p}</p>)`; `.cspost-panel` aside with `.cspost-stats` (4 stats: is-hero annualRevenue "Annual revenue", avgNight "Avg / night", is-lift overMarket "Over market", totalInvested "Total invested") + `.cspost-scope` (`<h3>Scope of work</h3>`, `c.scope.map(s => <div class="cspost-line"><span>{s.label}</span><b>{s.amount}</b></div>)`, `.cspost-total`={c.scopeTotal}).
    - `.cspost-cta` `.cspost-contact#contact`: `.cspost-contact__copy` (eyebrow, `<h3>{c.contactTitle}</h3>`, the two paragraphs + `.cspost-contact__list` 3 items — verbatim from reference 76–83) and `.cspost-form` (the form with Google button `data-cs-google`, name/phone/email/neighborhood/message fields, submit; and `.cspost-form__success[data-cs-success][hidden]` whose button links `/portal`). Port the form markup verbatim (reference 85–106).
  - `.related` section: `.section-head` (eyebrow "More case studies", h2 "Other homes, other markets.") + `.related__grid` from `related.map(r => <a class="rpost" href={`/case-studies/${r.slug}`}><img src={r.cardImg} alt={r.name} loading="lazy" /><div class="rpost__b"><span class="rpost__cat">Case study · {r.neighborhood}</span><h4>{r.name}</h4></div></a>)`.
  - `<Footer />`.
- [ ] **Step 3: Scoped `<style>` + scripts** — copy `design_handoff_v3_site/design-reference/styles/case-study.css` (all 89 lines) VERBATIM into a **scoped** `<style>` in the template (scoped so `.related`/`.rpost` don't leak to other pages). Then a bottom `<script>`: `import '../../scripts/reveal.js';` followed by the contact-form IIFE (reference 148–155: on `[data-cs-form]` submit or `[data-cs-google]` click → hide form, show `[data-cs-success]`).
- [ ] **Step 4: Build + verify** — `npm run build`; all 6 `dist/case-studies/<slug>/index.html` exist; `grep -rl '\.html"' dist/case-studies/*/index.html` → none.
- [ ] **Step 5:** Commit: `git commit -m "feat(v3): case-study template (/case-studies/[slug])"`

---

## Task 3: Phase 5 verification + push

- [ ] **Step 1:** Clean `npm run build` — succeeds; 6 `dist/case-studies/<slug>/index.html`.
- [ ] **Step 2:** Visual smoke (dev server): 2–3 cases (e.g. `/case-studies/falcon`, `/case-studies/mt-ainsworth`): head/hook/meta correct per case; 4-image gallery loads (real local photos); story + stats (annual rev / avg / +over market / invested) + 7 scope lines + total; contact form submit shows the success panel; 3 related cases link correctly; reveals fire; no console errors. Confirm the earlier links from `/home-designs#case-studies` and the owners case modal now resolve to these pages.
- [ ] **Step 3:** `git push` (updates PR #10 preview).
- [ ] **Step 4:** Report the Phase 5 checkpoint to the user (case studies live; CMS-managed later; only Phase 6 portal remains).

---

## Self-Review

**Spec coverage:** 6 `/case-studies/<slug>` pages from ONE template + data ✓ (Tasks 1–2); CMS-ready `caseStudies[]` ✓; reused chrome + reveal ✓; extensionless links ✓; scoped `case-study.css` ✓; contact form + success ✓; related derived ✓. The `/home-designs#case-studies` grid and owners case-modal links (built earlier) now resolve.

**Deviations, noted:** (1) No index page — matches the handoff (none exists; entry points are home-designs + the owners modal). (2) `related` and `cardImg` derived (next 3; first gallery image) rather than the reference's hand-picked set — functionally equivalent, DRY. (3) The contact-form success links to `/portal` (Phase 6) — will 404 until portal ships (expected). (4) `case-study.css` is scoped into the template (not a global import) to avoid its `.related`/`.rpost` colliding with the blog article's.

**Placeholder scan:** none.

**Type consistency:** `CaseStudy` interface (Task 1) consumed in Task 2. `getStaticPaths` props `{ c, related }` defined/consumed. `MarketingHeader` `cta` without `floating` (plain nav button).
