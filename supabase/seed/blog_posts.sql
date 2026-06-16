-- Seed: starter blog posts for the Cardo marketing blog.
-- Apply via Supabase SQL editor, `supabase db execute`, or MCP apply_migration.
-- Idempotent: re-running is safe (on conflict do nothing).
-- The site fetches published rows at build time (src/lib/blog.js).

insert into public.blog_posts (slug, title, excerpt, body, cover_image, cover_grad, author, tags, seo_description, status, published_at)
values
(
  'how-much-can-san-diego-airbnb-earn-2026',
  'How Much Can Your San Diego Home Earn on Airbnb in 2026?',
  'San Diego is one of the country''s strongest short-term rental markets. Here''s a realistic look at what your home could earn — and what actually moves the number.',
  $md$San Diego is one of the most reliable short-term rental markets in the country: year-round sun, a steady mix of leisure and business travel, and coastline that books out months ahead. But "how much can I make?" has a wide answer — the gap between an average listing and a top performer is enormous.

## What the typical San Diego home earns

Across the market, a typical San Diego short-term rental grosses somewhere in the **$45,000–$60,000 per year** range. That''s the median — and the median hides the real story.

- **Top 25% of homes** routinely clear **$430+ per night**.
- **Top 10%** command **$700+ per night** in peak season.
- The best-performing 10% earn close to **six times** what the bottom quartile does.

The difference is rarely the house. It''s the operation.

## What actually moves the number

1. **Design and photography.** Listings live or die on the first three photos. A professionally styled, well-shot home commands a premium and higher occupancy. This is exactly why we built [Home Designs by Cardo](/design).
2. **Dynamic pricing across every channel.** Static prices leave money on the table every weekend, holiday, and event. We price daily across Airbnb, Vrbo, Booking.com, Google Vacation Rentals and direct.
3. **Reviews and response.** Superhost status and fast guest communication push you up the search ranking, which compounds into more bookings at better rates.

## Your number, specifically

Market averages are a starting point — your home''s earning potential depends on its neighborhood, bedroom count, amenities, and how it''s run. The fastest way to a real figure is a free, data-backed estimate built around your property.

[Get your free revenue estimate →](/owners#estimate)
$md$,
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
  '#15324a,#1f6f6b',
  'Cardo Team',
  array['earnings','airbnb','san diego'],
  'A realistic 2026 look at how much a San Diego home can earn on Airbnb — typical figures, what separates top performers, and how to get your home''s number.',
  'published',
  '2026-05-20T16:00:00Z'
),
(
  'san-diego-str-rules-stro-permits-tot',
  'San Diego Short-Term Rental Rules: STRO Permits & TOT Explained',
  'Licensing, tiers, and taxes for San Diego short-term rentals — a plain-English guide for owners so your home stays compliant and bookable.',
  $md$San Diego''s short-term rental rules are stricter than they used to be — but they''re very manageable when you know the framework. Here''s the plain-English version for owners.

## The STRO license

The city requires a **Short-Term Residential Occupancy (STRO)** license for most stays under 30 nights. Licenses fall into tiers based on how the home is used:

- **Tier 1** — part-time, fewer than 20 days per year.
- **Tier 2** — home-sharing where the host lives on site.
- **Tier 3** — whole-home rentals more than 20 days per year (the most common investor tier; capacity is capped citywide).
- **Tier 4** — whole-home rentals specifically in Mission Beach.

Each tier has its own application, fees, and renewal cycle, and Tier 3 and 4 are limited in number — so timing and accuracy matter.

## Transient Occupancy Tax (TOT)

Short-term stays are subject to **Transient Occupancy Tax**, collected from guests and remitted to the city on a regular schedule. Some booking platforms collect portions automatically, but the owner remains responsible for correct filing.

## What this means for owners

Compliance isn''t hard — but missed filings, the wrong tier, or a lapsed license can pull your home offline at the worst time. We handle the entire compliance side for managed homes:

- STRO licensing and tier selection
- Renewal tracking
- TOT registration and filing
- Required reporting to the city

So your home stays bookable and you never get a surprise letter.

> Rules change. Always confirm current requirements with the City of San Diego — or let us track it for you.

[Talk to us about managing your home →](/owners#estimate)
$md$,
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  '#1b3a52,#3a5d77',
  'Cardo Team',
  array['regulations','permits','san diego'],
  'A plain-English guide to San Diego short-term rental rules: STRO license tiers, Transient Occupancy Tax (TOT), and how owners stay compliant.',
  'published',
  '2026-05-28T16:00:00Z'
),
(
  'la-jolla-luxury-vacation-rental-market',
  'Why La Jolla Is San Diego''s Strongest Luxury Rental Market',
  'Bluff-top views, premium nightly rates, and year-round demand make La Jolla a standout for luxury short-term rentals. Here''s what owners should know.',
  $md$If you own a home in La Jolla, you own one of the most sought-after addresses in Southern California — and one of San Diego''s strongest luxury rental markets.

## Why La Jolla commands a premium

- **Scarcity and prestige.** Bluff-top and ocean-view homes are limited, and guests pay handsomely for them.
- **Year-round demand.** Between the Cove, the village, and the broader San Diego draw, La Jolla rarely has a true off-season.
- **A guest who expects luxury.** This traveler isn''t bargain-hunting — they''re paying for an experience, which rewards homes that are beautifully styled and flawlessly run.

## What it takes to win here

A premium address only earns a premium rate if the listing matches the expectation. In La Jolla that means:

1. **Editorial-quality design and photography.** The bar is high. Our in-house [design team](/design) styles homes to photograph like a magazine spread.
2. **Concierge-level guest care.** Fast, polished communication and seamless stays drive the five-star reviews that keep luxury homes at the top of search.
3. **Pricing that captures peak demand** without leaving the shoulder season empty.

## Managing a La Jolla home

We manage luxury homes across La Jolla and coastal San Diego — marketing, design, transparent accounting, and maintenance that never lets a premium home slip.

[See how we''d manage your La Jolla home →](/neighborhoods/la-jolla)
$md$,
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
  '#23344a,#c19a5b',
  'Cardo Team',
  array['la jolla','luxury','neighborhoods'],
  'Why La Jolla is one of San Diego''s strongest luxury short-term rental markets — premium rates, year-round demand, and what it takes for owners to win.',
  'published',
  '2026-06-05T16:00:00Z'
)
on conflict (slug) do nothing;
