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

## Project shape

- Astro marketing site. `npm run build` (or `build:all` incl. the `admin/` app).
  Local check: `npm run build` then `npm run preview` (serves on :4321).
- Public pages route through `Base.astro` → `MarketingHeader.astro` / `Header.astro`,
  which share the slide-out `Menu.astro` drawer. Global menu styles live in
  `src/styles/menu.css`; nav/footer chrome in `src/styles/site.css`.
