# SEO autopilot calendar

The job keeps this file current. Rich can edit it any time: reorder topics,
add ideas, or strike ones he does not want.

## Audience balance (last 10 posts)

Owner: 1 · Guest: 1 (target roughly 50/50)

## Upcoming posts

| Date | Topic | Audience | Needs Rich? | Status |
|---|---|---|---|---|
| Mon Nov 9 | San Diego holiday events, December 2026 | Guest | No | Published (/blog/san-diego-holiday-events-december-2026) |
| Wed Nov 11 | Buying or selling a San Diego home with an STRO license (non-transferability) | Owner | Optional example (no answer; written from city rules) | Published (/blog/selling-or-buying-a-home-with-a-san-diego-stro-license) |
| Fri Nov 13 | San Diego with a dog: beaches, patios, pet-friendly stays | Guest | No (link booking.cardorentals.com/s?petAllowed=true) | Planned |
| Mon Nov 16 | Is San Diego oversaturated? STR vs long-term rental, honest numbers | Owner | No | Planned |
| Wed Nov 18 | Best San Diego beaches by kind of trip (families, surfers, dogs) | Guest | No | Planned |

## Backlog

Starter ideas from `docs/seo-aeo-strategy.md` and gaps in the current Journal
(heavy on case studies, light on guest content):

- Owner: Does hiring a manager affect the short-term rental tax loophole? (primary sources only)
- Owner: San Diego revenue benchmarks by neighborhood, 2026
- Owner: Mission Beach Tier 4 waitlist explained
- Owner: Coronado, Oceanside, Carlsbad, Encinitas, Del Mar rules (one short page each)
- Guest: A rainy-day San Diego list
- Guest: Neighborhood guides for Ocean Beach, Point Loma, North Park

## Open questions for Rich

| Asked | For post date | Question | Answer |
|---|---|---|---|
| Nov 9 | Wed Nov 11 | Any anonymized owner story about selling/buying a home and the STRO license not transferring? | No answer; published from city rules alone |

## Audit findings (top first)

From a first look on Nov 8, 2026 (re-checked Nov 9):

- Homepage carries every Journal post's full body in a hidden JSON block (`data-blog-seed` in ThingsToDo.astro and owners CaseStudies.astro, used by the admin editor), about 160 KB today and growing ~3 posts a week. Not visible to search engines as content, but it slows the page. Admin app area: flagged for Rich.
- Empty or generic image alt text on the homepage (Explore cards use the title as alt).
- GTM noscript reference renders as a visible link (tracking: flag for Rich, off limits).
- Done Nov 9: BlogPosting image now an absolute URL; guest-category posts get the booking CTA (PR #69).
- Done Nov 12: Journal related-posts block now picks by category, audience and neighborhood instead of list position (PR #76).
- Done Nov 11: Journal index H1, title and meta now cover owners and guests (PR #75).
- Done Nov 10: homepage H1 now "Vacation rentals in San Diego" (was "Vacation in San Diego").
- Checked Nov 10, not an issue: the homepage no longer renders the Reviews block; no duplicated review cards or hero in live HTML.
- Checked Nov 9, not an issue: `#results` anchor exists on the homepage; Journal posts already have BlogPosting + BreadcrumbList schema and visible dates.
