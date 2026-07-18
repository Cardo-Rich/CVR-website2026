// =============================================================
// Cardo V3 — Blog data model (CMS-ready).
// Content extracted from design_handoff_v3_site/design-reference/blog.html
// (index cards) and blog-article.html (the one fully-authored reference
// article). A future CMS will populate this `articles[]` array; every field
// here is plain data — including the article body, stored as an HTML
// string (`bodyHtml`) — so the rendering template stays decoupled from
// content. The six non-featured entries carry brief, clearly-generic
// placeholder bodies until the CMS supplies real copy.
// =============================================================

export interface CaseStudyMeta {
  name: string;     // short home name for the card/popup (e.g. "Falcon")
  hood: string;     // neighborhood label (card + popup eyebrow)
  beds: string;     // e.g. "4 BR"
  revenue: string;  // e.g. "$214,800"
  nightly: string;  // e.g. "$589 / night"
  lift: string;     // e.g. "+57% over market"
  gallery?: string[]; // extra thumbnails for the owners preview popup
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  dateFull: string;
  dateShort: string;
  img: string;
  featured?: boolean;
  seo: {
    title: string;
    description: string;
  };
  author: {
    name: string;
    initials: string;
  };
  heroCaption: string;
  bodyHtml: string;
  // Blog posts are the single source of truth. A post always shows in its blog
  // category; these toggles additionally surface it as a card elsewhere.
  localTip?: string;      // "Explore like a local" card tip line (home page)
  showOnHome?: boolean;   // surface as an Explore-like-a-local card on the home page
  showOnOwners?: boolean; // surface as a case-study card on the owners page
  caseStudy?: CaseStudyMeta;
}

export const categories = ['All', 'Revenue', 'Design', 'Compliance', 'Neighborhoods', 'Operations', 'Case studies', 'Explore like a local'];

