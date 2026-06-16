// =============================================================
// Central content + config for the Cardo marketing site.
// Copy is intentionally tight (luxury reads better lean); keyword
// depth lives on dedicated pages + the blog. Facts are real:
// founded 2013, 2,000+ 5-star reviews, in-house design & cleaning.
// =============================================================

export const SITE = {
  name: "Cardo Vacation Rentals",
  shortName: "Cardo",
  // Keep cardorentals.com — a 10-year-old domain's accumulated authority
  // is worth far more than a shorter name.
  url: "https://www.cardorentals.com",
  tagline: "Luxury short-term rental management in San Diego",
  description:
    "Cardo is San Diego's design-led vacation rental manager — a 5-star Superhost since 2013. Pro marketing, transparent accounting, in-house design, and care that never lets your home slip.",
  phone: "619-719-5282",
  phoneHref: "tel:+16197195282",
  city: "San Diego",
  region: "CA",
};

// Real company facts (used in copy + schema).
export const COMPANY = {
  founded: 2013,
  reviews: "2,000+",
  rating: "4.9",
  ratingCount: "2000",
};

// Live Supabase edge function (writes to public.leads, notifies
// sales@cardorentals.com via Resend once a key is configured).
export const LEADS_API = "https://yyfckfuzoutmdwconrnm.supabase.co/functions/v1/leads";

export const NAV = [
  { label: "For Owners", href: "/owners" },
  { label: "Design", href: "/design" },
  { label: "Results", href: "/#results" },
  { label: "Book a Stay", href: "/#book" },
  { label: "Blog", href: "/blog" },
];

// Booking engine. The widget composes ?checkin=&checkout=&guests=.
// Swap baseUrl for the real WanderOS URL; set demo:false to hide the note.
export const BOOKING = {
  baseUrl: "https://book.cardorentals.com/search",
  demo: true,
};

// Distribution channels (from the established Cardo network).
export const CHANNELS = ["Airbnb", "Vrbo", "Booking.com", "Google Vacation Rentals", "Hopper", "Direct"];

// Headline trust stats — all defensible facts.
export const STATS = [
  { value: "2,000+", label: "5-star guest reviews" },
  { value: "Since 2013", label: "San Diego Superhost" },
  { value: "24/7", label: "Guest support" },
  { value: "In-house", label: "Design & cleaning" },
];

// Owner value pillars — the four differentiators, kept to one line each.
export const PILLARS = [
  {
    key: "marketing",
    title: "Marketing pros",
    body: "Pro photography, sharp listings, and dynamic pricing across every channel — your calendar run like the asset it is.",
    icon: "spark",
  },
  {
    key: "accounting",
    title: "Transparent accounting",
    body: "A real-time dashboard and itemized monthly statements. Every dollar visible, no mystery fees.",
    icon: "ledger",
  },
  {
    key: "maintenance",
    title: "Care that never slips",
    body: "Inspected after every stay, vetted local vendors, sub-hour urgent response. Fixed before anyone notices.",
    icon: "shield",
  },
  {
    key: "design",
    title: "In-house design",
    body: "Home Designs by Cardo styles your home to photograph beautifully and command higher nightly rates.",
    icon: "palette",
  },
];

