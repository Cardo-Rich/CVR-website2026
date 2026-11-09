# SEO autopilot calendar

The job keeps this file current. Rich can edit it any time: reorder topics,
add ideas, or strike ones he does not want.

## Audience balance (last 10 posts)

Owner: 0 · Guest: 1 (target roughly 50/50)

## Upcoming posts

| Date | Topic | Audience | Needs Rich? | Status |
|---|---|---|---|---|
| Mon Nov 9 | San Diego holiday events, December 2026 | Guest | No | Published (/blog/san-diego-holiday-events-december-2026) |
| Wed Nov 11 | Buying or selling a San Diego home with an STRO license (non-transferability) | Owner | Optional: anonymized real example | Planned; primary sources only (sandiego.gov, SDMC) |
| Fri Nov 13 | San Diego with a dog: beaches, patios, pet-friendly stays | Guest | No (link booking.cardorentals.com/s?petAllowed=true) | Planned |
| Mon Nov 16 | Is San Diego oversaturated? STR vs long-term rental, honest numbers | Owner | No | Planned |

## Backlog

Starter ideas from `docs/seo-aeo-strategy.md` and gaps in the current Journal
(heavy on case studies, light on guest content):

- Owner: Does hiring a manager affect the short-term rental tax loophole? (primary sources only)
- Owner: San Diego revenue benchmarks by neighborhood, 2026
- Owner: Mission Beach Tier 4 waitlist explained
- Owner: Coronado, Oceanside, Carlsbad, Encinitas, Del Mar rules (one short page each)
- Guest: Best San Diego beaches by kind of trip (families, surfers, dogs)
- Guest: A rainy-day San Diego list
- Guest: Neighborhood guides for Ocean Beach, Point Loma, North Park

## Open questions for Rich

| Asked | For post date | Question | Answer |
|---|---|---|---|
| Nov 9 | Wed Nov 11 | Any anonymized owner story about selling/buying a home and the STRO license not transferring? | |

## Audit findings (top first)

From a first look on Nov 8, 2026 (re-checked Nov 9):

- Homepage H1 "Vacation in San Diego" lacks the keyword "vacation rental". (Visible headline change; consider a subtle rewrite.)
- Duplicated review cards and duplicated hero block on the homepage.
- Empty or generic image alt text on the homepage (Explore cards use the title as alt).
- Journal: related-posts block picks the next 3 posts by index, not by topic or audience.
- GTM noscript reference renders as a visible link (tracking: flag for Rich, off limits).
- Done Nov 9: BlogPosting image now an absolute URL; guest-category posts get the booking CTA (PR #69).
- Checked Nov 9, not an issue: `#results` anchor exists on the homepage; Journal posts already have BlogPosting + BreadcrumbList schema and visible dates.