export const articles: Article[] = [
  {
    slug: 'what-your-san-diego-home-could-earn-2026',
    title: 'What your San Diego home could actually earn in 2026',
    category: 'Revenue',
    excerpt:
      "Occupancy is only half the story. Here's how nightly rate, seasonality, and design quality combine into the number that lands on your statement — and the levers that move it most.",
    readTime: '8 min read',
    dateFull: 'June 18, 2026',
    dateShort: 'Jun 2026',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1100&q=80',
    featured: true,
    seo: {
      title: 'What your San Diego home could actually earn in 2026 — The Cardo Journal',
      description:
        'Occupancy is only half the story. How nightly rate, seasonality, and design quality combine into what lands on your statement.',
    },
    author: {
      name: 'Cardo Revenue Team',
      initials: 'CV',
    },
    heroCaption:
      'A La Jolla bluff home — the kind of inventory where rate, not occupancy, decides the year.',
    bodyHtml: `<p class="lede">Ask most owners what their home earns and they'll quote occupancy. But a home booked 300 nights at the wrong rate loses to one booked 220 nights at the right one. The number that matters is what lands on your statement — and it's built from more than how full the calendar looks.</p>

        <p>San Diego's short-term rental market in 2026 rewards homes that are priced dynamically, positioned for the right guest, and finished well enough to defend a premium. Below is how we think about the three inputs that decide your annual gross — and where the easy money actually hides.</p>

        <h2>1. Rate beats occupancy, almost always</h2>
        <p>It's tempting to chase a full calendar. Full feels safe. But pushing occupancy usually means discounting into low-demand windows where every dollar of revenue costs you a turnover, a cleaning, and a little more wear on the home. The math rarely favors it.</p>
        <p>Dynamic pricing — adjusting nightly rate daily against real demand signals — captures the high-value nights you'd otherwise underprice and protects you from racing competitors to the bottom in the slow ones. On most San Diego homes, the gap between static and dynamic pricing is the single biggest lever on the year.</p>

        <blockquote>A home booked 300 nights at the wrong rate loses to one booked 220 nights at the right one.</blockquote>

        <h2>2. Seasonality is a calendar, not a guess</h2>
        <p>San Diego demand isn't flat, and it isn't random. It clusters around predictable windows, and the homes that earn most are the ones priced to meet them before they arrive:</p>
        <ul>
          <li>Summer coastal peak — June through Labor Day, when beach-adjacent homes command their highest rates of the year.</li>
          <li>Event-driven spikes — Del Mar's racing season, conventions, and holiday weekends that move rate independent of the season.</li>
          <li>Shoulder strength — spring and fall in San Diego stay warmer and busier than most markets, if the home is positioned for it.</li>
          <li>Winter mid-term demand — 30-plus-night stays that smooth out the slowest weeks at a steady, lower-effort rate.</li>
        </ul>

        <div class="callout">
          <p class="eyebrow">The Cardo view</p>
          <p>We price each home against its own demand curve, not a city average. Two homes a mile apart can have completely different best-case calendars — and pricing them the same leaves money on both.</p>
        </div>

        <h2>3. Design is a pricing input, not decoration</h2>
        <p>Guests book the photos and rate the experience. A home styled to photograph beautifully and to hold up under a busy season earns a higher nightly rate and better reviews — and reviews compound into ranking, which compounds back into rate. It's the quietest flywheel in the business.</p>
        <p>This is why our design team works in-house: the finish that wins the booking has to survive the year of stays that follows. Decorative choices that look good empty but fail in week three don't make the cut. <a href="/home-designs" class="inline">Home Designs by Cardo</a> exists to close exactly that gap.</p>

        <h2>So what's the number?</h2>
        <p>There isn't one honest answer that fits every home — and any manager who quotes you a figure sight-unseen is guessing. Your projection comes from your home's location, size, layout, and finish, run against current San Diego demand. That's the analysis we build for free, usually within a business day, before you ever sign anything.</p>
        <p>The owners who do best aren't the ones with the most nights booked. They're the ones who priced for the right nights, positioned for the right guest, and put their home in a position to be worth more. That's the whole job — and it's the one we'd like to do for yours.</p>`,
  },
  {
    slug: 'five-design-choices-that-lift-your-nightly-rate',
    title: 'Five design choices that lift your nightly rate',
    category: 'Design',
    excerpt:
      'Small, durable upgrades that photograph well and pay for themselves within a season.',
    readTime: '6 min',
    dateFull: 'May 12, 2026',
    dateShort: 'May 2026',
    img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    seo: {
      title: 'Five design choices that lift your nightly rate — The Cardo Journal',
      description:
        'Small, durable design upgrades that photograph well and pay for themselves within a season.',
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: 'A styled living space designed to photograph well and hold up to daily turnovers.',
    bodyHtml: `<p class="lede">Guests book the photos before they ever see the house. The homes that command a premium rate share a handful of design choices in common — and none of them require a full renovation.</p>

        <p>Good short-term rental design isn't about trend-chasing. It's about a small set of durable, photogenic choices that read well online and survive real guest traffic week after week.</p>

        <h2>Where the return actually shows up</h2>
        <p>Layered lighting, a considered color palette, statement furniture in the main living space, and outdoor areas styled as seriously as the interior are consistently the upgrades that move both booking rate and guest reviews. The common thread is durability — finishes that still look sharp after a busy season of turnovers.</p>
        <p>We'll be expanding this into a full walkthrough of our design process, with before-and-after examples from homes we've styled across San Diego.</p>`,
  },
  {
    slug: 'stro-permits-tot-and-staying-compliant-in-san-diego',
    title: 'STRO permits, TOT, and staying compliant in San Diego',
    category: 'Compliance',
    excerpt:
      'A plain-English walkthrough of licensing, occupancy tax, and the deadlines that matter.',
    readTime: '7 min',
    dateFull: 'April 22, 2026',
    dateShort: 'Apr 2026',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    seo: {
      title: 'STRO permits, TOT, and staying compliant in San Diego — The Cardo Journal',
      description:
        'A plain-English walkthrough of San Diego short-term rental licensing, occupancy tax, and the deadlines that matter.',
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: "San Diego's short-term rental rules exist to protect neighborhoods and owners alike.",
    bodyHtml: `<p class="lede">Compliance isn't the exciting part of owning a short-term rental — until it's the thing that shuts your calendar down. Here's the plain-English version of what San Diego actually requires.</p>

        <p>Every legally operating short-term rental in the city needs a valid STRO license, and every booking is subject to Transient Occupancy Tax. Missing a renewal date or a filing deadline can mean real downtime, which is real income lost.</p>

        <h2>What we handle for owners</h2>
        <p>Cardo manages licensing renewals, TOT filings, and the paperwork trail around both, so owners aren't tracking deadlines on their own. We'll be publishing a more complete guide to the current requirements and timelines soon.</p>`,
  },
  {
    slug: 'la-jolla-vs-pacific-beach-which-performs-better',
    title: 'La Jolla vs. Pacific Beach: which performs better?',
    category: 'Neighborhoods',
    excerpt:
      'Two very different demand curves — and what each means for the right kind of home.',
    readTime: '5 min',
    dateFull: 'March 30, 2026',
    dateShort: 'Mar 2026',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    seo: {
      title: 'La Jolla vs. Pacific Beach: which performs better? — The Cardo Journal',
      description:
        'Two very different San Diego demand curves — and what each means for choosing and pricing the right home.',
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: "Coronado's shoreline — one of several San Diego micro-markets with its own demand curve.",
    bodyHtml: `<p class="lede">La Jolla and Pacific Beach sit minutes apart on a map and worlds apart in booking behavior. Knowing which curve a home fits is half the pricing strategy.</p>

        <p>La Jolla skews toward higher nightly rates, longer average stays, and a guest who prioritizes quiet and finish quality. Pacific Beach trades some rate ceiling for higher turnover and a livelier, younger guest base that fills the calendar differently.</p>

        <h2>Why the distinction matters</h2>
        <p>Neither market is "better" in the abstract — the right answer depends on the home itself, its layout, and what kind of stay it's built for. We'll follow up with a deeper look at how we match a property to its market.</p>`,
  },
  {
    slug: 'the-real-cost-of-mystery-fees',
    title: 'The real cost of mystery fees',
    category: 'Accounting',
    excerpt:
      "How to read a management statement — and the line items that quietly eat your net.",
    readTime: '6 min',
    dateFull: 'March 9, 2026',
    dateShort: 'Mar 2026',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    seo: {
      title: 'The real cost of mystery fees — The Cardo Journal',
      description:
        "How to read a short-term rental management statement — and the line items that quietly eat your net income.",
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: "A clear, itemized statement is the easiest way to tell what a management fee is actually buying.",
    bodyHtml: `<p class="lede">A management fee is easy to compare. What's harder to compare is everything added back in afterward — and that's usually where the real cost of a partnership lives.</p>

        <p>Owners often discover the true cost of management only after reading a full season of statements line by line: cleaning markups, "convenience" charges, and vague line items that never quite get explained.</p>

        <h2>What a clean statement looks like</h2>
        <p>We believe owners should be able to read their statement in five minutes and understand every dollar on it. A future post will walk through a real, anonymized Cardo statement line by line.</p>`,
  },
  {
    slug: 'turnovers-that-protect-five-star-reviews',
    title: 'Turnovers that protect five-star reviews',
    category: 'Operations',
    excerpt:
      "The inspection checklist behind a spotless home — and why it never gets skipped.",
    readTime: '5 min',
    dateFull: 'March 2, 2026',
    dateShort: 'Mar 2026',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    seo: {
      title: 'Turnovers that protect five-star reviews — The Cardo Journal',
      description:
        "The inspection checklist behind a spotless short-term rental turnover — and why it never gets skipped.",
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: "A turnover in progress — the unglamorous work behind every five-star review.",
    bodyHtml: `<p class="lede">Guests never see the turnover. They only see whether it worked — a spotless kitchen, fresh linens, and a home that feels untouched by the guest before them.</p>

        <p>A five-star review is really a verdict on the two hours between checkout and check-in, when a full inspection checklist gets run against every room, every appliance, and every consumable before the next guest ever arrives.</p>

        <h2>Why the checklist never gets shortened</h2>
        <p>It's tempting to trim the process on a tight same-day turn, but the reviews that slip are almost always traced back to a step that got skipped under time pressure. We'll be publishing our full turnover standard in a future post.</p>`,
  },
  {
    slug: 'why-del-mars-racing-season-changes-your-pricing',
    title: "Why Del Mar's racing season changes your pricing",
    category: 'Revenue',
    excerpt: 'Event-driven demand windows and how dynamic pricing captures them.',
    readTime: '4 min',
    dateFull: 'February 14, 2026',
    dateShort: 'Feb 2026',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    seo: {
      title: "Why Del Mar's racing season changes your pricing — The Cardo Journal",
      description:
        "How Del Mar's racing season and other event-driven demand windows change short-term rental pricing in San Diego.",
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: 'Del Mar in summer — a short, sharp demand window that rewards pricing ahead of the calendar.',
    bodyHtml: `<p class="lede">Del Mar's racing season compresses weeks of demand into a handful of dates. Homes priced for an ordinary summer week leave real money on the table when the track opens.</p>

        <p>Event-driven windows like this behave nothing like the surrounding season — demand spikes fast, books early, and rewards owners whose pricing moves ahead of the calendar rather than reacting to it.</p>

        <h2>Pricing for the spike, not the average</h2>
        <p>Treating an event week like a normal week is one of the most common ways San Diego owners underprice their year. We'll follow this piece with a closer look at the other event windows that move San Diego demand.</p>`,
  },

  // ===================== DESIGN CASE STUDIES (owners page) =====================
  // These posts carry a `caseStudy` block and `showOnOwners: true`, so the owners
  // "Case studies" grid + preview popup render from them and link to the full
  // article at /blog/[slug].
  {
    slug: 'falcon-la-jolla-case-study',
    title: 'Falcon: an inherited La Jolla bluff home, relaunched in five weeks',
    category: 'Case studies',
    excerpt: 'An inherited bluff home, dated and half-furnished, fully reimagined and launched in five weeks.',
    readTime: '4 min',
    dateFull: 'June 24, 2026',
    dateShort: 'Jun 2026',
    img: '/assets/photos/designs-living-craftsman.jpg',
    showOnOwners: true,
    caseStudy: {
      name: 'Falcon', hood: 'La Jolla', beds: '4 BR', revenue: '$214,800', nightly: '$589 / night', lift: '+57% over market',
      gallery: ['/assets/photos/designs-living-craftsman.jpg', '/assets/photos/designs-living-fireplace.jpg', '/assets/photos/designs-dining.jpg', '/assets/photos/designs-bedroom-fan.jpg'],
    },
    seo: {
      title: 'Falcon — Design case study — Cardo Vacation Rentals',
      description: 'An inherited La Jolla bluff home, fully reimagined and launched in five weeks — now 57% above its market.',
    },
    author: { name: 'Cardo Design Team', initials: 'CV' },
    heroCaption: 'Falcon, La Jolla — cleared, repainted, and fully restyled in five weeks.',
    bodyHtml: `<p class="lede">Falcon came to us inherited and frozen in time — good bones and an unbeatable bluff location, buried under decades of mismatched furniture.</p>
        <p>The owner lived out of state and had neither the time nor the appetite to manage a renovation from afar, so they approved our plan and stepped back entirely.</p>
        <p>Our design team cleared the home, repainted throughout, and furnished every room to make the most of the light and the view. We sourced and shipped the furniture, hung the art, stocked the kitchen, and staged it for the photographer — start to finish on a single invoice.</p>
        <p>Five weeks later Falcon launched fully styled and photographed, and settled into the top tier of its La Jolla market at 57% above comparable homes.</p>
        <div class="callout"><p class="eyebrow">The project</p><p>$78,400 all-in — furniture &amp; decor, paint &amp; handyman, art &amp; styling, outdoor, kitchen kit, photography, and white-linen setup — recovered by a nightly rate 57% over market.</p></div>`,
  },
  {
    slug: 'nute-pacific-beach-case-study',
    title: 'Nute: a tired Pacific Beach walk-street rental, booked solid in a month',
    category: 'Case studies',
    excerpt: 'A tired walk-street rental turned light, bright, and fully booked within its first month.',
    readTime: '4 min',
    dateFull: 'May 20, 2026',
    dateShort: 'May 2026',
    img: '/assets/photos/designs-living-bright.jpg',
    showOnOwners: true,
    caseStudy: {
      name: 'Nute', hood: 'Pacific Beach', beds: '3 BR', revenue: '$158,300', nightly: '$412 / night', lift: '+44% over market',
      gallery: ['/assets/photos/designs-living-bright.jpg', '/assets/photos/designs-bedroom-floral.jpg', '/assets/photos/designs-dining.jpg', '/assets/photos/designs-amenities.jpg'],
    },
    seo: {
      title: 'Nute — Design case study — Cardo Vacation Rentals',
      description: 'A tired Pacific Beach walk-street rental turned light, bright, and fully booked within its first month.',
    },
    author: { name: 'Cardo Design Team', initials: 'CV' },
    heroCaption: 'Nute, Pacific Beach — from drab long-term rental to coastal-bright short stay.',
    bodyHtml: `<p class="lede">Nute had been a long-term rental for years — functional, dim, and forgettable.</p>
        <p>The owner wanted to move it to short-term but had been quoted long timelines and bigger budgets elsewhere, and had no interest in project-managing the work.</p>
        <p>We took it from drab to coastal-bright: a lighter palette, smarter furniture for the walk-street layout, and styling that made the small footprint feel generous. After one approval call, the owner left the rest to us.</p>
        <p>It photographed beautifully, booked solid in its first month, and now runs 44% ahead of its Pacific Beach market.</p>
        <div class="callout"><p class="eyebrow">The project</p><p>$52,100 all-in, recovered by a nightly rate 44% over market and a calendar that filled in weeks.</p></div>`,
  },
  {
    slug: 'twain-del-mar-case-study',
    title: 'Twain: a Del Mar craftsman styled to own racing season',
    category: 'Case studies',
    excerpt: "A craftsman classic styled to own Del Mar's racing season — and hold strong the rest of the year.",
    readTime: '4 min',
    dateFull: 'May 8, 2026',
    dateShort: 'May 2026',
    img: '/assets/photos/designs-dining.jpg',
    showOnOwners: true,
    caseStudy: {
      name: 'Twain', hood: 'Del Mar', beds: '4 BR', revenue: '$192,500', nightly: '$512 / night', lift: '+48% over market',
      gallery: ['/assets/photos/designs-dining.jpg', '/assets/photos/designs-living-craftsman.jpg', '/assets/photos/designs-living-fireplace.jpg', '/assets/photos/designs-bedroom-fan.jpg'],
    },
    seo: {
      title: 'Twain — Design case study — Cardo Vacation Rentals',
      description: "A Del Mar craftsman styled to own racing season and hold strong all year — 48% above its market.",
    },
    author: { name: 'Cardo Design Team', initials: 'CV' },
    heroCaption: 'Twain, Del Mar — designed around the architecture, not over it.',
    bodyHtml: `<p class="lede">Twain is a true craftsman — wood detailing, built-ins, character in every room.</p>
        <p>The owner loved the house but had no interest in furnishing it for short-term guests, and worried a generic staging would flatten everything that made it special.</p>
        <p>Our team designed around the architecture instead of over it: warm, layered furnishings that read editorial in photos and live comfortably for a full house. The owner trusted us with every detail, start to finish.</p>
        <p>Twain now commands Del Mar's racing-season premium and runs 48% above its market across the year.</p>
        <div class="callout"><p class="eyebrow">The project</p><p>$69,800 all-in, recovered by a nightly rate 48% over market and a racing-season premium the home now owns.</p></div>`,
  },
  {
    slug: 'sixth-mission-beach-case-study',
    title: 'Sixth: a compact Mission Beach two-bedroom that punches above its size',
    category: 'Case studies',
    excerpt: 'A compact two-bedroom that punches well above its size — and its nightly comps.',
    readTime: '4 min',
    dateFull: 'April 28, 2026',
    dateShort: 'Apr 2026',
    img: '/assets/photos/designs-bedroom-floral.jpg',
    showOnOwners: true,
    caseStudy: {
      name: 'Sixth', hood: 'Mission Beach', beds: '2 BR', revenue: '$128,400', nightly: '$356 / night', lift: '+39% over market',
      gallery: ['/assets/photos/designs-bedroom-floral.jpg', '/assets/photos/designs-living-bright.jpg', '/assets/photos/designs-amenities.jpg', '/assets/photos/designs-bedroom-fan.jpg'],
    },
    seo: {
      title: 'Sixth — Design case study — Cardo Vacation Rentals',
      description: 'A compact Mission Beach two-bedroom designed to punch well above its size — 39% above its market.',
    },
    author: { name: 'Cardo Design Team', initials: 'CV' },
    heroCaption: 'Sixth, Mission Beach — every inch designed to work twice as hard.',
    bodyHtml: `<p class="lede">Small homes are the hardest to make special, and Sixth is small — a two-bedroom a block from the sand.</p>
        <p>The owner assumed its size capped what it could earn, and had nearly listed it long-term to avoid the hassle.</p>
        <p>We designed every inch to work twice as hard: dual-purpose furniture, a bright cohesive palette, and styling that photographs larger than the footprint. The owner handed it over and let the team run.</p>
        <p>Guests book it for the location and rate it for the comfort — and it now runs 39% above its Mission Beach market.</p>
        <div class="callout"><p class="eyebrow">The project</p><p>$41,600 all-in — proof that footprint doesn't cap what a well-designed home earns.</p></div>`,
  },
  {
    slug: 'kane-encinitas-case-study',
    title: 'Kane: an Encinitas surf home with a game room guests book it for',
    category: 'Case studies',
    excerpt: 'A surf-town home with a game room guests now book it specifically for.',
    readTime: '4 min',
    dateFull: 'April 14, 2026',
    dateShort: 'Apr 2026',
    img: '/assets/photos/designs-gameroom.jpg',
    showOnOwners: true,
    caseStudy: {
      name: 'Kane', hood: 'Encinitas', beds: '3 BR', revenue: '$168,300', nightly: '$447 / night', lift: '+41% over market',
      gallery: ['/assets/photos/designs-gameroom.jpg', '/assets/photos/designs-living-fireplace.jpg', '/assets/photos/designs-bedroom-fan.jpg', '/assets/photos/designs-amenities.jpg'],
    },
    seo: {
      title: 'Kane — Design case study — Cardo Vacation Rentals',
      description: 'An Encinitas surf home with a moody navy game room guests search for — 41% above its market.',
    },
    author: { name: 'Cardo Design Team', initials: 'CV' },
    heroCaption: 'Kane, Encinitas — a bonus room turned into the listing\'s signature feature.',
    bodyHtml: `<p class="lede">Kane had an underused bonus room and an owner with a full-time job two time zones away.</p>
        <p>They knew the space could be a differentiator but had no bandwidth to figure out how — and no desire to coordinate vendors remotely.</p>
        <p>We turned the bonus room into a moody navy game room that anchors the whole listing, then styled the rest of the home to match the energy. The owner approved a moodboard remotely and stayed out of the rest.</p>
        <p>It has become the feature guests search for, lifting both bookings and rate to 41% above its Encinitas market.</p>
        <div class="callout"><p class="eyebrow">The project</p><p>$58,200 all-in, including a game-room build-out that became the home's most-searched feature.</p></div>`,
  },
  {
    slug: 'mt-ainsworth-coronado-case-study',
    title: 'Mt Ainsworth: a Coronado estate finished for the top of its market',
    category: 'Case studies',
    excerpt: 'A five-bedroom estate with a resort backyard, finished to sit at the top of its market.',
    readTime: '4 min',
    dateFull: 'March 26, 2026',
    dateShort: 'Mar 2026',
    img: '/assets/photos/designs-pool.jpg',
    showOnOwners: true,
    caseStudy: {
      name: 'Mt Ainsworth', hood: 'Coronado', beds: '5 BR', revenue: '$268,900', nightly: '$694 / night', lift: '+61% over market',
      gallery: ['/assets/photos/designs-pool.jpg', '/assets/photos/designs-living-craftsman.jpg', '/assets/photos/designs-dining.jpg', '/assets/photos/designs-living-bright.jpg'],
    },
    seo: {
      title: 'Mt Ainsworth — Design case study — Cardo Vacation Rentals',
      description: 'A five-bedroom Coronado estate with a resort backyard, finished for the top of its market — 61% above.',
    },
    author: { name: 'Cardo Design Team', initials: 'CV' },
    heroCaption: 'Mt Ainsworth, Coronado — furnished as a true estate, top of its comp set.',
    bodyHtml: `<p class="lede">Mt Ainsworth is the largest home in this group — five bedrooms, a pool, and a backyard built for entertaining.</p>
        <p>The owner wanted it to compete at the very top of Coronado's market but had neither the time nor the design eye to get it there, and wanted to be entirely out of the process.</p>
        <p>We furnished it as a true estate: cohesive rooms that photograph like a luxury hotel and a backyard styled into a destination of its own. After a single walkthrough, the owner left it entirely to us.</p>
        <p>It launched at the top of its comp set and runs 61% above its Coronado market — the strongest lift of the six.</p>
        <div class="callout"><p class="eyebrow">The project</p><p>$94,700 all-in — the strongest lift of the six, at 61% over market.</p></div>`,
  },

  // ===================== EXPLORE LIKE A LOCAL (home page) =====================
  // These posts carry a `localTip` and `showOnHome: true`, so the home
  // "Explore like a local" cards render from them and link to /blog/[slug].
  {
    slug: 'catch-a-morning-set-san-diego-surf',
    title: 'Catch a morning set: where to surf around San Diego',
    category: 'Surf & sand',
    excerpt: 'Tourmaline and Cardiff Reef are forgiving for beginners; Black\'s Beach rewards the brave.',
    readTime: '3 min',
    dateFull: 'June 10, 2026',
    dateShort: 'Jun 2026',
    img: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&w=1100&q=80',
    localTip: 'Dawn patrol beats the crowds',
    showOnHome: true,
    seo: {
      title: 'Where to surf around San Diego — The Cardo Journal',
      description: 'Beginner-friendly breaks and a few for the brave, plus the local tip that beats the crowds.',
    },
    author: { name: 'The Cardo Team', initials: 'CV' },
    heroCaption: 'A clean morning set — the reward for beating the crowd to the sand.',
    bodyHtml: `<p class="lede">San Diego's coastline serves up a break for every level, from forgiving beginner sand to reef that rewards the brave.</p>
        <p>Tourmaline Surf Park in Pacific Beach and Cardiff Reef up in Encinitas are the friendliest places to find your feet — mellow, forgiving, and rarely crowded at first light. When you're ready to push it, Black's Beach below the La Jolla bluffs delivers the kind of powerful, hollow waves that draw surfers from all over the county.</p>
        <div class="callout"><p class="eyebrow">Local tip</p><p>Dawn patrol beats the crowds. Paddle out at first light and you'll have the cleanest conditions of the day mostly to yourself.</p></div>
        <p>Wherever you paddle out, check the tide and swell the night before — San Diego's spots change character completely between a morning low and an afternoon high.</p>`,
  },
  {
    slug: 'eat-your-way-down-the-coast-san-diego',
    title: 'Eat your way down the coast: San Diego food and drink',
    category: 'Food & drink',
    excerpt: 'From fish tacos in OB to Little Italy\'s pasta and the breweries of North Park.',
    readTime: '3 min',
    dateFull: 'June 4, 2026',
    dateShort: 'Jun 2026',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1100&q=80',
    localTip: 'Go early — the lines are real',
    showOnHome: true,
    seo: {
      title: 'San Diego food and drink guide — The Cardo Journal',
      description: 'Fish tacos, Little Italy pasta, and North Park breweries — how to eat your way down the coast.',
    },
    author: { name: 'The Cardo Team', initials: 'CV' },
    heroCaption: 'Fish tacos in Ocean Beach — the coast\'s most reliable order.',
    bodyHtml: `<p class="lede">You could eat your way down the entire San Diego coast and never repeat yourself — this is a food town first, tourist town second.</p>
        <p>Start with fish tacos in Ocean Beach, work your way up to Little Italy for fresh pasta and the Saturday farmers' market, then finish in North Park, where the highest concentration of craft breweries in the city keeps the evenings easy.</p>
        <div class="callout"><p class="eyebrow">Local tip</p><p>Go early — the lines are real. The best spots don't take reservations, and locals beat the dinner rush by a good hour.</p></div>
        <p>Ask us for the current neighborhood favorites when you check in; the roster changes with the season and we keep a running list.</p>`,
  },
  {
    slug: 'beyond-the-big-parks-san-diego-family',
    title: 'Beyond the big parks: family adventures in San Diego',
    category: 'Family adventures',
    excerpt: 'Balboa Park museums, the Birch Aquarium, and tide pools the kids won\'t forget.',
    readTime: '3 min',
    dateFull: 'May 28, 2026',
    dateShort: 'May 2026',
    img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1100&q=80',
    localTip: 'Free museum Tuesdays in Balboa Park',
    showOnHome: true,
    seo: {
      title: 'Family adventures in San Diego — The Cardo Journal',
      description: 'Balboa Park museums, the Birch Aquarium, and tide pools — the best family days beyond the big parks.',
    },
    author: { name: 'The Cardo Team', initials: 'CV' },
    heroCaption: 'Tide pools at low tide — the kind of afternoon kids remember.',
    bodyHtml: `<p class="lede">The big theme parks get the headlines, but San Diego's best family days are quieter, cheaper, and closer to the water.</p>
        <p>Spend a morning in Balboa Park, where more than a dozen museums sit within walking distance of each other, then head up to the Birch Aquarium in La Jolla for hands-on tanks with a view. On a low tide, the tide pools at Cabrillo or along the La Jolla coast turn into an afternoon the kids won't forget.</p>
        <div class="callout"><p class="eyebrow">Local tip</p><p>Free museum Tuesdays in Balboa Park rotate through the month — check which museums are free the day you're going and build around them.</p></div>
        <p>Pack layers and reef shoes; the marine layer keeps mornings cool and the rocks are slippery when the tide's out.</p>`,
  },
];
