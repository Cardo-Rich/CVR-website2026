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
- **Never describe Cardo, its service, or its homes as "luxury" (or
  "luxurious") in site copy.** Rich's standing rule (Sept 2026): it alienates
  owners of strong non-luxury homes who would be excellent clients. Prefer
  design-led, hotel-grade, high-end (for finishes), premium, or nothing.
  Competitor descriptions on comparison pages use neutral synonyms (upscale,
  high-end) rather than the word. CSS/code comments are exempt.
- **Never use em dashes (—) in site copy.** Rich's standing rule. Use periods,
  commas, or colons instead. (En dashes in numeric ranges like 18–35% are fine.)
- Cardo lists homes under its own Airbnb account. Listing/review portability is
  **not** a selling point to promote against competitors; keep any ownership
  talk neutral and factual.
- Brand casing: "Vrbo", not "VRBO". Channels to name: Airbnb, Vrbo,
  Booking.com, "and several other high-traffic travel agencies."
- Performance claims: homes outperform their market **by up to 32%** (and solo
  managers by more than 60%). Do not use the old 61% figure.

## Journal authoring (blog)

- **Articles live in Firestore, one document each.** `articles/{slug}` is the
  live post, `articleDrafts/{slug}` a pending one (new post or edits), and
  `articles/{slug}/revisions` a 30-day history. There is no seed file: the
  build reads Firestore and fails loudly if it cannot (`src/lib/content/articles.ts`).
  `FIREBASE_SERVICE_ACCOUNT` must be set in the environment for `npm run build`
  and for the scripts below.
- **To add or revise a post from a session:** write the article as JSON (the
  fields in `src/data/blog.ts`: `slug`, `title`, `category`, `excerpt`,
  `readTime`, `dateFull`, `dateShort`, `img`, `seo`, `author`, `heroCaption`,
  `bodyHtml`, plus `featured` / `showOnHome` / `showOnOwners` / `caseStudy` as
  needed) and run `npm run blog:draft -- path/to/article.json`. That saves a
  **draft** with an unlisted preview page at `/blog/preview/{previewKey}`,
  and prints the URL. The script refuses copy that breaks the house rules
  (em dashes, "VRBO", "luxury"). Sessions never publish: Rich reviews the
  preview and publishes from the admin editor on the site, or from the
  article's Publish button there.
- The preview page exists after the next site build. `blog:draft` requests
  one when `GITHUB_DEPLOY_TOKEN` is set; otherwise trigger the "Deploy to
  Firebase Hosting (live)" workflow with `hosting_only=true` (the GitHub
  Actions tools can do this) and share the preview link once it is green.
- `npm run blog:list` shows live posts and drafts; `-- --export file.json`
  writes a file that `BLOG_FIXTURE=file.json npm run dev` can build from
  offline. `npm run blog:prune-revisions` runs daily in CI.
- Article body HTML uses the site's prose vocabulary: `<p class='lede'>` for
  the opening paragraph, `<h2>`/`<h3>`, `<blockquote>`, `<ul>`, `<a
  class='inline'>`, and `<div class='callout'><p class='eyebrow'>…</p><p>…</p></div>`.

## Project shape

- Astro marketing site. `npm run build` (or `build:all` incl. the `admin/` app).
  Local check: `npm run build` then `npm run preview` (serves on :4321).
- Public pages route through `Base.astro` → `MarketingHeader.astro` / `Header.astro`,
  which share the slide-out `Menu.astro` drawer. Global menu styles live in
  `src/styles/menu.css`; nav/footer chrome in `src/styles/site.css`.
