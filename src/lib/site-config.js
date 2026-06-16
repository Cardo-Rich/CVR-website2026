// =============================================================
// Central content + config for the Cardo marketing site.
// Keeping copy/data here makes it easy to edit and to migrate
// into Supabase later (the chosen CMS direction).
// =============================================================

export const SITE = {
  name: "Cardo Vacation Rentals",
  shortName: "Cardo",
  // TODO: confirm production domain (currently assumes cardorentals.com).
  url: "https://www.cardorentals.com",
  tagline: "Luxury short-term rental management in San Diego",
  description:
    "Cardo is San Diego's design-led vacation rental manager. We market like pros, account for every dollar, and never let your home slip. Get a free revenue estimate.",
  // No public email by request — owners reach us via forms or phone.
  // (sales@cardorentals.com is used server-side for lead notifications.)
  phone: "619-719-5282",
  phoneHref: "tel:+16197195282",
  city: "San Diego",
  region: "CA",
};

// Lead capture endpoint — live Supabase edge function (writes to public.leads
// and notifies sales@cardorentals.com via Resend once a key is configured).
export const LEADS_API = "https://yyfckfuzoutmdwconrnm.supabase.co/functions/v1/leads";

export const NAV = [
  { label: "For Owners", href: "/owners" },
  { label: "Results", href: "/#results" },
  { label: "Design", href: "/#design" },
  { label: "Book a Stay", href: "/#book" },
  { label: "Blog", href: "/blog" },
];

// Booking engine. The widget composes a URL with query variables
// (?checkin=&checkout=&guests=). Swap baseUrl for the real WanderOS
// booking/search URL once we have the engine; set demo:false to hide
// the "demo" note.
export const BOOKING = {
  baseUrl: "https://book.cardorentals.com/search",
  demo: true,
};

// Headline trust stats (placeholders — confirm real figures).
export const STATS = [
  { value: "+24%", label: "Avg. revenue over market" },
  { value: "4.9★", label: "Guest rating across stays" },
  { value: "< 60 min", label: "Maintenance response" },
  { value: "100%", label: "Transparent owner accounting" },
];

// Owner value pillars — the four differentiators the brand leads with.
export const PILLARS = [
  {
    key: "marketing",
    title: "Marketing pros, not order-takers",
    body:
      "Pro photography, copy that converts, and dynamic pricing across Airbnb, Vrbo, Booking.com and direct. We treat your calendar like the revenue asset it is.",
    icon: "spark",
  },
  {
    key: "accounting",
    title: "Transparent to the dollar",
    body:
      "Real-time owner dashboard, itemized monthly statements, and no mystery fees. You can see every booking, payout, and expense whenever you want.",
    icon: "ledger",
  },
  {
    key: "maintenance",
    title: "We never let the home slip",
    body:
      "Inspections after every stay, a vetted local vendor bench, and sub-hour response on urgent issues. Small things get fixed before guests — or you — ever notice.",
    icon: "shield",
  },
  {
    key: "design",
    title: "Design that earns more",
    body:
      "In-house styling and decor that photographs beautifully and commands higher nightly rates. Homes guests screenshot are homes that book out.",
    icon: "palette",
  },
];

// OODA-style results / case-study cards.
// NOTE: images are Unsplash placeholders — swap for Cardo's own photography.
export const CASE_STUDIES = [
  { home: "La Jolla Bluff Villa", neighborhood: "La Jolla", gross: "$214,800", lift: "+57% over market", beds: "4 BR", grad: ["#15324a", "#1f6f6b"], img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811" },
  { home: "Cardiff Surf House", neighborhood: "Encinitas", gross: "$168,300", lift: "+41% over market", beds: "3 BR", grad: ["#1b3a52", "#3a5d77"], img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9" },
  { home: "Del Mar Racetrack Retreat", neighborhood: "Del Mar", gross: "$192,500", lift: "+48% over market", beds: "4 BR", grad: ["#23344a", "#c19a5b"], img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c" },
  { home: "Mission Beach Boardwalk Flat", neighborhood: "Mission Beach", gross: "$141,900", lift: "+33% over market", beds: "2 BR", grad: ["#1a2c3e", "#2c6e6b"], img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688" },
];

// Decor / design showcase tiles. (Unsplash placeholders — swap for real photos.)
export const GALLERY = [
  { tag: "Coastal Primary Suite", meta: "Styling", grad: ["#1f3a52", "#2c6e6b"], span: 2, img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" },
  { tag: "Chef's Kitchen", meta: "Decor", grad: ["#23344a", "#c19a5b"], span: 1, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
  { tag: "Sunset Terrace", meta: "Outdoor", grad: ["#3a2c44", "#ed3c78"], span: 1, img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2" },
  { tag: "Reading Nook", meta: "Detail", grad: ["#15324a", "#1f6f6b"], span: 1, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb" },
  { tag: "Plunge Pool", meta: "Amenity", grad: ["#1b3a52", "#3a5d77"], span: 2, img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9" },
];

export const TESTIMONIALS = [
  {
    quote:
      "I switched from a national manager and my net was up double digits in the first quarter. The monthly statements are so clear I stopped second-guessing.",
    name: "Marcus T.",
    home: "Oceanfront condo, Pacific Beach",
  },
  {
    quote:
      "They restyled the whole house before launch and the photos are unreal. Booked 26 nights in the first month at a rate I didn't think was possible.",
    name: "Priya & Sam",
    home: "Hillside home, La Jolla",
  },
  {
    quote:
      "A pipe let go at 11pm. Someone was there within the hour and I found out after it was already fixed. That's the whole reason I sleep at night.",
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

// FAQ — also rendered as FAQ schema for SEO.
export const FAQS = [
  {
    q: "What does Cardo charge?",
    a: "We work on a straightforward management percentage of booking revenue — no setup fees and no charge until your home is earning. We'll quote it exactly in your free property analysis.",
  },
  {
    q: "How fast can my home go live?",
    a: "Most homes launch within 2–3 weeks: onboarding and permitting, professional styling and photography, listing build-out, and pricing setup before your first guest.",
  },
  {
    q: "Will I still control my calendar?",
    a: "Always. You can block owner stays anytime from your dashboard. It's your home — we just keep it performing when you're not using it.",
  },
  {
    q: "Do you handle San Diego STR permits and TOT?",
    a: "Yes. We manage STRO licensing, compliance reporting, and transient occupancy tax filings so your home stays fully compliant.",
  },
  {
    q: "How do I see my numbers?",
    a: "Through a real-time owner dashboard plus itemized monthly statements. Every booking, payout, and expense is visible whenever you want it.",
  },
];

export const HOW_IT_WORKS = [
  { step: "01", title: "Free revenue estimate", body: "Tell us about your home. We'll send a data-backed projection of what it can earn in your San Diego market — no obligation." },
  { step: "02", title: "We style & launch", body: "In-house design, professional photography, listing build, dynamic pricing, and permitting. We handle the heavy lifting end to end." },
  { step: "03", title: "You earn, hands-off", body: "Guests are cared for, the home is maintained, and you watch it all in a transparent dashboard with clear monthly payouts." },
];
