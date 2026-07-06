# Design Spec: Cardo Brand V3 Site Build

**Date:** 2026-07-05
**Branch:** `feat/brand-v3-site`
**Source handoff:** `design_handoff_v3_site/` (unpacked from `CVR-website2026.zip`, "Cardo Brand V3 site — 20 pages")

## Overview

Implement the Cardo Brand V3 marketing + portal site (20 routes) in the existing Astro
repo by porting the HTML/CSS/JS **design references** in `design_handoff_v3_site/design-reference/`
into the repo's established Astro patterns. The references are prototypes showing intended
look/behavior — they are **recreated** as `.astro`, not shipped as static files.

The repo is already scaffolded to mirror the handoff 1:1 (`layouts/Base.astro`,
`components/sections/*`, `components/ui/*`, `data/site.ts`, `styles/tokens/*`), so this is a
**port-and-extend**, not a new scaffold.

**Fidelity:** high — pixel-for-pixel from the token layer and component primitives. No
invented values; all grounded in the Brand V3 design system.

## Decisions (locked)

- **Sequencing:** phased with live review checkpoints (see Phasing).
- **Blog article:** dynamic `src/pages/blog/[slug].astro` driven by article data in `site.ts`.
- **Branch/integration:** work on `feat/brand-v3-site`; open a PR after Phase 1 for the
  Firebase preview deploy (pushing to `main` auto-deploys to production, so `main` stays
  untouched until the PR is approved and merged).
- **Repetitive groups are data-driven:** one Astro template per group (neighborhoods,
  case studies, blog), never hand-written near-duplicate pages.
- **Photography:** keep the reference's Unsplash placeholders; swapping for Cardo's own
  photography is a later production step (out of scope here).

## The V3 token bump (do first)

Port `design-reference/styles/tokens/*` over `src/styles/tokens/*`. Verified via diff — the
V3 files are near drop-in replacements: value changes plus additive utilities. Key deltas:

| Concern | Legacy (repo now) | Brand V3 |
|---|---|---|
| Display font | Fraunces (weight 500) | **Cardo** (humanist serif, weight 400) |
| Page background | cream `#F8F3EC` | **white `#FFFFFF`** (`#F8F3EC` = accent band only) |
| Ink / dark surfaces | `#102234` | **`#0E111B`** |
| Corner radii | `8 / 14 / 24px` | **`0` (square)** for buttons/inputs/cards/photos; pill `999px` for chips/tags only |
| Eyebrows | rose | **gold `#C19A5B`** (`--eyebrow` alias; rose reserved for actions) |
| New tokens | — | `--sunset`, `--sunny`, `--gradient-gold`, `--gradient-accent` |
| New base utilities | — | `.gold-bar`, `.accent-fill`, `.bleed`, `.media`/`.media-label`, `.surface-sand` |

`base.css` keeps its `.btn-sm` rule (the "Free estimate" nav CTA uses it). After the bump,
re-verify the existing `index.astro` shifts to V3 (intended) before it is replaced.

## Phasing

Each phase is committed on `feat/brand-v3-site`. A PR opens after Phase 1 so the preview URL
updates as later phases land.

### Phase 1 — Foundation + Home (review checkpoint)
- Bump the 5 token files to V3.
- `Base.astro`: white page background, favicons/meta intact.
- `Header.astro` / `Footer.astro`: V3 nav, extensionless links, the black "Manage my home"
  nav button (15px radius, single silver 45° sheen on hover), sticky header that frosts only
  after scroll, centered desktop search hidden ≤860px.
- New V3 home → `src/pages/index.astro`, replacing the legacy home. Sections (from
  `index-v3.html`): guest hero + booking bar (`#results`), featured-homes carousel,
  local concierge filmstrip (`#concierge`), explore/showcase (`#explore`), San Diego Journal
  carousel (`#journal`), "The Cardo Welcome" + Clean Promise band, owner crossover, photos.
- Port `js/guest.js` + `js/v3-home.js` (+ supporting `home-interactive.js`) as Astro client
  `<script>` islands. Fold `styles-v3/v3-overrides.css` into the relevant home sections.
- **→ User reviews the home live before Phase 2.**

### Phase 2 — Owner + Design track
- `owners.astro` — owner acquisition + `#estimate` lead form (nav CTA anchor target).
- `home-designs.astro` — "Home Designs by Cardo" + `#case-studies` anchor.

### Phase 3 — Neighborhoods
- `src/pages/neighborhoods/[slug].astro` (one template) + `neighborhoods.astro` index,
  driven by 7 markets in `site.ts` (la-jolla, pacific-beach, del-mar, mission-beach,
  encinitas, coronado, carlsbad).

