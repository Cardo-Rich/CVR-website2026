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
    neighborhood: 'Mission Hills',
    beds: '4 BR',
    date: 'August 2025',
    hook: "A historic craftsman between Hillcrest and Mission Hills, furnished in a Japandi style, with a separate casita and a private hot tub.",
    seo: {
      title: 'Falcon | Case Study | Cardo Vacation Rentals',
      description: "A historic craftsman between Hillcrest and Mission Hills, furnished in a Japandi style, with a separate casita and a private hot tub.",
    },
    cardImg: '/assets/photos/homes/falcon-living.jpg',
    gallery: [
      '/assets/photos/homes/falcon-living.jpg',
      '/assets/photos/homes/falcon-dining.jpg',
      '/assets/photos/homes/falcon-sitting.jpg',
      '/assets/photos/homes/falcon-hot-tub.jpg',
    ],
    story: [
      "Falcon is a historic craftsman home on Falcon Street, between Hillcrest and Mission Hills. The main house keeps its original wood trim, fireplace and wide windows, and a separate casita on the lot gives larger groups more privacy.",
      "Cardo's design team furnished it in a Japandi style: oak tables, cream upholstery and simple lines that leave the original woodwork in view. Outside, patio seating and a six-person hot tub sit beside the casita.",
      "The home sleeps eight across four bedrooms and two bathrooms, with shops, restaurants and parks within walking distance.",
    ],
    stats: {
      annualRevenue: '$214,800',
      avgNight: '$589',
      overMarket: '+57%',
      totalInvested: '$75,000',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$41,200' },
      { label: 'Paint & handyman', amount: '$9,800' },
      { label: 'Art & styling', amount: '$7,500' },
      { label: 'Outdoor & patio', amount: '$6,900' },
      { label: 'Kitchen & bar kit', amount: '$6,400' },
      { label: 'White-linen setup', amount: '$3,200' },
    ],
    scopeTotal: '$75,000',
    contactTitle: "Like what Falcon became? Let's talk about yours.",
  },
  {
    slug: 'nute',
    name: 'Nute',
    neighborhood: 'Bay Ho',
    beds: '3 BR',
    date: 'April 2025',
    hook: "A Bay Ho home with a private pool and views across Mission Bay, furnished with bold color and two living rooms.",
    seo: {
      title: 'Nute | Case Study | Cardo Vacation Rentals',
      description: "A Bay Ho home with a private pool and views across Mission Bay, furnished with bold color and two living rooms.",
    },
    cardImg: '/assets/photos/homes/nute-pool.jpg',
    gallery: [
      '/assets/photos/homes/nute-pool.jpg',
      '/assets/photos/homes/nute-living.jpg',
      '/assets/photos/homes/nute-bedroom.jpg',
      '/assets/photos/homes/nute-dining.jpg',
    ],
    story: [
      "Nute sits on a hillside street in Bay Ho, with a private pool on a patio that looks out over Mission Bay.",
      "Cardo's design team furnished it with bold color: a navy sofa and patterned rug in the second living room, a primary suite with a king bed and a soaking tub, and a dining area set against the large windows.",
      "The home sleeps eight across three bedrooms and two bathrooms, a short drive from the beaches and Mission Bay Park.",
    ],
    stats: {
      annualRevenue: '$158,300',
      avgNight: '$412',
      overMarket: '+44%',
      totalInvested: '$49,300',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$27,600' },
      { label: 'Paint & handyman', amount: '$7,200' },
      { label: 'Art & styling', amount: '$4,900' },
      { label: 'Kitchen & bar kit', amount: '$4,800' },
      { label: 'White-linen setup', amount: '$2,600' },
      { label: 'Electronics & smart home', amount: '$2,200' },
    ],
    scopeTotal: '$49,300',
    contactTitle: "Like what Nute became? Let's talk about yours.",
  },
  {
    slug: 'twain',
    name: 'Twain',
    neighborhood: 'Allied Gardens',
    beds: '3 BR',
    date: 'November 2025',
    hook: "A remodeled three-bedroom in Allied Gardens with a hot tub on a west-facing deck.",
    seo: {
      title: 'Twain | Case Study | Cardo Vacation Rentals',
      description: "A remodeled three-bedroom in Allied Gardens with a hot tub on a west-facing deck.",
    },
    cardImg: '/assets/photos/homes/twain-hot-tub.jpg',
    gallery: [
      '/assets/photos/homes/twain-hot-tub.jpg',
      '/assets/photos/homes/twain-living.jpg',
      '/assets/photos/homes/twain-dining.jpg',
      '/assets/photos/homes/twain-deck.jpg',
    ],
    story: [
      "Twain is a newly remodeled three-bedroom home in Allied Gardens, about ten minutes from San Diego State University and fifteen from La Mesa Village.",
      "The home is furnished around an open layout: green sofas and a white brick fireplace in the living room, and a dining room set for six. The backyard deck has outdoor dining, a BBQ grill and a hot tub that faces the sunset.",
      "It sleeps six, with central air conditioning, dedicated parking and an in-unit washer and dryer.",
    ],
    stats: {
      annualRevenue: '$192,500',
      avgNight: '$512',
      overMarket: '+48%',
      totalInvested: '$66,400',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$36,400' },
      { label: 'Paint & handyman', amount: '$9,100' },
      { label: 'Art & styling', amount: '$6,800' },
      { label: 'Kitchen & bar kit', amount: '$5,900' },
      { label: 'Outdoor & patio', amount: '$5,200' },
      { label: 'White-linen setup', amount: '$3,000' },
    ],
    scopeTotal: '$66,400',
    contactTitle: "Like what Twain became? Let's talk about yours.",
  },
  {
    slug: 'sixth',
    name: 'Sixth',
    neighborhood: 'Bankers Hill',
    beds: '3 BR',
    date: 'July 2025',
    hook: "A new three-story townhome in Bankers Hill with a rooftop patio that looks toward Balboa Park.",
    seo: {
      title: 'Sixth | Case Study | Cardo Vacation Rentals',
      description: "A new three-story townhome in Bankers Hill with a rooftop patio that looks toward Balboa Park.",
    },
    cardImg: '/assets/photos/homes/sixth-living.jpg',
    gallery: [
      '/assets/photos/homes/sixth-living.jpg',
      '/assets/photos/homes/sixth-rooftop.jpg',
      '/assets/photos/homes/sixth-dining.jpg',
      '/assets/photos/homes/sixth-bedroom.jpg',
    ],
    story: [
      "Sixth is a newly built, three-story townhome on Sixth Avenue in Bankers Hill, within walking distance of Balboa Park and the neighborhood's restaurants and bars.",
      "Cardo furnished it for groups of up to six: a living room with a gray sofa and large abstract art, a dining table beside the kitchen, and three bedrooms across three and a half bathrooms.",
      "The rooftop patio has lounge seating and views toward Balboa Park, and the home includes a private garage space.",
    ],
    stats: {
      annualRevenue: '$128,400',
      avgNight: '$356',
      overMarket: '+39%',
      totalInvested: '$39,200',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$22,400' },
      { label: 'Paint & handyman', amount: '$5,600' },
      { label: 'Kitchen & bar kit', amount: '$4,100' },
      { label: 'Art & styling', amount: '$3,900' },
      { label: 'White-linen setup', amount: '$2,200' },
      { label: 'Accessories & extras', amount: '$1,000' },
    ],
    scopeTotal: '$39,200',
    contactTitle: "Like what Sixth became? Let's talk about yours.",
  },
  {
    slug: 'kane',
    name: 'Kane',
    neighborhood: 'Bay Ho',
    beds: '5 BR',
    date: 'August 2025',
    hook: "A five-bedroom Bay Ho home with a large pool and spa, set up to sleep sixteen.",
    seo: {
      title: 'Kane | Case Study | Cardo Vacation Rentals',
      description: "A five-bedroom Bay Ho home with a large pool and spa, set up to sleep sixteen.",
    },
    cardImg: '/assets/photos/homes/kane-pool.jpg',
    gallery: [
      '/assets/photos/homes/kane-pool.jpg',
      '/assets/photos/homes/kane-living.jpg',
      '/assets/photos/homes/kane-bedroom.jpg',
      '/assets/photos/homes/kane-backyard.jpg',
    ],
    story: [
      "Kane is a five-bedroom, four-bathroom home in Bay Ho, three minutes from Tecolote Canyon Natural Park and five from Mission Bay Park.",
      "Cardo furnished it for large groups: a living room with a fireplace and a long sectional, bedrooms with accent walls and original art, and a shuffleboard table indoors. The backyard has a large pool and spa, outdoor dining and a BBQ.",
      "It sleeps sixteen, which puts it among the larger short-term rentals in central San Diego.",
    ],
    stats: {
      annualRevenue: '$168,300',
      avgNight: '$447',
      overMarket: '+41%',
      totalInvested: '$55,800',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$30,800' },
      { label: 'Paint & handyman', amount: '$7,400' },
      { label: 'Game-room build-out', amount: '$6,200' },
      { label: 'Kitchen & bar kit', amount: '$4,600' },
      { label: 'Art & styling', amount: '$4,200' },
      { label: 'White-linen setup', amount: '$2,600' },
    ],
    scopeTotal: '$55,800',
    contactTitle: "Like what Kane became? Let's talk about yours.",
  },
  {
    slug: 'mt-ainsworth',
    name: 'Mt Ainsworth',
    neighborhood: 'Clairemont',
    beds: '5 BR',
    date: 'December 2023',
    hook: "A five-bedroom Clairemont home with a heated pool and spa, a game room and outdoor dining for twelve.",
    seo: {
      title: 'Mt Ainsworth | Case Study | Cardo Vacation Rentals',
      description: "A five-bedroom Clairemont home with a heated pool and spa, a game room and outdoor dining for twelve.",
    },
    cardImg: '/assets/photos/homes/ainsworth-pergola.jpg',
    gallery: [
      '/assets/photos/homes/ainsworth-pergola.jpg',
      '/assets/photos/portfolio/ainsworth-game-room.jpg',
      '/assets/photos/homes/ainsworth-pool-spa.jpg',
      '/assets/photos/homes/ainsworth-firepit.jpg',
    ],
    story: [
      "Mt Ainsworth is a five-bedroom home on Mount Ainsworth Avenue in Clairemont, set up for family reunions and group trips of up to fourteen guests.",
      "Cardo's design team built the home around entertaining: a game room with navy walls, a pool table, an arcade cabinet and a dart board, and a pergola over a twelve-seat outdoor dining table with patio heaters.",
      "The backyard also has a heated pool and spa, a gas fire pit and a nine-foot shuffleboard table. An upstairs bedroom includes a workstation with an adjustable-height desk.",
    ],
    stats: {
      annualRevenue: '$268,900',
      avgNight: '$694',
      overMarket: '+61%',
      totalInvested: '$90,100',
    },
    scope: [
      { label: 'Furniture & decor', amount: '$48,600' },
      { label: 'Paint & handyman', amount: '$11,200' },
      { label: 'Outdoor & pool styling', amount: '$10,200' },
      { label: 'Art & styling', amount: '$8,400' },
      { label: 'Kitchen & bar kit', amount: '$7,800' },
      { label: 'White-linen setup', amount: '$3,900' },
    ],
    scopeTotal: '$90,100',
    contactTitle: "Like what Mt Ainsworth became? Let's talk about yours.",
  },
];
