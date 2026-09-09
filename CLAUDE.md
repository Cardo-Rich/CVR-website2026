# CVR-website2026 — working agreement

## Deploy & review workflow

- **Always deliver the preview-channel link before merging.** For every change
  completed on this project, open the PR, wait for the `pr-preview.yml` Firebase
  preview URL (posted as a `github-actions[bot]` comment on the PR), and share
  that link with the user so they can review the change live.
- **Do not merge until the user has reviewed and approved.** The user reviews on
  the preview channel first; only merge when they explicitly say so.
- Merging a PR (a push to `main`) triggers `deploy.yml`, which publishes to the
  **live** Firebase Hosting channel at `cardo-website-2026.web.app`.
- PRs deploy to a temporary preview channel via `pr-preview.yml`; that build is
  also the CI signal (a green preview deploy == build passed).

## Copy rules

- **Owner/marketing-page voice (Rich's pick, Sept 2026): professional
  journalist with analytical structure.** Report facts plainly and attribute
  them ("as of September 2026", "the company advertises"); complete sentences
  over fragments; headlines describe content rather than sell; make decision
  criteria explicit (what is included, what it costs, who does the work). No
  catch phrases, aphorisms, or clever turns ("Revenue is fought for, not
  given" is the pattern to avoid). Guest-facing pages may stay warmer.
  Register by page type (Rich's calibration): comparison/data pages (listicle,
  fees) stay reported and analytical; guide/how-to pages (e.g. /switch) read
  as a journalistic walk-through: second person, narrative, warmer, still
  factual and catch-phrase-free.
- **Never use em dashes (—) in site copy.** Rich's standing rule. Use periods,
  commas, or colons instead. (En dashes in numeric ranges like 18–35% are fine.)
- Cardo lists homes under its own Airbnb account. Listing/review portability is
  **not** a selling point to promote against competitors; keep any ownership
  talk neutral and factual.
- Brand casing: "Vrbo", not "VRBO". Channels to name: Airbnb, Vrbo,
  Booking.com, "and several other high-traffic travel agencies."
- Performance claims: homes outperform their market **by up to 32%** (and solo
  managers by more than 60%). Do not use the old 61% figure.

## Project shape

- Astro marketing site. `npm run build` (or `build:all` incl. the `admin/` app).
  Local check: `npm run build` then `npm run preview` (serves on :4321).
- Public pages route through `Base.astro` → `MarketingHeader.astro` / `Header.astro`,
  which share the slide-out `Menu.astro` drawer. Global menu styles live in
  `src/styles/menu.css`; nav/footer chrome in `src/styles/site.css`.
