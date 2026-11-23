# SEO autopilot calendar

The job keeps this file current. Rich can edit it any time: reorder topics,
add ideas, or strike ones he does not want.

## Audience balance (last 10 posts)

Owner: 3 · Guest: 4 (autopilot posts since Nov 9; target roughly 50/50)

## Upcoming posts

| Date | Topic | Audience | Needs Rich? | Status |
|---|---|---|---|---|
| Mon Nov 9 | San Diego holiday events, December 2026 | Guest | No | Published (/blog/san-diego-holiday-events-december-2026) |
| Wed Nov 11 | Buying or selling a San Diego home with an STRO license (non-transferability) | Owner | Optional example (no answer; written from city rules) | Published (/blog/selling-or-buying-a-home-with-a-san-diego-stro-license) |
| Fri Nov 13 | San Diego with a dog: beaches, patios, pet-friendly stays | Guest | No | Published (/blog/san-diego-with-a-dog) |
| Mon Nov 16 | Is San Diego oversaturated? STR vs long-term rental, honest numbers | Owner | No | Published (/blog/is-san-diego-oversaturated-short-term-vs-long-term-rental) |
| Wed Nov 18 | Best San Diego beaches by kind of trip (families, surfers, quiet; link the dog post for dogs) | Guest | No | Published (/blog/best-san-diego-beaches-by-kind-of-trip) |
| Fri Nov 20 | Mission Beach Tier 4 STRO licenses and the waitlist, explained (primary sources only) | Owner | No | Published (/blog/mission-beach-tier-4-stro-license-waitlist) |
| Mon Nov 23 | A rainy-day San Diego list (museums, aquariums, indoor food halls; winter timing) | Guest | No | Published (/blog/rainy-day-san-diego) |
| Wed Nov 25 | Does hiring a manager affect the short-term rental tax loophole? (IRS material participation tests; primary sources only) | Owner | No | Planned |
| Fri Nov 27 | Ocean Beach neighborhood guide for visitors (pier, Newport Ave, dog beach link, where to eat; verify hours) | Guest | No | Planned |
| Mon Nov 30 | How owners should hear about repairs: work orders, photos and closing the loop (general; no names, homes or vendors) | Owner | No | Planned |

## Backlog

Starter ideas from `docs/seo-aeo-strategy.md` and gaps in the current Journal
(heavy on case studies, light on guest content):

- Owner: San Diego revenue benchmarks by neighborhood, 2026
- Owner: Coronado, Oceanside, Carlsbad, Encinitas, Del Mar rules (one short page each)
- Guest: Neighborhood guides for Point Loma, North Park (Ocean Beach scheduled Nov 27)
- Owner: Airbnb's new house rules policy (7 standard rules, the rest move to "Additional rules"; effective Nov 20, 2026 per a Guesty notice in Slack): what owners should change. Verify every detail against Airbnb's own help pages first.

## Notes

