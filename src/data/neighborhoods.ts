// =============================================================
// Cardo V3 — Neighborhoods data model.
// Content extracted verbatim from design_handoff_v3_site/design-reference/
// neighborhoods.html (index cards) and neighborhood-<slug>.html (per-market
// detail pages). One data-driven template renders all 7 market pages from
// this file. Pattern headings (hero h1, market h2, aside h3, cta h2,
// eyebrows) are NOT stored here — the template derives them from `name`.
// =============================================================

export interface Neighborhood {
  slug: string;
  name: string;
  note: string;
  img: string;
  seo: {
    title: string;
    description: string;
  };
  intro: string;
  stats: { v: string; l: string }[];
  body: string[];
  highlights: string[];
  asideText: string;
  guide: {
    lede: string;
    items: { k: string; v: string; d: string }[];
  };
  ctaText: string;
}

export const neighborhoods: Neighborhood[] = [
  {
    slug: 'la-jolla',
    name: 'La Jolla',
    note: 'Bluff-top luxury & coastal estates',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
    seo: {
      title: 'La Jolla Vacation Rental Management | Cardo — San Diego',
      description:
        'Luxury short-term rental management in La Jolla, San Diego. Cardo designs, markets, and manages La Jolla vacation rentals to beat the market — 5-star Superhost since 2013.',
    },
    intro:
      "La Jolla is San Diego's most prestigious coastal enclave — bluff-top estates, cove views, and a village that draws affluent, design-conscious travelers year-round. It's a market where finish quality and presentation, not just location, decide the nightly rate.",
    stats: [
      { v: '$520–$700', l: 'Typical nightly rate range' },
      { v: '74%', l: 'Avg. managed occupancy' },
      { v: 'Summer & holiday weekends', l: 'Peak demand' },
    ],
    body: [
      'Homes here command some of the highest nightly rates in San Diego, but the bar is high: guests booking La Jolla expect hotel-grade interiors, immaculate turnovers, and seamless service. A home that photographs beautifully and is run to a luxury standard can sit well above its comp set — which is exactly where Cardo positions the properties we manage.',
      "We pair in-house design with dynamic pricing tuned to La Jolla's demand curve — the summer coastal peak, holiday weekends, and the steady shoulder seasons that stay warm and busy here. The result is a calendar that captures the high-value nights instead of discounting into them.",
    ],
    highlights: [
      'Bluff and cove-view luxury homes',
      'Affluent, design-led guest demand',
      'Strong year-round occupancy',
    ],
    asideText:
      "Get a free, data-backed revenue projection built from your home's location, size, and finish — usually within one business day.",
    guide: {
      lede:
        'We live here — so our guests get the real list, not the tourist one. A taste of what’s in every Cardo La Jolla guidebook.',
      items: [
        {
          k: 'Coffee',
          v: 'Coffee & pastries',
          d: 'Wake up with an oat-milk latte and a sea breeze just off the Cove.',
        },
        {
          k: 'Eat',
          v: 'Fish tacos',
          d: 'The locals’ order is grilled, not fried — with a walk to the seals after.',
        },
        {
          k: 'Do',
          v: 'Snorkel the Cove',
          d: 'Calm, protected water and garibaldi everywhere — go early before the crowd.',
        },
        {
          k: 'Sunset',
          v: 'Walk the bluffs',
          d: 'The Coast Walk Trail at golden hour is the photo you’ll text everyone.',
        },
      ],
    },
    ctaText: 'A data-backed projection for your La Jolla market — no obligation.',
  },
  {
    slug: 'pacific-beach',
    name: 'Pacific Beach',
    note: 'Walkable, high-occupancy favorites',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    seo: {
      title: 'Pacific Beach Vacation Rental Management | Cardo — San Diego',
      description:
        'Luxury short-term rental management in Pacific Beach, San Diego. Cardo designs, markets, and manages Pacific Beach vacation rentals to beat the market — 5-star Superhost since 2013.',
    },
    intro:
      "Pacific Beach is San Diego's most energetic short-term rental market — walkable, beach-adjacent, and in near-constant demand from younger travelers and groups. Occupancy runs high here, and the homes that win are the ones designed to feel bright, easy, and effortlessly coastal.",
    stats: [
      { v: '$340–$460', l: 'Typical nightly rate range' },
      { v: '78%', l: 'Avg. managed occupancy' },
      { v: 'Summer & weekends', l: 'Peak demand' },
    ],
    body: [
      "PB's walk-street layout and proximity to the boardwalk make even compact homes strong performers, but the competition is dense. Smart design that maximizes a small footprint, plus pricing that reads the weekend-heavy demand correctly, is what separates a fully-booked calendar from an average one.",
      'Cardo manages PB homes to keep occupancy high without leaving rate on the table — bright, durable interiors that photograph well, fast turnovers between back-to-back stays, and after-hours support for a market that books late and books often.',
    ],
    highlights: [
      'Walkable to beach & boardwalk',
      'High occupancy, weekend-driven',
      'Great for compact, well-designed homes',
    ],
    asideText:
      "Get a free, data-backed revenue projection built from your home's location, size, and finish — usually within one business day.",
    guide: {
      lede:
        'We live here — so our guests get the real list, not the tourist one. A taste of what’s in every Cardo Pacific Beach guidebook.',
      items: [
        {
          k: 'Coffee',
          v: 'Boardwalk espresso',
          d: 'Grab it to-go and start the morning on the sand at Crystal Pier.',
        },
        {
          k: 'Eat',
          v: 'Taco shop tacos',
          d: 'PB does the late-night carne asada better than anywhere.',
        },
        {
          k: 'Do',
          v: 'Cruise the boardwalk',
          d: 'Rent a beach cruiser (we leave ours for you) and ride to Mission Beach.',
        },
        {
          k: 'Sunset',
          v: 'Crystal Pier',
          d: 'Stand over the water as the sun drops — hard to beat.',
        },
      ],
    },
    ctaText: 'A data-backed projection for your Pacific Beach market — no obligation.',
  },
  {
    slug: 'mission-beach',
    name: 'Mission Beach',
    note: 'Boardwalk demand & beachfront homes',
    img: 'https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?auto=format&fit=crop&w=1600&q=80',
    seo: {
      title: 'Mission Beach Vacation Rental Management | Cardo — San Diego',
      description:
        'Luxury short-term rental management in Mission Beach, San Diego. Cardo designs, markets, and manages Mission Beach vacation rentals to beat the market — 5-star Superhost since 2013.',
    },
    intro:
      "Mission Beach is a classic San Diego beach market — boardwalk frontage, sand on your doorstep, and summer demand that fills calendars months out. Beachfront and near-beach homes here can command a real premium when they're presented and run well.",
    stats: [
      { v: '$330–$520', l: 'Typical nightly rate range' },
      { v: '77%', l: 'Avg. managed occupancy' },
      { v: 'Summer', l: 'Peak demand' },
    ],
    body: [
      'The location does a lot of the work in Mission Beach, but guests still rate the experience — and the homes that earn the best reviews and repeat bookings are the ones that feel cared for, not just close to the water. Comfortable, durable design that survives a busy beach season is essential.',
      'Cardo designs and manages Mission Beach homes to capture the steep summer peak and hold occupancy through the shoulders — with pricing tuned to the boardwalk demand and turnovers fast enough to keep a tight summer calendar running clean.',
    ],
    highlights: [
      'Boardwalk & beachfront locations',
      'Steep, lucrative summer peak',
      'Repeat-booking guest base',
    ],
    asideText:
      "Get a free, data-backed revenue projection built from your home's location, size, and finish — usually within one business day.",
    guide: {
      lede:
        'We live here — so our guests get the real list, not the tourist one. A taste of what’s in every Cardo Mission Beach guidebook.',
      items: [
        {
          k: 'Coffee',
          v: 'Beachfront coffee',
          d: 'Caffeine, then straight across the boardwalk to the sand.',
        },
        {
          k: 'Eat',
          v: 'Belmont eats',
          d: 'Classic beach food a few steps from the roller coaster.',
        },
        {
          k: 'Do',
          v: 'Belmont Park',
          d: 'The 1925 wooden coaster is a rite of passage for the kids.',
        },
        {
          k: 'Sunset',
          v: 'Bayside paddle',
          d: 'Calmer water on the Mission Bay side — perfect for a sunset SUP.',
        },
      ],
    },
    ctaText: 'A data-backed projection for your Mission Beach market — no obligation.',
  },
  {
    slug: 'del-mar',
    name: 'Del Mar',
    note: 'Racetrack-season premium homes',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    seo: {
      title: 'Del Mar Vacation Rental Management | Cardo — San Diego',
      description:
        'Luxury short-term rental management in Del Mar, San Diego. Cardo designs, markets, and manages Del Mar vacation rentals to beat the market — 5-star Superhost since 2013.',
    },
    intro:
      "Del Mar blends quiet coastal affluence with event-driven demand spikes — the summer racing season, fairgrounds events, and holiday weekends all move rate independently of the calendar. It's a market that rewards pricing that anticipates the windows rather than reacting to them.",
    stats: [
      { v: '$460–$640', l: 'Typical nightly rate range' },
      { v: '72%', l: 'Avg. managed occupancy' },
      { v: 'Racing season & summer', l: 'Peak demand' },
    ],
    body: [
      'Del Mar guests skew upscale and expect a refined home to match the town. Premium finishes, generous outdoor space, and polished presentation let a Del Mar property command its racing-season premium and hold strong through the rest of the year.',
      "Cardo manages Del Mar homes with dynamic pricing built around the town's event calendar, plus the in-house design and care standards that keep an upscale property earning at the top of its market.",
    ],
    highlights: [
      'Event-driven demand spikes',
      'Upscale, refined guest base',
      'Racing-season rate premiums',
    ],
    asideText:
      "Get a free, data-backed revenue projection built from your home's location, size, and finish — usually within one business day.",
    guide: {
      lede:
        'We live here — so our guests get the real list, not the tourist one. A taste of what’s in every Cardo Del Mar guidebook.',
      items: [
        {
          k: 'Coffee',
          v: 'Village coffee',
          d: 'A flat white in the village before a slow beach morning.',
        },
        {
          k: 'Eat',
          v: 'Ocean-view dinner',
          d: 'Book the patio — we’ll get you the reservation.',
        },
        {
          k: 'Do',
          v: 'Race season',
          d: 'When the ponies run, it’s the place to be — hats encouraged.',
        },
        {
          k: 'Sunset',
          v: 'Powerhouse Park',
          d: 'Grassy bluff right over the sand for the evening light.',
        },
      ],
    },
    ctaText: 'A data-backed projection for your Del Mar market — no obligation.',
  },
  {
    slug: 'encinitas',
    name: 'Encinitas',
    note: 'Surf-town charm, strong year-round',
    img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
    seo: {
      title: 'Encinitas Vacation Rental Management | Cardo — San Diego',
      description:
        'Luxury short-term rental management in Encinitas, San Diego. Cardo designs, markets, and manages Encinitas vacation rentals to beat the market — 5-star Superhost since 2013.',
    },
    intro:
      "Encinitas is North County's surf-town gem — laid-back, design-forward, and increasingly in demand from travelers looking for character over corporate. Its year-round mild weather and walkable downtown keep occupancy steady well beyond the summer peak.",
    stats: [
      { v: '$360–$500', l: 'Typical nightly rate range' },
      { v: '75%', l: 'Avg. managed occupancy' },
      { v: 'Summer & shoulder seasons', l: 'Peak demand' },
    ],
    body: [
      'The Encinitas guest is looking for a home with personality — coastal but considered, relaxed but well-appointed. Homes that lean into that character, rather than generic beach-rental styling, consistently earn higher rates and better reviews here.',
      "Cardo's in-house design team styles Encinitas homes to capture that surf-town editorial feel, and we price to the steady, less-seasonal demand that makes this one of North County's most reliable markets.",
    ],
    highlights: [
      'Character-driven coastal demand',
      'Steady, less-seasonal occupancy',
      'Walkable downtown & beaches',
    ],
    asideText:
      "Get a free, data-backed revenue projection built from your home's location, size, and finish — usually within one business day.",
    guide: {
      lede:
        'We live here — so our guests get the real list, not the tourist one. A taste of what’s in every Cardo Encinitas guidebook.',
      items: [
        {
          k: 'Coffee',
          v: '101 coffee',
          d: 'A surf-town roaster on Highway 101 to start the day right.',
        },
        {
          k: 'Eat',
          v: 'Casual coastal',
          d: 'Fish tacos and a craft beer steps from the bluff.',
        },
        {
          k: 'Do',
          v: 'Swami’s surf',
          d: 'One of the most storied breaks in California — longboard friendly.',
        },
        {
          k: 'Sunset',
          v: 'Self-Realization gardens',
          d: 'Quiet meditation gardens over the ocean at dusk.',
        },
      ],
    },
    ctaText: 'A data-backed projection for your Encinitas market — no obligation.',
  },
  {
    slug: 'carlsbad',
    name: 'Carlsbad',
    note: 'Family coastal & North County demand',
    img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1600&q=80',
    seo: {
      title: 'Carlsbad Vacation Rental Management | Cardo — San Diego',
      description:
        'Luxury short-term rental management in Carlsbad, San Diego. Cardo designs, markets, and manages Carlsbad vacation rentals to beat the market — 5-star Superhost since 2013.',
    },
    intro:
      "Carlsbad is North County's family-coastal anchor — beaches, LEGOLAND, the flower fields, and a steady stream of multi-generational travelers who book larger homes for longer stays. It's a market built for comfortable, family-ready properties.",
    stats: [
      { v: '$340–$480', l: 'Typical nightly rate range' },
      { v: '73%', l: 'Avg. managed occupancy' },
      { v: 'Summer & event weekends', l: 'Peak demand' },
    ],
    body: [
      'Family demand rewards homes that sleep more, function well, and feel welcoming — full kitchens, flexible bedrooms, and outdoor space. Longer average stays here also mean fewer turnovers and a more stable calendar when the home is designed and priced for it.',
      'Cardo manages Carlsbad homes for the family market: durable, practical design that still photographs beautifully, pricing tuned to school breaks and event weekends, and the operational standards that keep longer stays running smoothly.',
    ],
    highlights: [
      'Family-oriented, longer stays',
      'Attractions & event demand',
      'Larger homes perform well',
    ],
    asideText:
      "Get a free, data-backed revenue projection built from your home's location, size, and finish — usually within one business day.",
    guide: {
      lede:
        'We live here — so our guests get the real list, not the tourist one. A taste of what’s in every Cardo Carlsbad guidebook.',
      items: [
        {
          k: 'Coffee',
          v: 'Village roaster',
          d: 'Coffee in the walkable Carlsbad Village before the beach.',
        },
        {
          k: 'Eat',
          v: 'Family-friendly',
          d: 'Big tables, easy menus — made for a multi-gen trip.',
        },
        {
          k: 'Do',
          v: 'LEGOLAND & lagoon',
          d: 'The theme park for the kids, the lagoon trail for everyone.',
        },
        {
          k: 'Sunset',
          v: 'Tamarack Beach',
          d: 'Wide, mellow sand for the classic Carlsbad sunset.',
        },
      ],
    },
    ctaText: 'A data-backed projection for your Carlsbad market — no obligation.',
  },
  {
    slug: 'coronado',
    name: 'Coronado',
    note: 'Island prestige & event demand',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    seo: {
      title: 'Coronado Vacation Rental Management | Cardo — San Diego',
      description:
        'Luxury short-term rental management in Coronado, San Diego. Cardo designs, markets, and manages Coronado vacation rentals to beat the market — 5-star Superhost since 2013.',
    },
    intro:
      "Coronado is San Diego's island of prestige — a storied beach town with some of the region's highest nightly rates and a guest base that expects the experience to match. Demand is strong and event-driven, and presentation is everything.",
    stats: [
      { v: '$540–$760', l: 'Typical nightly rate range' },
      { v: '71%', l: 'Avg. managed occupancy' },
      { v: 'Summer & event weekends', l: 'Peak demand' },
    ],
    body: [
      'A Coronado home competes at the very top of the San Diego market, where luxury finishes and flawless service are the price of entry. Homes designed to a true estate standard, and run without a slip, can sit at the top of their comp set here.',
      "Cardo brings in-house design and white-glove management to Coronado properties — styling each home to compete with the island's best and pricing it to capture the event-driven demand that defines the market.",
    ],
    highlights: [
      'Top-of-market nightly rates',
      'Prestige, experience-led guests',
      'Event-driven demand',
    ],
    asideText:
      "Get a free, data-backed revenue projection built from your home's location, size, and finish — usually within one business day.",
    guide: {
      lede:
        'We live here — so our guests get the real list, not the tourist one. A taste of what’s in every Cardo Coronado guidebook.',
      items: [
        {
          k: 'Coffee',
          v: 'Orange Ave',
          d: 'Grab a coffee and stroll the island’s storybook main street.',
        },
        {
          k: 'Eat',
          v: 'Island dining',
          d: 'From casual to the Hotel Del — we’ll book the table.',
        },
        {
          k: 'Do',
          v: 'Beach cruiser loop',
          d: 'Flat, gorgeous, and easy — bikes waiting at the home.',
        },
        {
          k: 'Sunset',
          v: 'Coronado Beach',
          d: 'Consistently rated among the best in the U.S. — see why at golden hour.',
        },
      ],
    },
    ctaText: 'A data-backed projection for your Coronado market — no obligation.',
  },
];
