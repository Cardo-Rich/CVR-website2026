# Cardo Vacation Rentals — Design System

A working design system for **Cardo Vacation Rentals** — a design-led, luxury short-term-rental (STR) management company in San Diego. Founded 2013, a 5-star Airbnb Superhost with 2,000+ reviews. Cardo manages owners' homes end-to-end: marketing, dynamic pricing, transparent accounting, maintenance, and in-house interior design ("Home Designs by Cardo").

The brand voice is **"luxury coastal, fun without kitschy"** — deep ink navy and warm cream, brass detailing, and a single confident rose accent (`#ED3C78`) drawn from the sunrise logomark.

---

## Sources used to build this system

> The reader may not have access to these, but they are recorded so the system can be regenerated or deepened.

- **GitHub — marketing site** (primary source of truth): `Cardo-Rich/CVR-website2026` — https://github.com/Cardo-Rich/CVR-website2026
  - `src/styles/global.css` — the live design system (colors, type, buttons, cards, photo treatment). Tokens here are ported verbatim.
  - `src/lib/site-config.js` — all marketing copy, stats, pillars, neighborhoods, FAQs, testimonials.
  - `supabase/seed/blog_posts.sql` — long-form blog copy (tone reference).
  - `supabase/functions/{leads,agreements}` — lead capture + owner agreements.
  - Explore this repo further to build richer, more accurate Cardo designs.
- **Brand logo assets** (uploaded): horizontal & stacked lockups in full-color, all-white, and white-with-color variants + favicon — now in `assets/`.
- **Local codebase** `CVR-website2026/` — a fresh Astro starter scaffold (no brand content yet); the GitHub repo is the developed version.

Company facts (real, safe to use in copy): founded **2013**, **2,000+** 5-star reviews, **4.9** rating, San Diego Superhost, in-house design & cleaning, phone **619-719-5282**, domain **cardorentals.com**.

---

## Content Fundamentals

**Voice:** confident, lean, and quietly premium. Copy is intentionally tight — *"luxury reads better lean."* Short declarative sentences. No hype, no exclamation points, no emoji. Trust is earned with specifics (real numbers, real process), not adjectives.

**Point of view:** speaks to the **owner** as *you* / *your home*; the company is *we* / *Cardo*. Guests are *they*. The reader is an affluent homeowner deciding who to trust with a valuable asset.

**Casing:** Sentence case for headings and buttons (e.g. "Get my free estimate", "Your home, run like the asset it is."). UPPERCASE only for eyebrows/overlines and small labels, always with wide letter-spacing. Title Case for nav items and proper nouns ("Home Designs by Cardo", "La Jolla").

**Sentence shape & rhythm:** Headlines are short and asset-minded — *"Your home, run like the asset it is."*, *"A home that performs."* Body copy front-loads the benefit, then proves it: *"Every dollar visible, no mystery fees."* Em dashes set off the proof clause. Lists are parallel and verb-led ("Source, purchase & ship furniture", "Hang art and style every room").

**What to say / avoid:**
- DO lead with outcomes (revenue, occupancy, peace of mind) and back them with defensible facts.
- DO name the place — San Diego neighborhoods are central to the SEO and the brand (La Jolla, Pacific Beach, Del Mar, Encinitas, Coronado…).
- DON'T invent numbers; case-study figures on the live site are explicitly illustrative until real ones land.
- DON'T get kitschy (no beach puns, no "paradise!", no emoji). Coastal warmth comes from color and photography, not copy.

**Representative lines:**
- Tagline: *"Luxury short-term rental management in San Diego."*
- Hero: *"San Diego's design-led vacation rental manager — a 5-star Superhost since 2013."*
- Pillar: *"Care that never slips — inspected after every stay, vetted local vendors, sub-hour urgent response. Fixed before anyone notices."*
- CTA: *"Get your free revenue estimate →"*

---

## Visual Foundations

**Palette.** Deep ink navy `#102234` carries text and dark surfaces. Warm cream `#F8F3EC` is the default page background (never stark white at the page level); `#F1E9DC` alternates sections; pure white is reserved for cards and inputs. **Rose `#ED3C78`** is the *only* action color — buttons, links, focus rings, eyebrows — used with discipline so it always means "do this." Brass/gold `#C19A5B` is for fine detail (eyebrow rules, dividers, star ratings). Sea teal `#1F6F6B` is a quiet secondary. The **sunrise gradient** (gold → orange → coral → rose) belongs to the logomark and rare hero accents only — never as a flat section background.

**Typography.** Display is **Fraunces** (optical serif) at weight **500**, line-height ~1.07, tracking −0.015em — warm, editorial, slightly literary. Body is **Inter** at 17px base, line-height 1.65. Eyebrows are Inter 600, uppercase, 0.16em tracking, preceded by a 26px brass rule. The serif/sans pairing is the core of the "luxury but friendly" feel.

