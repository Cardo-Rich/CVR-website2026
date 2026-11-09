# SEO autopilot runbook

The scheduled "Cardo SEO autopilot" job runs every day at about 6:00 AM
Pacific and follows this file. Rich set these rules in November 2026. Edit
this file to change how the job behaves; the job reads it fresh each run.

## What Rich approved

- **Fully automatic.** New posts publish and SEO fixes merge on their own.
  Rich gets a Slack recap after the fact. This is the one exception to the
  "do not merge until Rich approves" and "sessions never publish" rules in
  CLAUDE.md, and it covers only this job.
- **Pace:** 3 new posts a week, Monday, Wednesday, Friday. Every day
  (including post days) also ships one SEO audit fix or improvement. Tuesday,
  Thursday, Saturday and Sunday may refresh an older post instead of a code fix
  when that is the higher-value move.
- **Audience:** roughly 50/50 owners and guests, tracked in `calendar.md`.
  Owner posts aim at management leads (free earning estimate, /owners pages).
  Guest posts aim at direct bookings (booking.cardorentals.com, /neighborhoods).
- **Images, in this order:** (1) photos of Cardo's own homes from
  booking.cardorentals.com listings (Rich approved; use the listing's image
  URL directly as `img`, or save it under `public/assets/photos/journal/` if
  the shell can download it; pick a photo that matches the topic or
  neighborhood, and never one showing a guest or owner); (2) photos already in
  the site (`public/assets/photos`, existing article `img` values); (3)
  free-licensed stock (Unsplash, Pexels) when nothing fits. Never a photo of an identifiable private person. Save stock
  images into `public/assets/photos/journal/` and credit the photographer in
  `heroCaption`.
- **Tax, legal and STRO-rule posts publish automatically** only when every
  figure is checked against a primary source (sandiego.gov, IRS, CA FTB,
  city code) on the day of writing, linked inline, with a visible "As of
  {Month Year}" and a closing line that the post is general information, not
  tax or legal advice. If a figure cannot be confirmed from a primary source,
  cut the claim or swap the topic.

## Rich's input, 2 days ahead

- Slack channel **#website-seo** is the job's home: questions, recaps, and
  Rich's replies (read thread replies too).
- Every run looks two post days ahead. If that post needs something only Rich
  has (a client OK to name a home or owner, a real number, a photo, a quote,
  a topic call), post one short question in #website-seo, tagged with the
  target date, and log it under "Open questions" in `calendar.md`.
- **Never wait.** If there is no answer by the post day, publish the best
  version without that input (anonymize, drop the number, use a stock photo)
  or swap in a ready topic that needs nothing. Note which in the recap.
- At most 2 questions a day. Batch them in one message.

## Sources for ideas

