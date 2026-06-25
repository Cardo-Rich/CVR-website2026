# Cardo Vacation Rentals — Marketing Site

A production **Astro** implementation of the Cardo Vacation Rentals owner-acquisition
homepage, built from the **Cardo Design System** exported from Claude Design.

Cardo is a design-led, luxury short-term-rental management company in San Diego — a
5-star Airbnb Superhost since 2013. The brand voice is *"luxury coastal, fun without
kitschy"*: deep ink navy and warm cream, brass detailing, and a single confident rose
accent (`#ED3C78`).

## Getting started

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # static build to ./dist
npm run preview  # preview the production build
```

The site is fully static — no backend, no UI framework. Interactivity (the scroll-frosting
header, the FAQ accordion, the lead-form submit, the booking widget) is plain vanilla JS in
Astro client `<script>` blocks.

## How it's organized

```
src/
  styles/
    styles.css            # global entry — @import lines only (links everything below)
    tokens/
      fonts.css           # Fraunces + Inter (Google Fonts)
      colors.css          # brand core, neutrals, sunrise gradient, semantic aliases
      typography.css      # families, weights, display + body scales, eyebrow
      spacing.css         # 8px scale, section rhythm, radii, elevation, motion
      base.css            # element resets + signature utilities (.btn, .eyebrow, .card, .photo)
  components/
    ui/                   # the 7 design-system primitives (ported from the bundle)
      Button.astro  Eyebrow.astro  Badge.astro  Card.astro
      Stat.astro    Field.astro    PhotoTile.astro
    sections/             # homepage sections, composed from the primitives
      Header.astro  Hero.astro  StatsBar.astro  Pillars.astro  CaseStudies.astro
      Neighborhoods.astro  Testimonials.astro  FAQ.astro  LeadForm.astro  Footer.astro
  data/
    site.ts               # all marketing copy, stats, pillars, cases, FAQs, testimonials
  layouts/
    Base.astro            # <html> shell: meta, favicon, global stylesheet
  pages/
    index.astro           # the homepage — composes the sections in order
public/
  assets/                 # logo lockups + favicons
```

The CSS tokens and `base.css` utilities are ported **verbatim** from the design system, so
this site is the single source of truth and any future design-system update drops in cleanly.

## Design tokens at a glance

| Concern   | Value |
|-----------|-------|
| Display   | Fraunces 500, line-height 1.07, tracking −0.015em |
| Body      | Inter, 17px base, line-height 1.65 |
| Action    | Rose `#ED3C78` (the *only* action color) → hover `#D12C66` |
| Surfaces  | Cream `#F8F3EC` page · `#F1E9DC` alt · white cards · ink `#102234` |
| Radii     | 8 / 14 / 24px · pill `999px` |
| Shadows   | soft, navy-tinted, diffuse (sm / md / lg) |
| Motion    | `cubic-bezier(0.4,0,0.2,1)` · 0.18s interactions · 0.3s surfaces |

## Notes & caveats

- **Imagery** uses Unsplash placeholders (matching the live site's `site-config.js`). Swap
  for Cardo's own photography in production.
- **Fonts** load from Google Fonts. To self-host, replace the `@import` in
  `src/styles/tokens/fonts.css` with local `@font-face` rules.
- **Forms** are client-side mocks: the lead form validates and shows a success state but does
  not POST anywhere; the hero booking widget is a visual mock. Wire these to real endpoints
  (e.g. the original repo's `supabase/functions/leads`) when integrating.
- Case-study figures are **illustrative**, matching the design bundle's stated placeholder copy.

## Source of truth

This site was generated from the design bundle in `project/` (left in place for reference) and
the original marketing repo it was derived from:

- **GitHub:** [`Cardo-Rich/CVR-website2026`](https://github.com/Cardo-Rich/CVR-website2026) —
  the live design system (`src/styles/global.css`) and marketing copy (`src/lib/site-config.js`).
- `project/readme.md` — the full design-system guide (content fundamentals, visual foundations,
  iconography).
- `HANDOFF.md` — the original Claude Design handoff instructions.
- `chats/` — the design conversation transcript.