**Spacing & layout.** 8px base rhythm. Content maxes at 1180px (880px for prose), 24px gutters. Sections breathe — `clamp(64px, 9vw, 120px)` vertical padding. Generous whitespace is part of the premium feel.

**Corner radii.** Soft and consistent: 8px (small), **14px** (controls/inputs), **24px** (cards & photos), full pill (`999px`) for buttons and chips. Nothing sharp-cornered.

**Cards & surfaces.** White paper, 1px hairline border (`rgba(16,34,52,0.12)`), 24px radius, and a **soft, diffuse, navy-tinted shadow** — never harsh black. Three elevation steps (sm/md/lg) all tinted with the ink color. Hover lifts a card ~3px and deepens the shadow.

**Imagery.** Warm, sunlit coastal photography — real homes, golden light, ocean blues. Every photo sits on a navy→teal gradient fallback with a **dark bottom-to-top scrim** so white captions stay legible; a frosted (backdrop-blur) pill carries metadata top-right, and a Fraunces caption sits bottom-left. Images never float bare — always rounded (24px) and scrimmed.

**Backgrounds.** Flat warm color, not gradients or textures. Full-bleed photography appears in the hero (with a navy left-to-right gradient overlay for text contrast) and as neighborhood/property tiles. No patterns, no noise.

**Buttons & interaction.** Pill buttons. Primary = rose with a soft rose-tinted shadow; ink = navy; ghost = transparent with a hairline border (a light-border ghost variant exists for dark/photo surfaces). **Hover** lifts the button 2px and darkens to rose-deep `#D12C66` with a larger shadow; **active/press** drops it back to baseline (translateY 0). Links use a rose underline that widens its gap-to-arrow on hover. Focus shows a 3px rose-tinted ring (`rgba(237,60,120,0.14)`) on a rose border.

**Motion.** Restrained and soft. Standard ease `cubic-bezier(0.4,0,0.2,1)`; 0.18s for interactions, 0.3s for surfaces, 0.6s for scroll reveals. Scroll-reveal = fade + 16px rise, gated behind `prefers-reduced-motion`. No bounce, no spring, no infinite loops.

**Transparency & blur.** Used sparingly and purposefully: the sticky header frosts (blur 10px) only once scrolled; photo meta pills use a light backdrop-blur. Otherwise surfaces are solid.

---

## Iconography

Cardo's site is **largely icon-light** — it leans on typography, brass rules, and photography rather than an icon set. Where small glyphs appear (value pillars, form confirmations), they are **thin line icons drawn as inline SVG at ~1.8 stroke weight, round caps/joins**, in rose or ink. There is **no icon font and no bundled icon set** in the source repo.

- **Rating stars** are rendered as the Unicode character **★** in brass/gold — the one consistent "icon" in the brand.
- **Arrows** are the literal character **→** appended to link/CTA copy ("Get your free estimate →"), not an SVG.
- **No emoji** anywhere in product copy.

**Guidance for new work:** match the existing thin line-icon style (1.8px stroke, rounded, 24px box). If you need a broader set, use **[Lucide](https://lucide.dev)** from CDN — its 1.5–2px rounded-stroke geometry is the closest match to Cardo's hand-rolled glyphs. *(This is a substitution — flag it; the repo ships no icon library.)* Keep icons monochrome (rose or ink), small, and rare. Never reach for filled/duotone icon sets.

**Brand assets** (`assets/`): logo lockups — `logo-horizontal-color.png`, `logo-stacked-color.png`, plus all-white and white-with-color variants of each; `cardo-logo-horizontal.svg` (vector); `favicon.svg` / `favicon.png`; `background.svg`.

---

## Index / Manifest

**Root**
- `styles.css` — global entry point (consumers link only this). `@import` lines only.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skills-compatible front matter for downloadable use.

**Tokens** (`tokens/`, all reached from `styles.css`)
- `fonts.css` — Fraunces + Inter (Google Fonts).
- `colors.css` — brand core, neutrals, sunrise gradient, semantic aliases, status.
- `typography.css` — families, weights, display + body scales, eyebrow.
- `spacing.css` — 8px scale, section rhythm, radii, elevation, motion.
- `base.css` — element resets + the brand's signature utility classes (`.btn`, `.eyebrow`, `.card`, `.photo`, grid).

**Components** (`components/core/`) — React primitives, each with `.jsx` + `.d.ts` + `.prompt.md`
- `Button` · `Eyebrow` · `Badge` · `Card` · `Stat` · `Field` · `PhotoTile`
- Card HTMLs: `buttons.card.html`, `surfaces.card.html`, `forms.card.html`.

**UI kits** (`ui_kits/`)
- `marketing-site/` — interactive recreation of the cardorentals.com owner homepage (hero + booking widget, pillars, case studies, neighborhoods, FAQ, lead form, footer). See its `README.md`.

**Foundation cards** (`guidelines/`) — specimen cards rendered on the Design System tab (Colors, Type, Spacing, Brand).

**Assets** (`assets/`) — logo lockups, favicon, vector logo, background.