// OODA-style results / case studies.
// NOTE: numbers are illustrative; real case study to follow. Images are
// Unsplash placeholders — swap for Cardo's own photography.
export const CASE_STUDIES = [
  { home: "La Jolla Bluff Villa", neighborhood: "La Jolla", gross: "$214,800", lift: "+57% over market", beds: "4 BR", grad: ["#15324a", "#1f6f6b"], img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811" },
  { home: "Cardiff Surf House", neighborhood: "Encinitas", gross: "$168,300", lift: "+41% over market", beds: "3 BR", grad: ["#1b3a52", "#3a5d77"], img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9" },
  { home: "Del Mar Retreat", neighborhood: "Del Mar", gross: "$192,500", lift: "+48% over market", beds: "4 BR", grad: ["#23344a", "#c19a5b"], img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c" },
  { home: "Mission Beach Flat", neighborhood: "Mission Beach", gross: "$141,900", lift: "+33% over market", beds: "2 BR", grad: ["#1a2c3e", "#2c6e6b"], img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688" },
];

// Decor / design showcase tiles. (Unsplash placeholders — swap for the
// Home Designs by Cardo portfolio photos.)
export const GALLERY = [
  { tag: "Coastal Primary Suite", meta: "Styling", grad: ["#1f3a52", "#2c6e6b"], span: 2, img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" },
  { tag: "Chef's Kitchen", meta: "Decor", grad: ["#23344a", "#c19a5b"], span: 1, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
  { tag: "Sunset Terrace", meta: "Outdoor", grad: ["#3a2c44", "#ed3c78"], span: 1, img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2" },
  { tag: "Reading Nook", meta: "Detail", grad: ["#15324a", "#1f6f6b"], span: 1, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb" },
  { tag: "Plunge Pool", meta: "Amenity", grad: ["#1b3a52", "#3a5d77"], span: 2, img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9" },
];

export const TESTIMONIALS = [
  {
    quote: "Switched from a national manager and my net was up double digits in the first quarter. The statements are so clear I stopped second-guessing.",
    name: "Marcus T.",
    home: "Oceanfront condo, Pacific Beach",
  },
  {
    quote: "Their design team restyled the whole house before launch and the photos are unreal. Booked 26 nights the first month at a rate I didn't think was possible.",
    name: "Priya & Sam",
    home: "Hillside home, La Jolla",
  },
  {
    quote: "A pipe let go at 11pm. Someone was there within the hour and I found out after it was fixed. That's why I sleep at night.",
    name: "Diane R.",
    home: "Beach cottage, Encinitas",
  },
];

// Markets we build local SEO / landing pages around.
export const NEIGHBORHOODS = [
  { name: "La Jolla", note: "Bluff-top luxury & coastal estates", slug: "la-jolla" },
  { name: "Pacific Beach", note: "Walkable, high-occupancy favorites", slug: "pacific-beach" },
  { name: "Mission Beach", note: "Boardwalk & bayfront classics", slug: "mission-beach" },
  { name: "Del Mar", note: "Racetrack-season premium homes", slug: "del-mar" },
  { name: "Encinitas", note: "Surf-town charm, strong year-round", slug: "encinitas" },
  { name: "Carlsbad", note: "Family coastal & North County demand", slug: "carlsbad" },
  { name: "Coronado", note: "Island prestige & event demand", slug: "coronado" },
  { name: "Greater San Diego", note: "Countywide coverage & support", slug: "san-diego" },
];

// FAQ — also rendered as FAQ schema.
export const FAQS = [
  { q: "What does Cardo charge?", a: "A straightforward management percentage of booking revenue — no setup fees, no charge until your home is earning. We quote it exactly in your free property analysis." },
  { q: "How fast can my home go live?", a: "Most homes launch within a few weeks: onboarding and permitting, in-house design and photography, listing build-out, and pricing setup before your first guest." },
  { q: "Will I still control my calendar?", a: "Always. Block owner stays anytime from your dashboard. It's your home — we keep it performing when you're not using it." },
  { q: "Do you handle San Diego STR permits and TOT?", a: "Yes — STRO licensing, compliance reporting, and transient occupancy tax filings so your home stays fully compliant." },
  { q: "How do I see my numbers?", a: "A real-time owner dashboard plus itemized monthly statements. Every booking, payout, and expense, whenever you want it." },
];

export const HOW_IT_WORKS = [
  { step: "01", title: "Free revenue estimate", body: "Send your home's details. We return a data-backed projection for your San Diego market — no obligation." },
  { step: "02", title: "We design & launch", body: "Home Designs by Cardo furnishes and stages; we shoot, list, and price it to win." },
  { step: "03", title: "You earn, hands-off", body: "Guests cared for, home maintained, everything visible in your owner dashboard." },
];

// ---- Home Designs by Cardo (design service page) ----
export const DESIGN_PROCESS = [
  { step: "01", title: "Photo review", body: "Send photos of your home — a listing link or quick phone pics. We return a furnishing estimate and decorator's fee." },
  { step: "02", title: "Sign & schedule", body: "Approve your management and decorating agreements, then we book a two-hour preparation walkthrough." },
  { step: "03", title: "Prep walkthrough", body: "We note maintenance fixes, deep-clean needs, and junk removal, and line up trusted local vendors to handle them." },
  { step: "04", title: "Decorate & stage", body: "Paint, furniture, kitchen, decor, and electronics — built, styled, and staged for the photographer. Typically 2–4 weeks." },
];

export const DESIGN_SCOPE = [
  "Select the design style for your property",
  "Source, purchase & ship furniture and decor",
  "Build furniture and set up electronics",
  "Stock kitchenware and organize cabinets",
  "Hang art and style every room",
  "Coordinate and schedule contracted trades",
  "Keep receipts and accurate accounting",
  "Stage the home for professional photography",
];
