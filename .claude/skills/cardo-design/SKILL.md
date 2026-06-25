---
name: cardo-design
description: Use this skill to generate well-branded interfaces and assets for Cardo Vacation Rentals (a luxury San Diego short-term-rental management company), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference
- **Brand:** Cardo Vacation Rentals — luxury, design-led STR management in San Diego. Voice: "luxury coastal, fun without kitschy." Lean, confident copy; no emoji; sentence case; speak to the owner as *you*.
- **Color:** ink navy `#102234`, warm cream `#F8F3EC`, paper white for cards, rose `#ED3C78` as the only action color, brass `#C19A5B` for detail, sea teal `#1F6F6B`. Sunrise gradient is logomark-only.
- **Type:** Fraunces (display serif, weight 500) + Inter (body, 17px/1.65). Eyebrows: Inter 600 uppercase, 0.16em tracking, brass rule.
- **Surfaces:** white cards, 24px radius, hairline border, soft navy-tinted shadow. Pill buttons. 8px spacing rhythm.

## Files
- `styles.css` — link this one file to get all tokens, fonts, and the brand's utility classes (`.btn`, `.eyebrow`, `.card`, `.photo`).
- `tokens/` — CSS custom properties (colors, typography, spacing, elevation, fonts).
- `components/core/` — React primitives (Button, Eyebrow, Badge, Card, Stat, Field, PhotoTile). Read each `.prompt.md`.
- `ui_kits/marketing-site/` — a full interactive homepage recreation to copy patterns from.
- `assets/` — logo lockups (color / white / white-with-color, horizontal + stacked), favicon, vector logo.
- `guidelines/` — foundation specimen cards.

When making static HTML artifacts, link `styles.css` (adjust the relative path) and reference assets from `assets/`. Use Unsplash coastal/interior photography as placeholders; keep imagery warm and sunlit, always rounded and scrimmed.
