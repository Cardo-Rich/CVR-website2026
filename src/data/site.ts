// =============================================================
// Cardo Vacation Rentals — site content
// Copy and figures ported verbatim from the design-system UI kit.
// Property/neighborhood imagery uses Unsplash placeholders (matching
// the live site's site-config.js). Swap for Cardo's own photography.
// =============================================================

export const company = {
  name: 'Cardo Vacation Rentals',
  domain: 'cardorentals.com',
  phone: '619-719-5282',
  phoneHref: '+16197195282',
  tagline: 'Luxury short-term rental management in San Diego.',
};

export const nav = ['For Owners', 'Design', 'Neighborhoods', 'Blog'];

export const stats = [
  { value: '2,000+', label: '5-star guest reviews' },
  { value: 'Since 2013', label: 'San Diego Superhost' },
  { value: '24/7', label: 'Guest support' },
  { value: 'In-house', label: 'Design & cleaning' },
];

export const pillars = [
  {
    title: 'Marketing pros',
    body: 'Pro photography, sharp listings, and dynamic pricing across every channel — your calendar run like the asset it is.',
    icon: 'M5 13l4 4L19 7',
  },
  {
    title: 'Transparent accounting',
    body: 'A real-time dashboard and itemized monthly statements. Every dollar visible, no mystery fees.',
    icon: 'M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3',
  },
  {
    title: 'Care that never slips',
    body: 'Inspected after every stay, vetted local vendors, sub-hour urgent response. Fixed before anyone notices.',
    icon: 'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z',
  },
  {
    title: 'In-house design',
    body: 'Home Designs by Cardo styles your home to photograph beautifully and command higher nightly rates.',
    icon: 'M3 21l3-9 9-9 6 6-9 9-9 3z',
  },
];

export const cases = [
  {
    home: 'La Jolla Bluff Villa',
    neighborhood: 'La Jolla',
    gross: '$214,800',
    lift: '+57% over market',
    beds: '4 BR',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
  },
  {
    home: 'Cardiff Surf House',
    neighborhood: 'Encinitas',
    gross: '$168,300',
    lift: '+41% over market',
    beds: '3 BR',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  },
  {
    home: 'Del Mar Retreat',
    neighborhood: 'Del Mar',
    gross: '$192,500',
    lift: '+48% over market',
    beds: '4 BR',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
  },
];

export const neighborhoods = [
  { name: 'La Jolla', note: 'Bluff-top luxury & coastal estates', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811' },
  { name: 'Pacific Beach', note: 'Walkable, high-occupancy favorites', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9' },
  { name: 'Del Mar', note: 'Racetrack-season premium homes', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c' },
  { name: 'Encinitas', note: 'Surf-town charm, strong year-round', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85' },
  { name: 'Coronado', note: 'Island prestige & event demand', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750' },
  { name: 'Carlsbad', note: 'Family coastal & North County demand', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9' },
];

export const faqs = [
  {
    q: 'What does Cardo charge?',
    a: 'A straightforward management percentage of booking revenue — no setup fees, no charge until your home is earning. We quote it exactly in your free property analysis.',
  },
  {
    q: 'How fast can my home go live?',
    a: 'Most homes launch within a few weeks: onboarding and permitting, in-house design and photography, listing build-out, and pricing setup before your first guest.',
  },
  {
    q: 'Will I still control my calendar?',
    a: "Always. Block owner stays anytime from your dashboard. It's your home — we keep it performing when you're not using it.",
  },
  {
    q: 'Do you handle San Diego STR permits and TOT?',
    a: 'Yes — STRO licensing, compliance reporting, and transient occupancy tax filings so your home stays fully compliant.',
  },
  {
    q: 'How do I see my numbers?',
    a: 'A real-time owner dashboard plus itemized monthly statements. Every booking, payout, and expense, whenever you want it.',
  },
];

export const testimonials = [
  {
    quote:
      'Switched from a national manager and my net was up double digits in the first quarter. The statements are so clear I stopped second-guessing.',
    name: 'Marcus T.',
    home: 'Oceanfront condo, Pacific Beach',
  },
  {
    quote:
      "Their design team restyled the whole house before launch and the photos are unreal. Booked 26 nights the first month at a rate I didn't think was possible.",
    name: 'Priya & Sam',
    home: 'Hillside home, La Jolla',
  },
  {
    quote:
      "A pipe let go at 11pm. Someone was there within the hour and I found out after it was fixed. That's why I sleep at night.",
    name: 'Diane R.',
    home: 'Beach cottage, Encinitas',
  },
];

export const footerCols = [
  { h: 'Company', links: ['For Owners', 'Home Designs by Cardo', 'Neighborhoods', 'Blog'] },
  { h: 'Markets', links: ['La Jolla', 'Pacific Beach', 'Del Mar', 'Encinitas', 'Coronado'] },
  { h: 'Guests', links: ['Book a Stay', 'Guest support', 'Areas we serve'] },
];

export const leadNeighborhoods = [
  'La Jolla',
  'Pacific Beach',
  'Mission Beach',
  'Del Mar',
  'Encinitas',
  'Carlsbad',
  'Coronado',
  'Other San Diego',
];
