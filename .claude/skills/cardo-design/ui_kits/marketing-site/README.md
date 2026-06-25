# Cardo Marketing Site — UI Kit

A high-fidelity recreation of the Cardo Vacation Rentals owner-acquisition homepage (cardorentals.com), composed entirely from the Cardo design-system primitives.

## What's here
`index.html` renders the full interactive homepage. Open it directly.

Screens / sections (each a small JSX file, mounted via `window.<Name>`):
- **Header.jsx** — sticky nav that frosts on scroll; logo + free-estimate CTA.
- **Hero.jsx** — full-bleed photo hero with the booking search widget (check-in / check-out / guests).
- **Pillars.jsx** — `StatsBar` (ink band) + the four owner value pillars.
- **CaseStudies.jsx** — performance cards (annual gross + lift over market).
- **Neighborhoods.jsx** — `Neighborhoods` photo grid + `FAQ` accordion (interactive).
- **Footer.jsx** — `Testimonials`, the `LeadForm` estimate form (submits to a success state), and the footer.

## Interactions
- Free-estimate buttons in the header and hero smooth-scroll to the lead form.
- The lead form validates required fields and shows a confirmation state on submit.
- FAQ rows expand/collapse; the booking widget and guest selector are live.

## Components used
Button, Eyebrow, Card, Badge, Stat, Field, PhotoTile — all from `window.CardoDesignSystem_9e0709` (the compiled `_ds_bundle.js`). Nothing is re-implemented here.

## Notes
Property/neighborhood imagery uses Unsplash placeholders (matching the live site's `site-config.js`). Swap for Cardo's own photography in production.