### Phase 4 — Blog
- `blog.astro` index + `blog/[slug].astro` article template, driven by `articles[]` in `site.ts`.

### Phase 5 — Case studies
- `src/pages/case-studies/[slug].astro` (one template), 6 studies in `site.ts`
  (falcon, kane, mt-ainsworth, nute, sixth, twain). Loads `case-study.css` equivalents.

### Phase 6 — Portal
- `portal.astro` — owner portal (agreement, quotes, onboarding, maintenance, approvals),
  dark-ink sidebar. Loads `portal.css` equivalent.

## Data model additions (`src/data/site.ts`)

New typed exports, reconciling existing `cases`/`nav`:
- `neighborhoods[]` — `{ slug, name, heroCopy, stats, blurbs, img }`.
- `caseStudies[]` — `{ slug, home, neighborhood, metrics, narrative, img }` (supersedes `cases`).
- `articles[]` — `{ slug, title, excerpt, date, body }`.
- `nav` rewritten to extensionless routes (`/owners`, `/neighborhoods/la-jolla`, `/blog`, …).

## CSS strategy

Port the reference stylesheets into the repo's `src/styles/` layer as real global
stylesheets rather than shredding them into per-component `<style>` blocks. The reference
CSS is ~1,000+ lines of proven, page-oriented rules whose global class names the ported JS
queries directly (`.scard`, `.greviews__track`, `.cphotos`) and which include cross-cutting
`!important` override layering — keeping it intact as global CSS is faithful and low-regression.
Section components carry markup only. Concretely:

- `src/styles/site.css` — shared site chrome + section utilities (`.section-pad`,
  `.section-wrap`, `.section-head`, `.reveal`), ported from the reference `site.css`.
- `src/styles/home.css` — the home/guest experience: `guest.css` + `home-extra.css` + the
  home slice of `additions.css` (welcome, nav search, `.pm-*` control), with `v3-overrides.css`
  folded in last so its retunes win. Imported by the home page only.
- Reference load order (styles → site → home-extra → guest → additions → v3-overrides) is
  preserved in effect by import order.
- Later page-specific sheets (`case-study.css`, `portal.css`) port the same way in their phases.

## Key interactions (from handoff)

- Sticky header frosts (backdrop-blur) only after scroll; stays above the property-management
  reveal overlay so the nav never blurs.
- "Manage my home" button: black, 15px radius, single subtle silver 45° sheen wipe on hover
  (no white flash).
- Section headings: left-to-right wipe reveal starting at ~85% viewport height; gated behind
  `prefers-reduced-motion`.
- Featured homes: full-bleed horizontal carousel, prev/next, premier badge chips.
- Concierge filmstrip: full-bleed zero-gap photo strip (chef/picnic tall, rest landscape);
  photos drift ~5px opposite the cursor, slow eased; horizontal-scroll on mobile.
- San Diego Journal: card carousel matching featured-homes format; arrows desktop / swipe
  mobile; cards link to `/blog`.
- Cardo Clean Promise: compact band under the welcome photo, inset gold frame; "Find your
  home" button black → pink on hover.
- Owner crossover: dark ink band, top gold-bar rule, owner review cards, balanced padding.
- Motion: ease `cubic-bezier(0.4,0,0.2,1)`; 0.18s interactions / 0.3s surfaces / 0.6s reveals;
  no bounce, no infinite loops.
- Full responsive pass: compact header, scaled filmstrip/carousels with edge padding, stacked
  Clean-Promise card.

## Link rewrite

References use `.html` suffixes (`owners.html`, `neighborhood-la-jolla.html`). Convert all to
extensionless Astro routes and update header/footer nav accordingly.

## Assets

Logo lockups + favicons already exist at `public/assets/`. References use `assets/…` — rewrite
to `/assets/…`. Icons are thin inline-SVG line glyphs (~1.8px stroke), no icon font.

## Out of scope (YAGNI)

- Tweak panels (`stay-tweaks*.jsx`, `tweaks-panel.jsx`, `home-tweaks.jsx`) — authoring-time
  controls; their chosen defaults are already baked into the references.
- Swapping Unsplash placeholders for Cardo photography (production step).
- Legacy `index.html` (intentionally excluded from the handoff).

## Success criteria

- All 20 routes render in the extensionless route map, sharing Header/Footer via `Base.astro`.
- V3 tokens applied; existing `index.astro` correctly shifts to V3 before replacement.
- Neighborhoods, case studies, and blog articles each driven by a single template + `site.ts`
  data (no hand-duplicated pages).
- Reference interactions ported and working, gated behind `prefers-reduced-motion` where noted.
- `npm run build` succeeds; PR preview deploy renders the site.
