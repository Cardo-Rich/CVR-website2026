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
}

export const categories = ['All', 'Revenue', 'Design', 'Compliance', 'Neighborhoods', 'Operations'];

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
    category: 'Operations',
    excerpt:
      'How to read a management statement — and the line items that quietly eat your net.',
    readTime: '6 min',
    dateFull: 'March 9, 2026',
    dateShort: 'Mar 2026',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    seo: {
      title: 'The real cost of mystery fees — The Cardo Journal',
      description:
        'How to read a short-term rental management statement — and the line items that quietly eat your net income.',
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: 'A clear, itemized statement is the easiest way to tell what a management fee is actually buying.',
    bodyHtml: `<p class="lede">A management fee is easy to compare. What's harder to compare is everything added back in afterward — and that's usually where the real cost of a partnership lives.</p>

        <p>Owners often discover the true cost of management only after reading a full season of statements line by line: cleaning markups, "convenience" charges, and vague line items that never quite get explained.</p>

        <h2>What a clean statement looks like</h2>
        <p>We believe owners should be able to read their statement in five minutes and understand every dollar on it. A future post will walk through a real, anonymized Cardo statement line by line.</p>`,
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
];
