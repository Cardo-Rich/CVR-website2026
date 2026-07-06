# Brand V3 — Phase 3 (Neighborhoods) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Ship the neighborhoods index at `/neighborhoods` and the 7 market landing pages at `/neighborhoods/<slug>` — built from **one data-driven template** (`[slug].astro` + a `neighborhoods` data array), not 7 hand-written pages, per the handoff.

**Architecture:** All per-market content lives in `src/data/neighborhoods.ts`. `src/pages/neighborhoods/[slug].astro` uses `getStaticPaths()` to generate the 7 pages; headings that follow a fixed pattern are templated from the market `name`, and the unique copy comes from the data. The index (`neighborhoods.astro`) renders the 7 cards from the same data. Both reuse `MarketingHeader` + `Footer` + the shared `reveal.js`, the global `site.css`, and carry the page-specific `.nh-*`/`.cheat` CSS in a scoped `<style>`.

**Tech Stack:** Astro 7 (`getStaticPaths` for dynamic routes), global CSS + scoped page `<style>`, shared `reveal.js`. No test runner — verify via `npm run build` + visual review.

## Global Constraints

- **Fidelity:** high — pixel-for-pixel from the token layer; copy verbatim from the reference market files.
- **Reference:** `design_handoff_v3_site/design-reference/neighborhoods.html` (index) and `neighborhood-<slug>.html` for the 7 markets: la-jolla, pacific-beach, mission-beach, del-mar, encinitas, carlsbad, coronado.
- **Links (extensionless):** `owners.html`→`/owners`, `owners.html#estimate`→`/owners#estimate`, `home-designs.html`→`/home-designs`, `home-designs.html#case-studies`→`/home-designs#case-studies`, `blog.html`→`/blog`, `neighborhood-<slug>.html`→`/neighborhoods/<slug>`, `neighborhoods.html`→`/neighborhoods`. `tel:` unchanged. No `.html` may remain.
- **Images:** the neighborhood hero + card images are `images.unsplash.com` coastal shots — keep as-is (no local versions exist; these are area photos, not property photos).
- **Motion:** `.reveal` gated via the shared `reveal.js` (already reduced-motion aware).
- **Branch:** continue on `feat/brand-v3-site` (extends PR #10). Commit after every task. Do NOT push to `main`.
- **Shared chrome:** reuse `Base`, `MarketingHeader` (nav: For Owners→/owners, Design→/home-designs, Case studies→/home-designs#case-studies, Blog→/blog; cta: Free estimate→/owners#estimate, non-floating), `Footer`.

## Data model (`src/data/neighborhoods.ts`)

```ts
export interface NeighborhoodStat { v: string; l: string; }
export interface CheatItem { k: string; v: string; d: string; }
export interface Neighborhood {
  slug: string;            // e.g. 'la-jolla'
  name: string;            // e.g. 'La Jolla'
  note: string;            // card subtitle, e.g. 'Bluff-top luxury & coastal estates'
  img: string;             // Unsplash hero/card URL
  seo: { title: string; description: string };
  intro: string;           // hero paragraph
  stats: NeighborhoodStat[];   // exactly 3
  body: string[];          // exactly 2 paragraphs
  highlights: string[];    // exactly 3
  asideText: string;       // paragraph under "Own a home in <name>?"
  guide: { lede: string; items: CheatItem[] };  // items: exactly 4
  ctaText: string;         // paragraph under "See what your <name> home could earn."
}
export const neighborhoods: Neighborhood[];   // 7 markets, in this order:
// la-jolla, pacific-beach, mission-beach, del-mar, encinitas, carlsbad, coronado
```

**Headings the TEMPLATE derives from `name` (do NOT store in data):** hero eyebrow `Vacation rental management · ${name}`; hero h1 `${name} vacation rental management.`; market eyebrow `The ${name} market`; market h2 `What it takes to win in ${name}.`; body sub-h2 `Why owners choose Cardo in ${name}`; aside h3 `Own a home in ${name}?`; guide eyebrow `A local’s ${name}`; guide h2 `Where we’d actually send you.` (constant); cta h2 `See what your ${name} home could earn.`

---

## Task 1: Neighborhoods data

**Files:** Create `src/data/neighborhoods.ts`

Extract each market's unique content from its reference file into the `Neighborhood` model above. Card `img` + `note` come from `neighborhoods.html` (lines 61–67). Per-market `seo` (title/description from `<title>`/meta), `intro` (hero `<p>`), `stats` (3 `.nh-stat` v/l), `body` (2 `.nh-body p`), `highlights` (3 `.nh-highlights li` text), `asideText` (`.nh-aside p`), `guide.lede` + `guide.items` (4 `.cheat__item` → k/v/d), and `ctaText` (`.cta p`) come from `neighborhood-<slug>.html`.

- [ ] **Step 1:** Read all 7 `neighborhood-<slug>.html` files + `neighborhoods.html`. Create `src/data/neighborhoods.ts` with the interface + the `neighborhoods` array (7 entries, in the listed order). Copy copy verbatim (including the reference's curly quotes/apostrophes). Each entry: exactly 3 stats, 2 body paragraphs, 3 highlights, 4 guide items.
- [ ] **Step 2:** Type-check: `npm run build` (module compiles though unused). Also assert shape with a quick check: `grep -c "slug:" src/data/neighborhoods.ts` → 7.
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): neighborhoods data (7 markets)"`

---

## Task 2: Neighborhood market template

**Files:** Create `src/pages/neighborhoods/[slug].astro`

**Interfaces:** Consumes `neighborhoods` (Task 1), `MarketingHeader`/`Footer`/`Base`, `reveal.js`, global `site.css`.

Port the market layout from `neighborhood-la-jolla.html` (lines 53–137), replacing per-market values with data fields and the pattern headings with `${name}` templating.

- [ ] **Step 1: `getStaticPaths` + frontmatter**

```astro
---
import Base from '../../layouts/Base.astro';
import MarketingHeader from '../../components/sections/MarketingHeader.astro';
import Footer from '../../components/sections/Footer.astro';
import { neighborhoods } from '../../data/neighborhoods';

export function getStaticPaths() {
  return neighborhoods.map((n, i) => ({
    params: { slug: n.slug },
    props: { n, others: [neighborhoods[(i + 1) % neighborhoods.length], neighborhoods[(i + 2) % neighborhoods.length], neighborhoods[(i + 3) % neighborhoods.length]] },
  }));
}
const { n, others } = Astro.props;
const nav = [
  { label: 'For Owners', href: '/owners' },
  { label: 'Design', href: '/home-designs' },
  { label: 'Case studies', href: '/home-designs#case-studies' },
  { label: 'Blog', href: '/blog' },
];
const cta = { label: 'Free estimate', href: '/owners#estimate' };
---
```

- [ ] **Step 2: Body** — `<Base title={n.seo.title} description={n.seo.description}>` wrapping `<MarketingHeader {nav} {cta} />`, then `<main>` with the 5 sections:
  - **phero** — `<img class="phero__bg" src={n.img} .../>`, eyebrow `Vacation rental management · {n.name}`, `<h1>{n.name} vacation rental management.</h1>`, `<p>{n.intro}</p>`, the two buttons (`/owners#estimate`, `tel:`).
  - **Market** — eyebrow `The {n.name} market`, `<h2>What it takes to win in {n.name}.</h2>`; `.nh-stats` from `n.stats.map(...)`; `.nh-body` with `n.body.map(p => <p>{p}</p>)`, the `Why owners choose Cardo in {n.name}` sub-h2, `.nh-highlights` from `n.highlights.map(...)` (each with the check SVG), and the `.nh-aside` (`Own a home in {n.name}?`, `{n.asideText}`, estimate button).
  - **Local guide** — eyebrow `A local’s {n.name}`, `<h2>Where we’d actually send you.</h2>`, `<p class="lede muted">{n.guide.lede}</p>`, `.cheat` grid from `n.guide.items.map(...)`. Keep the reference's 4 cheat SVG icons (Coffee/Eat/Do/Sunset) as fixed icons by index (item 0→coffee, 1→eat, 2→do, 3→sunset SVG paths from the reference).
  - **Other areas** (`surface-cream2`) — `.nh-index` with `others.map(o => <a class="nh-card reveal" href={`/neighborhoods/${o.slug}`}>…{o.img}…{o.name}…{o.note}…</a>)`.
  - **CTA** — `<h2>See what your {n.name} home could earn.</h2>`, `<p>{n.ctaText}</p>`, the two buttons (`/owners#estimate`, `/home-designs#case-studies`).
- [ ] **Step 3: Scoped `<style>`** — copy the reference `.nh-*` block (neighborhood-la-jolla.html:13–36) verbatim into a scoped `<style>`, and append the 7 `.cheat*` rules (additions.css:372–378). Then add `<script>import '../../scripts/reveal.js';</script>` at the bottom.
- [ ] **Step 4: Build + verify** — `npm run build`; confirm `dist/neighborhoods/la-jolla/index.html` … `dist/neighborhoods/coronado/index.html` all exist (7). `grep -rl "\.html\"" dist/neighborhoods/*/index.html` → no matches (no leftover `.html` links).
- [ ] **Step 5:** Commit: `git commit -m "feat(v3): neighborhood market template (/neighborhoods/[slug])"`

---

## Task 3: Neighborhoods index

**Files:** Create `src/pages/neighborhoods.astro`

Port `neighborhoods.html` (52–79): the intro `.section-head` (h1 "Local experts across coastal San Diego.") + `.nh-index` grid of all 7 cards from `neighborhoods`, + the CTA. MarketingHeader + Footer. Scoped `.nh-*` styles (same block as the template; the index only needs `.nh-index`/`.nh-card*` but copy the whole `.nh-*` block for consistency). Load `reveal.js`.

- [ ] **Step 1:** Create `neighborhoods.astro`: frontmatter imports + `neighborhoods` + the same `nav`/`cta`; `<Base title="San Diego Neighborhoods We Serve | Cardo Vacation Rentals" description="Cardo manages luxury short-term rentals across coastal San Diego — La Jolla, Pacific Beach, Mission Beach, Del Mar, Encinitas, Carlsbad, and Coronado. Local experts since 2013.">`; MarketingHeader; `<main>` with the intro section (`style="padding-top:128px"`) + `.nh-index` from `neighborhoods.map(n => <a class="nh-card reveal" href={`/neighborhoods/${n.slug}`}>…)` + the CTA section; Footer; scoped `.nh-*` `<style>`; `<script>import '../scripts/reveal.js';</script>`.
- [ ] **Step 2:** `npm run build`; confirm `dist/neighborhoods/index.html` exists and has 7 `nh-card`s; `grep -c "\.html\"" dist/neighborhoods/index.html` → 0.
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): neighborhoods index (/neighborhoods)"`

---

## Task 4: Phase 3 verification + push

- [ ] **Step 1:** Clean `npm run build` — succeeds; `dist/neighborhoods/` has `index.html` + 7 `<slug>/index.html`.
- [ ] **Step 2:** Visual smoke (dev server): open `/neighborhoods` (7 cards link correctly) and 2–3 markets (e.g. `/neighborhoods/la-jolla`, `/neighborhoods/coronado`): phero image + templated headings correct per market; stats/body/highlights/aside populated; local-guide cheat grid renders; "Other areas" shows 3 sibling markets linking correctly; reveals fire; no console errors; header/footer links resolve (later-phase `/blog` etc. may 404 — expected).
- [ ] **Step 3:** `git push` (updates PR #10 preview).
- [ ] **Step 4:** Report the Phase 3 checkpoint to the user.

---

## Self-Review

**Spec coverage:** `/neighborhoods` index ✓ (Task 3); 7 market pages from ONE `[slug].astro` template + data ✓ (Tasks 1–2); reused chrome + reveal ✓; extensionless links ✓; scoped `.nh-*`/`.cheat` styles ✓.

**Deviations, noted:** (1) "Other areas" is derived (the next 3 markets, wrapping) rather than the reference's hand-picked 3 per file — functionally equivalent, DRY, avoids stale hand-selection. (2) Neighborhood hero/card images stay Unsplash (area photos; no local versions). (3) Pattern headings are templated from `name` rather than stored per-market — reduces data duplication; verified the pattern holds across markets.

**Placeholder scan:** none.

**Type consistency:** `Neighborhood` interface (Task 1) consumed by both pages (Tasks 2–3). `getStaticPaths` props `{ n, others }` defined and consumed in Task 2. `MarketingHeader` `cta` used without `floating` (renders the plain nav button, per its Phase-2a/2b contract).