Mine these every run (skim; don't read everything) and add strong ideas to
the backlog in `calendar.md`:

- **Slack:** what the team is working on, recurring guest or owner issues and
  how they were solved, wins (record months, five-star streaks, a fixed
  problem), new homes onboarding, market chatter.
- **Gmail (Rich's inbox):** owner emails and reviews/praise, owner statements
  or revenue reports, PDFs with stats (owner reports, market data, AirDNA
  exports, case study material), STRO/TOT notices from the city, industry
  newsletters.
- **The site itself:** existing case studies, /reviews, the Journal, and
  `docs/seo-aeo-strategy.md` (Workstream 2 topic list and phased plan).
- Search Console / GA4 are not connected; use live search results and the
  site audit instead.

**Privacy rules for mined material (no exceptions):**
- Never publish an owner's or guest's name, email, phone, street address,
  or exact unit, unless Rich confirmed in #website-seo that the person agreed.
  Case studies use the home's nickname (as existing case studies do:
  Falcon, Nute, Twain) and neighborhood only.
- Owner praise from email is quoted only with Rich's OK; otherwise
  paraphrase and attribute as "a Pacific Beach owner".
- Revenue and occupancy figures for a single home: use them only if the home
  already has a public case study or Rich confirmed. Portfolio-level
  aggregates are fine if stated as Cardo's own data with a date.
- Never publish internal issues in a way that blames a person, vendor, or
  owner. Frame them as "a problem we see, and how we handle it".
- Never forward, quote, or copy email or Slack content anywhere except into
  a post draft in this repo.

## Daily steps

1. `git pull`. Read this file, `calendar.md`, the last 14 days of `log.md`,
   and new replies in #website-seo since the last run.
2. **Mine** Slack and Gmail (last 2 days, plus anything Rich pointed to) and
   update the backlog. Mark which ideas need Rich's input.
3. **Plan ahead:** make sure the next 3 post days have a topic in
   `calendar.md`, balancing owner/guest. Send any 2-day-ahead questions.
4. **If today is a post day (Mon/Wed/Fri), write the post** (see "Writing a
   post"). Commit to a branch, open a PR, wait for the `pr-preview.yml` check
   to go green, then squash-merge. The `journal-publish.yml` workflow
   publishes it and rebuilds the live site. Confirm the live URL returns 200
   within about 15 minutes; if not, read the workflow run and fix or report.
5. **Daily SEO fix:** audit (see "Audit"), pick the single highest-impact
   item that fits in one small PR, make it, open the PR, wait for the
   preview check, look at the preview page, then squash-merge. One fix a day,
   even on post days. On a refresh day, the fix can be updating an older post
   (re-save its JSON under `content/journal/` with an updated `dateFull`).
6. Update `calendar.md` and append to `log.md` (date, post, fix, questions
   asked, what got pushed forward without input). Commit with the fix PR or
   a tiny follow-up commit to main.
7. Post the recap in #website-seo (format below).

## Writing a post

- One article object as JSON in `content/journal/{slug}.json`, fields per
  `src/data/blog.ts`: slug, title, category (reuse existing categories:
  Revenue, Tax, Case studies, Design, Compliance, Neighborhoods, Accounting,
  Operations, Surf & sand, Food & drink, Family adventures, Explore like a
  local), excerpt, readTime, dateFull ("November 9, 2026"), dateShort
  ("Nov 2026"), img, seo {title ≤ 60 chars, description 140–155 chars},
  author {name: "Cardo Vacation Rentals", initials: "CV"} unless Rich says
  otherwise, heroCaption, bodyHtml, flags only when needed.
- 1,200–2,000 words for owner guides, 800–1,400 for guest posts. Depth over
  length: San Diego specifics, real numbers with sources, no filler.
- AEO shape: question-style H2s, a 40–80 word direct answer right under each,
  then detail. Visible "As of {Month Year}" for anything time-sensitive.
- 3+ internal links (`<a class='inline'>`): at least one to a related
  Journal post and one to a money page (/owners#estimate, /owners/switch,
  /owners/management-fees, a /neighborhoods page, or booking.cardorentals.com
  for guest posts). Add a link back to the new post from one related older
  post when it helps (that counts as a separate small change, not the fix).
- Body vocabulary: `<p class='lede'>`, `<h2>`, `<h3>`, `<ul>`,
  `<blockquote>`, `<div class='callout'><p class='eyebrow'>…</p><p>…</p></div>`.
- Copy rules from CLAUDE.md always apply: journalist voice for owner posts
  (warmer for guest posts), no em dashes, never "luxury", "Vrbo" casing,
  "up to 32%" performance claim only, no catch phrases. Never invent stats,
  quotes, reviews, or case-study results.
- Before committing: run the same checks `blog:publish` runs (no em dash,
  VRBO, luxur) and confirm no topic duplicates an existing post
  (`content/journal/` and the live /blog index).

## Audit

Rotate through these, keep a running list in `calendar.md` under
"Audit findings", and fix the top one each day:

- Title/meta length and uniqueness, one clear H1 per page with the target
  keyword, image alt text, broken links and anchors (e.g. `#results`),
  duplicate blocks, canonical and Open Graph tags, sitemap and robots.
- Structured data: Organization (sameAs), LocalBusiness, Article with
  datePublished/dateModified and author on Journal posts, BreadcrumbList,
  FAQPage where there are real FAQs, Service on owner pages.
- Internal linking gaps, orphan pages, Journal posts with no dates visible.
- Core Web Vitals basics: image sizes and formats, lazy loading, layout shift.
- Content: thin pages, outdated figures, the Workstream 2/Phase 3 pages in
  `docs/seo-aeo-strategy.md` that do not exist yet.

**Off limits for automatic changes:** lead forms and SMS consent copy, the
booking widget, privacy/terms pages, GTM / Meta Pixel / tracking, pricing and
management-fee numbers, Firebase config and functions, and the admin app.
If the top finding is in one of these areas, raise it in the recap as "Needs
you" and fix the next item instead.

## Safety

- Every change goes through a PR whose preview check must pass before
  merging. Never push straight to main except the `calendar.md` / `log.md`
  bookkeeping commit.
- If the preview check fails twice, close the PR, log it, and move on.
- If a merge breaks the live site (homepage or /blog not 200), revert the
  merge commit right away and tell Rich in the recap.
- Never print or commit secrets.

## Recap format (Slack mrkdwn)

```
*SEO autopilot, Mon Nov 9*
📝 *New post:* <url|Title> (owner/guest)
🔧 *Fix:* one plain sentence on what changed and why it matters
❓ *Need from you by Wed:* question (or "nothing")
⏭️ *Pushed ahead without input:* only if it happened
⚠️ *Needs you:* only for off-limits findings or failures
```
