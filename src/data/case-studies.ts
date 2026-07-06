// =============================================================
// Cardo V3 — Case studies data model (CMS-ready).
// Content extracted verbatim from design_handoff_v3_site/design-reference/
// case-study-<slug>.html (falcon, nute, twain, sixth, kane, mt-ainsworth).
// One data-driven template renders all 6 case-study pages from this file.
// A future CMS will populate this `caseStudies[]` array; every field here
// is plain data so the rendering template stays decoupled from content.
// =============================================================

export interface ScopeLine {
  label: string;
  amount: string;
}

export interface CaseStudy {
  slug: string;
  name: string;
  neighborhood: string;
  beds: string;
  date: string;
  hook: string;
  seo: {
    title: string;
    description: string;
  };
  cardImg: string;
  gallery: string[];
  story: string[];
  stats: {
    annualRevenue: string;
    avgNight: string;
    overMarket: string;
    totalInvested: string;
  };
  scope: ScopeLine[];
  scopeTotal: string;
  contactTitle: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'falcon',
    name: 'Falcon',
    neighborhood: 'La Jolla',
    beds: '4 BR',
    date: 'June 2026',
    hook: 'An inherited bluff home, dated and half-furnished, fully reimagined and launched in five weeks.',
    seo: {
      title: 'Falcon — Case study — Cardo Vacation Rentals',
      description: 'An inherited bluff home, dated and half-furnished, fully reimagined and launched in five weeks.',
    },
    cardImg: '/assets/photos/designs-living-craftsman.jpg',
    gallery: [
      '/assets/photos/designs-living-craftsman.jpg',
      '/assets/photos/designs-living-fireplace.jpg',
      '/assets/photos/designs-dining.jpg',
      '/assets/photos/designs-bedroom-fan.jpg',
    ],
    story: [
      "Falcon came to us inherited and frozen in time — good bones and an unbeatable bluff location, buried under decades of mismatched furniture. The owner lived out of state and had neither the time nor the appetite to manage a renovation from afar, so they approved our plan and stepped back entirely.",
      "Our design team cleared the home, repainted throughout, and furnished every room to make the most of the light and the view. We sourced and shipped the furniture, hung the art, stocked the kitchen, and staged it for the photographer — start to finish on a single invoice.",
      "Five weeks later Falcon launched fully styled and photographed, and settled into the top tier of its La Jolla market at 57% above comparable homes.",
    ],
    stats: {
      annualRevenue: '$214,800',
      avgNight: '$589',
      overMarket: '+57%',
      totalInvested: '$78,400',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$41,200' },
      { label: 'Paint & handyman', amount: '$9,800' },
      { label: 'Art & styling', amount: '$7,500' },
      { label: 'Outdoor & patio', amount: '$6,900' },
      { label: 'Kitchen & bar kit', amount: '$6,400' },
      { label: 'Photography', amount: '$3,400' },
      { label: 'White-linen setup', amount: '$3,200' },
    ],
    scopeTotal: '$78,400',
    contactTitle: "Like what Falcon became? Let's talk about yours.",
  },
  {
    slug: 'nute',
    name: 'Nute',
    neighborhood: 'Pacific Beach',
    beds: '3 BR',
    date: 'May 2026',
    hook: 'A tired walk-street rental turned light, bright, and fully booked within its first month.',
    seo: {
      title: 'Nute — Case study — Cardo Vacation Rentals',
      description: 'A tired walk-street rental turned light, bright, and fully booked within its first month.',
    },
    cardImg: '/assets/photos/designs-living-bright.jpg',
    gallery: [
      '/assets/photos/designs-living-bright.jpg',
      '/assets/photos/designs-bedroom-floral.jpg',
      '/assets/photos/designs-dining.jpg',
      '/assets/photos/designs-amenities.jpg',
    ],
    story: [
      "Nute had been a long-term rental for years — functional, dim, and forgettable. The owner wanted to move it to short-term but had been quoted long timelines and bigger budgets elsewhere, and had no interest in project-managing the work.",
      "We took it from drab to coastal-bright: a lighter palette, smarter furniture for the walk-street layout, and styling that made the small footprint feel generous. After one approval call, the owner left the rest to us.",
      "It photographed beautifully, booked solid in its first month, and now runs 44% ahead of its Pacific Beach market.",
    ],
    stats: {
      annualRevenue: '58,300',
      avgNight: '$412',
      overMarket: '+44%',
      totalInvested: '$52,100',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$27,600' },
      { label: 'Paint & handyman', amount: '$7,200' },
      { label: 'Art & styling', amount: '$4,900' },
      { label: 'Kitchen & bar kit', amount: '$4,800' },
      { label: 'Photography', amount: '$2,800' },
      { label: 'White-linen setup', amount: '$2,600' },
      { label: 'Electronics & smart home', amount: '$2,200' },
    ],
    scopeTotal: '$52,100',
    contactTitle: "Like what Nute became? Let's talk about yours.",
  },
  {
    slug: 'twain',
    name: 'Twain',
    neighborhood: 'Del Mar',
    beds: '4 BR',
    date: 'May 2026',
    hook: "A craftsman classic styled to own Del Mar's racing season — and hold strong the rest of the year.",
    seo: {
      title: 'Twain — Case study — Cardo Vacation Rentals',
      description: "A craftsman classic styled to own Del Mar's racing season — and hold strong the rest of the year.",
    },
    cardImg: '/assets/photos/designs-dining.jpg',
    gallery: [
      '/assets/photos/designs-dining.jpg',
      '/assets/photos/designs-living-craftsman.jpg',
      '/assets/photos/designs-living-fireplace.jpg',
      '/assets/photos/designs-bedroom-fan.jpg',
    ],
    story: [
      "Twain is a true craftsman — wood detailing, built-ins, character in every room. The owner loved the house but had no interest in furnishing it for short-term guests, and worried a generic staging would flatten everything that made it special.",
      "Our team designed around the architecture instead of over it: warm, layered furnishings that read editorial in photos and live comfortably for a full house. The owner trusted us with every detail, start to finish.",
      "Twain now commands Del Mar's racing-season premium and runs 48% above its market across the year.",
    ],
    stats: {
      annualRevenue: '92,500',
      avgNight: '$512',
      overMarket: '+48%',
      totalInvested: '$69,800',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$36,400' },
      { label: 'Paint & handyman', amount: '$9,100' },
      { label: 'Art & styling', amount: '$6,800' },
      { label: 'Kitchen & bar kit', amount: '$5,900' },
      { label: 'Outdoor & patio', amount: '$5,200' },
      { label: 'Photography', amount: '$3,400' },
      { label: 'White-linen setup', amount: '$3,000' },
    ],
    scopeTotal: '$69,800',
    contactTitle: "Like what Twain became? Let's talk about yours.",
  },
  {
    slug: 'sixth',
    name: 'Sixth',
    neighborhood: 'Mission Beach',
    beds: '2 BR',
    date: 'April 2026',
    hook: 'A compact two-bedroom that punches well above its size — and its nightly comps.',
    seo: {
      title: 'Sixth — Case study — Cardo Vacation Rentals',
      description: 'A compact two-bedroom that punches well above its size — and its nightly comps.',
    },
    cardImg: '/assets/photos/designs-bedroom-floral.jpg',
    gallery: [
      '/assets/photos/designs-bedroom-floral.jpg',
      '/assets/photos/designs-living-bright.jpg',
      '/assets/photos/designs-amenities.jpg',
      '/assets/photos/designs-bedroom-fan.jpg',
    ],
    story: [
      "Small homes are the hardest to make special, and Sixth is small — a two-bedroom a block from the sand. The owner assumed its size capped what it could earn, and had nearly listed it long-term to avoid the hassle.",
      "We designed every inch to work twice as hard: dual-purpose furniture, a bright cohesive palette, and styling that photographs larger than the footprint. The owner handed it over and let the team run.",
      "Guests book it for the location and rate it for the comfort — and it now runs 39% above its Mission Beach market.",
    ],
    stats: {
      annualRevenue: '28,400',
      avgNight: '$356',
      overMarket: '+39%',
      totalInvested: '$41,600',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$22,400' },
      { label: 'Paint & handyman', amount: '$5,600' },
      { label: 'Kitchen & bar kit', amount: '$4,100' },
      { label: 'Art & styling', amount: '$3,900' },
      { label: 'Photography', amount: '$2,400' },
      { label: 'White-linen setup', amount: '$2,200' },
      { label: 'Accessories & extras', amount: '$1,000' },
    ],
    scopeTotal: '$41,600',
    contactTitle: "Like what Sixth became? Let's talk about yours.",
  },
  {
    slug: 'kane',
    name: 'Kane',
    neighborhood: 'Encinitas',
    beds: '3 BR',
    date: 'April 2026',
    hook: 'A surf-town home with a game room guests now book it specifically for.',
    seo: {
      title: 'Kane — Case study — Cardo Vacation Rentals',
      description: 'A surf-town home with a game room guests now book it specifically for.',
    },
    cardImg: '/assets/photos/designs-gameroom.jpg',
    gallery: [
      '/assets/photos/designs-gameroom.jpg',
      '/assets/photos/designs-living-fireplace.jpg',
      '/assets/photos/designs-bedroom-fan.jpg',
      '/assets/photos/designs-amenities.jpg',
    ],
    story: [
      "Kane had an underused bonus room and an owner with a full-time job two time zones away. They knew the space could be a differentiator but had no bandwidth to figure out how — and no desire to coordinate vendors remotely.",
      "We turned the bonus room into a moody navy game room that anchors the whole listing, then styled the rest of the home to match the energy. The owner approved a moodboard remotely and stayed out of the rest.",
      "It has become the feature guests search for, lifting both bookings and rate to 41% above its Encinitas market.",
    ],
    stats: {
      annualRevenue: '68,300',
      avgNight: '$447',
      overMarket: '+41%',
      totalInvested: '$58,200',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$30,800' },
      { label: 'Paint & handyman', amount: '$7,400' },
      { label: 'Game-room build-out', amount: '$6,200' },
      { label: 'Kitchen & bar kit', amount: '$4,600' },
      { label: 'Art & styling', amount: '$4,200' },
      { label: 'White-linen setup', amount: '$2,600' },
      { label: 'Photography', amount: '$2,400' },
    ],
    scopeTotal: '$58,200',
    contactTitle: "Like what Kane became? Let's talk about yours.",
  },
  {
    slug: 'mt-ainsworth',
    name: 'Mt Ainsworth',
    neighborhood: 'Coronado',
    beds: '5 BR',
    date: 'March 2026',
    hook: 'A five-bedroom estate with a resort backyard, finished to sit at the top of its market.',
    seo: {
      title: 'Mt Ainsworth — Case study — Cardo Vacation Rentals',
      description: 'A five-bedroom estate with a resort backyard, finished to sit at the top of its market.',
    },
    cardImg: '/assets/photos/designs-pool.jpg',
    gallery: [
      '/assets/photos/designs-pool.jpg',
      '/assets/photos/designs-living-craftsman.jpg',
      '/assets/photos/designs-dining.jpg',
      '/assets/photos/designs-living-bright.jpg',
    ],
    story: [
      "Mt Ainsworth is the largest home in this group — five bedrooms, a pool, and a backyard built for entertaining. The owner wanted it to compete at the very top of Coronado’s market but had neither the time nor the design eye to get it there, and wanted to be entirely out of the process.",
      "We furnished it as a true estate: cohesive rooms that photograph like a luxury hotel and a backyard styled into a destination of its own. After a single walkthrough, the owner left it entirely to us.",
      "It launched at the top of its comp set and runs 61% above its Coronado market — the strongest lift of the six.",
    ],
    stats: {
      annualRevenue: '$268,900',
      avgNight: '$694',
      overMarket: '+61%',
      totalInvested: '$94,700',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$48,600' },
      { label: 'Paint & handyman', amount: '$11,200' },
      { label: 'Outdoor & pool styling', amount: '$10,200' },
      { label: 'Art & styling', amount: '$8,400' },
      { label: 'Kitchen & bar kit', amount: '$7,800' },
      { label: 'Photography', amount: '$4,600' },
      { label: 'White-linen setup', amount: '$3,900' },
    ],
    scopeTotal: '$94,700',
    contactTitle: "Like what Mt Ainsworth became? Let's talk about yours.",
  },
];