- Nov 17: Rich asked (Nov 16, PR #84, open) for shorter posts: owner guides 900–1,300 words, guest 600–1,000, state each fact once. Autopilot follows that now, even before #84 merges.

## Open questions for Rich

| Asked | For post date | Question | Answer |
|---|---|---|---|
| Nov 9 | Wed Nov 11 | Any anonymized owner story about selling/buying a home and the STRO license not transferring? | No answer; published from city rules alone |
| Nov 23 | Any day (site fix) | Which guest review count is current: 2,000+ (site default description, Organization schema) or 3,500+ (/reviews)? | |

## Audit findings (top first)

From a first look on Nov 8, 2026 (re-checked Nov 9):

- Done Nov 23: /reviews title now "San Diego Vacation Rental Reviews | Cardo Vacation Rentals" (was "Guest Reviews", no location) and meta 117 to 153 chars (PR #95, checked on preview). Found: sitewide default description and Organization schema in Base.astro say "2,000+ guest reviews" while /reviews says 3,500+; asked Rich which is current before changing.
- Done Nov 22: /case-studies/* pages now carry Article schema (headline, absolute gallery images, publish month, publisher, neighborhood) next to the breadcrumbs, and hooks under 120 chars get a short factual tail so descriptions run 133 to 158 (were 81 to 133) (PR #93, checked on preview). Remaining: Journal case-study posts 91 to 104 chars, /reviews 117, /careers 58 (needs Rich's hiring line), /terms 79 (off limits).
- Done Nov 21: /owners/san-diego-stro-license meta description 221 to ~151 chars (template stays 142 to 153 for any count/date; tracker numbers unchanged) and the owners FAQ fee link now goes straight to /owners/management-fees instead of through a 301 (PR #92, checked on preview). Remaining from a full crawl: /case-studies/* pages have only BreadcrumbList (no Article schema) and meta descriptions of 78 to 133 chars (data from Firestore/seed, not content/journal); Journal case-study posts 91 to 104; /reviews 117; /terms 79. No broken internal links found; /management-fees was the only internal link through a redirect.
- Done Nov 20: /realtor-referral meta description 191 to 151 chars (payout range unchanged) and /become-a-vendor 165 to 154 (PR #91, checked on preview). Remaining: /careers meta is 58 chars ("open roles coming soon"; Slack shows active hiring, so Rich may want a real careers description), /reviews 117 (could be fuller).

- Done Nov 19: eight older Journal posts had meta descriptions of 162 to 211 chars; now 148 to 156, and the cost segregation SEO title 63 to 54 (PR #89; JSON from the live data-blog-seed block, body and dates unchanged). Remaining short ones: case-study meta descriptions run 91 to 104 chars (could be fuller), and what-your-san-diego-home-could-earn-2026 is 126.
- Done Nov 18: /blog, /neighborhoods, /owners/cost-segregation and /owners/home-designs had no page-level schema; now CollectionPage (with ItemList) or WebPage, each with BreadcrumbList (PR #88, checked on preview). The Nov 16 note below was stale: /switch, /management-fees, /san-diego-stro-license and /best-vacation-rental-management already had breadcrumbs.
- Found Nov 18: Journal `dateModified` fix is not clean yet: every pre-November post carries the same Sept 17 migration timestamp as updatedAt, and refreshed posts get a new dateFull (so datePublished moves). Needs a separate `dateModified`/original-date field before switching.
- Done Nov 16: sitemap had no `<lastmod>`; Journal URLs now carry each post's Firestore updatedAt and /blog the newest (PR #83, checked on preview).
- Done Nov 17: April post "STRO permits, TOT, and staying compliant" refreshed (TMD applies only to 70+ room lodging; TOT 11.75/12.75/13.75% by zone; fees, counts, deadlines; meta 184 to 150) (PR #86). JSON taken from the homepage `data-blog-seed` block since no Firestore credentials in the session; now lives in content/journal/.
- Found Nov 16: Journal BlogPosting `dateModified` always equals `datePublished`; could use Firestore updatedAt (same source as the new sitemap lastmod).
- Homepage carries every Journal post's full body in a hidden JSON block (`data-blog-seed` in ThingsToDo.astro and owners CaseStudies.astro, used by the admin editor), about 160 KB today and growing ~3 posts a week. Not visible to search engines as content, but it slows the page. Admin app area: flagged for Rich.
- Empty or generic image alt text on the homepage (Explore cards use the title as alt).
- GTM noscript reference renders as a visible link (tracking: flag for Rich, off limits).
- Done Nov 9: BlogPosting image now an absolute URL; guest-category posts get the booking CTA (PR #69).
- Overlong meta descriptions remain on /owners/management-fees (193 chars, fee page: flag for Rich) and several Journal posts (165–211).
- Done Nov 15: owner page titles shortened from 64–82 to 47–59 chars (/owners, /owners/switch, /owners/san-diego-stro-license, /owners/cost-segregation) and /owners meta trimmed 163 to 155 (PR #81). /owners/management-fees title (82) and meta (193) left for Rich (fee page). Next up: overlong Journal meta descriptions (beyond-the-big-parks 211, 7-day-rule 196, cost-segregation post 193, STRO/TOT post 184) need a post refresh; posts not in content/journal/ need their full JSON from Firestore first.
- Done Nov 14: all seven neighborhood pages had a missing space in the meta description ("inLa Jolla"), 160–172 chars, and Del Mar/Encinitas/Carlsbad/Coronado labelled "San Diego"; now unique 150–155 char descriptions and titles 51–57 chars (PR #80). Owner page titles run 70–82 chars because of the " | Cardo Vacation Rentals" suffix.
- Done Nov 13: trimmed meta descriptions on /owners/switch, /owners/best-vacation-rental-management-san-diego and /owners/cost-segregation to 154–156 chars (PR #79).
- Checked Nov 13, minor: homepage alt text is descriptive except the decorative hero (empty alt, fine); Explore cards use the post title, acceptable.
- Done Nov 12: Journal related-posts block now picks by category, audience and neighborhood instead of list position (PR #76).
- Done Nov 11: Journal index H1, title and meta now cover owners and guests (PR #75).
- Done Nov 10: homepage H1 now "Vacation rentals in San Diego" (was "Vacation in San Diego").
- Checked Nov 10, not an issue: the homepage no longer renders the Reviews block; no duplicated review cards or hero in live HTML.
- Checked Nov 9, not an issue: `#results` anchor exists on the homepage; Journal posts already have BlogPosting + BreadcrumbList schema and visible dates.
