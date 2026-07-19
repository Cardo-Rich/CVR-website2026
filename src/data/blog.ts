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
    excerpt: 'Design is not decoration on a vacation rental. It is a pricing input. Here are five durable, photogenic choices that move the nightly rate.',
    readTime: '6 min read',
    dateFull: 'May 12, 2026',
    dateShort: 'May 2026',
    img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    seo: {
      title: 'Design choices that lift your nightly rate — The Cardo Journal',
      description: 'Five durable, photogenic interior-design upgrades that raise a San Diego vacation rental\'s nightly rate and reviews — and why design is a pricing input, not decor.',
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: 'A styled living space designed to photograph well and hold up to daily turnovers.',
    bodyHtml: `<p class='lede'>The fastest way to raise a San Diego vacation rental's nightly rate is not a new listing headline or a lower price. It is design that photographs well and holds up under heavy use. Guests scroll a wall of thumbnails and decide in seconds, and the algorithms that rank listings reward the homes that get booked and reviewed. Design is where both of those decisions are won.</p><h2>Why does design change the price a home can charge?</h2><p>Every rate is a bet on perceived value. When a guest compares two three-bedroom homes a block apart, the one that looks calm, cohesive, and cared-for justifies a higher number without a word of copy. That premium is not vanity. It compounds into better reviews, stronger repeat demand, and a higher floor on the nights you would otherwise discount.</p><p>Think of design the way you would think of pricing itself: as a lever with measurable return, not a matter of taste. A home that photographs a tier above its neighbors gets to sit a tier above them on rate.</p><div class='callout'><p class='eyebrow'>The Cardo view</p><p>A home booked at a confident rate because it looks the part beats a beautifully cheap one every time. Design and pricing are the same conversation, run twice.</p></div><h2>What lighting actually moves the needle?</h2><p>Overhead lighting alone flattens a room and kills the evening photos guests linger on. Layered lighting does the opposite. You want three layers working together:</p><ul><li><strong>Ambient</strong> — dimmable overheads so the space reads warm, not clinical.</li><li><strong>Task</strong> — reading lamps, under-cabinet strips, a well-lit vanity.</li><li><strong>Accent</strong> — a floor lamp or sconce that gives twilight photos depth.</li></ul><p>Warm bulbs in a consistent color temperature are a small cost with an outsized effect on how expensive a room feels. It is one of the cheapest upgrades on this list and one of the most visible.</p><h2>Does a cohesive palette really matter?</h2><p>It matters more than any single expensive piece. A home with one restrained palette carried through every room photographs as intentional. A home with five unrelated color stories photographs as a rental, no matter how nice the individual furniture is. Guests cannot always name what feels off, but they feel it, and it shows up in the rate they are willing to pay.</p><p>Pick a base of two or three colors, let coastal light do the work, and repeat it. Cohesion is what makes a mid-budget home look designed rather than furnished.</p><h2>Where should the money go — and where should it not?</h2><p>Put your budget where the camera and the guest both land. Skip it where neither does.</p><ul><li><strong>Spend</strong> on one statement piece in the main living space — the sofa or dining table that anchors the hero photo.</li><li><strong>Spend</strong> on the outdoor room. In San Diego the patio, deck, or plunge area is often the reason someone books; style it like an actual room, not an afterthought.</li><li><strong>Choose durable</strong> finishes everywhere hands and suitcases go — performance fabrics, solid-surface counters, rugs that hide traffic. Beautiful-but-fragile becomes a maintenance line item and a bad review.</li></ul><p>The goal is a home that looks high-end and survives back-to-back turnovers without looking tired by month three.</p><div class='callout'><p class='eyebrow'>Local tip</p><p>Coastal homes trade on indoor-outdoor flow. A styled patio with real seating and shade often lifts perceived value more than an equivalent spend indoors.</p></div><h2>Is this worth doing yourself, or with a team?</h2><p>A single wrong-scale sofa or a clashing rug can undo an otherwise strong room, and owners rarely get honest feedback until the reviews arrive. That is why Cardo runs an in-house design team that treats each home as a revenue asset — choosing pieces that photograph well, take abuse, and pull the rate up rather than just filling space. You can browse the approach in our <a class='inline' href='/home-designs'>home designs</a>, and see how design decisions feed the number in your <a class='inline' href='/owners#estimate'>earnings estimate</a>.</p><h2>Quick answers</h2><h3>What single design upgrade lifts nightly rate the most?</h3><p>Layered, warm lighting. It is inexpensive, transforms every photo, and makes a room read as more expensive than it is.</p><h3>Do guests really pay more for better design?</h3><p>Yes. Better-designed homes get booked faster, reviewed higher, and ranked higher, which lets you hold a stronger rate across the calendar.</p><h3>Should I prioritize durable or luxurious finishes?</h3><p>Both, in that order. Choose finishes that look high-end and withstand heavy turnover use, so the home still photographs well a year in.</p><h3>Does the outdoor space affect pricing in San Diego?</h3><p>Often significantly. A styled patio or deck is frequently the deciding image for a coastal booking, so treat it as a full room.</p>`,
  },
  {
    slug: 'stro-permits-tot-and-staying-compliant-in-san-diego',
    title: 'STRO permits, TOT, and staying compliant in San Diego',
    category: 'Compliance',
    excerpt: 'A short-term rental in San Diego needs an STRO license, TOT collection, and a Tourism Marketing District assessment — here is what each one actually means.',
    readTime: '6 min read',
    dateFull: 'April 22, 2026',
    dateShort: 'Apr 2026',
    img: 'https://images.unsplash.com/photo-1630375604571-4e370942fa65?auto=format&fit=crop&w=1600&q=80',
    seo: {
      title: 'STRO Permits and TOT in San Diego — The Cardo Journal',
      description: 'A plain-English guide to San Diego short-term rental compliance: the STRO license tiers, Transient Occupancy Tax, the TMD assessment, renewals, and what happens if you miss a deadline.',
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: "San Diego's short-term rental rules exist to protect neighborhoods and owners alike.",
    bodyHtml: `<p class='lede'>To run a short-term rental in the City of San Diego legally, you generally need three things working together: a Short-Term Residential Occupancy (STRO) license for the property, a way to collect and file Transient Occupancy Tax (TOT) on your guests' stays, and the Tourism Marketing District (TMD) assessment that rides alongside it. Miss any one of them and the fines, back taxes, and license risk usually cost far more than doing it right the first time. Rules, rates, and deadlines change, so treat everything below as a map — and verify the specifics on the City of San Diego's official STRO page before you act.</p><h2>What is an STRO license and why do the tiers matter?</h2><p>The STRO license is the city's permission slip to rent a home for short stays. The important thing most owners miss is that it is not one-size-fits-all: San Diego structures licenses into <strong>tiers</strong> that depend on how the home is used — for example, whether you are renting part of the home you live in, renting a whole home for a limited number of days per year, or operating a whole-home rental as a dedicated business.</p><p>The higher tiers, which allow the most whole-home short-term nights, are the most sought-after and have historically been the most limited in number. That scarcity is exactly why the tier you qualify for shapes your entire strategy. We deliberately won't quote tier numbers or caps here because the city adjusts them — confirm which tier your property fits and how many are available on the official STRO page.</p><div class='callout'><p class='eyebrow'>The Cardo view</p><p>The license tier is a business decision disguised as paperwork. Before you buy or convert a property, know which tier it can realistically hold — a home that can only ever qualify for a limited-night tier is a very different investment than one eligible for a full whole-home license.</p></div><h2>What is Transient Occupancy Tax and who actually pays it?</h2><p>Transient Occupancy Tax is a tax on the guest's stay — the guest pays it, but <strong>you are responsible for collecting it and filing it with the city</strong>. That distinction trips up new owners constantly. If a booking platform collects and remits TOT on your behalf for some stays, you still typically need to be registered and to account for any stays the platform doesn't cover.</p><p>The mechanics that matter:</p><ul><li>You register the property with the city's tax program and receive a certificate.</li><li>TOT is charged on top of the nightly rate and applicable fees on qualifying stays.</li><li>You file returns on a set schedule — often monthly — even in months with no bookings.</li></ul><p>We are intentionally not printing a percentage here because the rate is set by the city and can change. Pull the current TOT rate and filing frequency directly from the City of San Diego before your first return is due.</p><h2>What is the Tourism Marketing District assessment?</h2><p>Alongside TOT, San Diego lodging stays generally carry a <strong>Tourism Marketing District (TMD) assessment</strong> — a separate charge that funds regional tourism promotion. For owners, the practical takeaway is simple: it is an additional line that gets collected and remitted much like TOT, on a similar cadence, and it is easy to forget precisely because it is separate. Budget for it, collect it correctly, and file it on time. As with everything else here, confirm the current assessment rate and rules on the city's official resources rather than relying on a number from a blog.</p><h2>When are renewals and filings due, and what happens if you miss them?</h2><p>Compliance is not a one-time event — it is a calendar. STRO licenses come up for <strong>renewal</strong>, TOT and TMD returns are filed on a recurring schedule, and each has its own deadline. Missing them tends to cascade:</p><ul><li>Late TOT or TMD filings typically accrue penalties and interest on the amount owed.</li><li>A lapsed STRO license can mean you are operating unlicensed — which can carry its own enforcement action and jeopardize your ability to re-license.</li><li>Repeated or serious violations can put your license itself at risk, which for a whole-home operator is the entire business.</li></ul><p>The dollar figures and grace periods change, so we won't hard-code them. The durable advice: know your renewal date and your filing cadence, and never let a zero-booking month convince you a return isn't due.</p><div class='callout'><p class='eyebrow'>The Cardo view</p><p>The expensive mistakes are almost never dramatic. They're a forgotten monthly filing, a renewal that slipped, or a TMD line nobody collected for six months. Compliance is boring on purpose — the owners who treat it as routine are the ones who never get a surprise bill.</p></div><h2>What does Cardo handle for owners?</h2><p>This is precisely the kind of work we take off an owner's plate. For the homes we manage, we keep the compliance calendar, make sure stays are charged correctly for TOT and TMD, handle the recurring filings, and track renewal dates so nothing lapses. You still own the license and the obligation — but you are not the one remembering that a return is due on a slow month. If you want to understand how that fits alongside pricing and guest management, start with <a class='inline' href='/owners'>how we work with owners</a>, and if you're weighing whether a property pencils out, our <a class='inline' href='/owners#estimate'>earnings estimate</a> is the right first step.</p><h2>Quick answers</h2><h3>Do I need an STRO license for every short-term rental in San Diego?</h3><p>Generally yes — the City of San Diego requires an STRO license to legally offer a residence for short stays, with the specific tier depending on how the home is used. Confirm your tier on the city's official STRO page.</p><h3>Who pays the Transient Occupancy Tax?</h3><p>The guest pays it, but the owner is responsible for collecting it and filing returns with the city — typically on a recurring schedule, even in months with no bookings.</p><h3>What is the Tourism Marketing District assessment?</h3><p>It's a separate charge on lodging stays that funds regional tourism promotion, collected and remitted alongside TOT. Verify the current rate with the city.</p><h3>What happens if I miss a filing or renewal?</h3><p>Late filings usually accrue penalties and interest, and a lapsed license can mean operating unlicensed — which risks enforcement and your ability to re-license. Know your deadlines and treat them as fixed.</p>`,
  },
  {
    slug: 'la-jolla-vs-pacific-beach-which-performs-better',
    title: 'La Jolla vs. Pacific Beach: which performs better?',
    category: 'Neighborhoods',
    excerpt: 'La Jolla and Pacific Beach sit minutes apart but sell to opposite guests — the better market is the one your specific home was built to serve.',
    readTime: '6 min read',
    dateFull: 'March 30, 2026',
    dateShort: 'Mar 2026',
    img: 'https://images.unsplash.com/photo-1617142584114-730e9bda61b2?auto=format&fit=crop&w=1600&q=80',
    seo: {
      title: 'La Jolla vs. Pacific Beach for Rentals — The Cardo Journal',
      description: 'La Jolla earns on nightly rate and longer quiet stays; Pacific Beach earns on turnover and a livelier crowd. Here\'s how to match a San Diego property to the right market.',
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: "La Jolla Cove — one of several San Diego micro-markets, each with its own demand curve.",
    bodyHtml: `<p class='lede'>Neither La Jolla nor Pacific Beach is the better short-term rental market in the abstract — they are two different demand curves, and the right answer depends entirely on the home you own. La Jolla tends to win on nightly rate and longer, quieter, finish-driven stays; Pacific Beach tends to win on volume, turnover, and a younger, livelier crowd that fills the calendar in a completely different pattern. Put the wrong home in the wrong market and you underperform in both. The skill is matching the property to the demand it was built to serve.</p><h2>Who is the guest in La Jolla?</h2><p>La Jolla draws a guest who is paying for calm and quality. Think couples on an anniversary, families who want a polished home near the coves, remote workers extending a trip, and visitors who book longer and plan further ahead. They are less price-sensitive and far more finish-sensitive — the bathroom, the linens, the kitchen, the view, and the quiet all get noticed.</p><p>What that means for the calendar:</p><ul><li>Higher average nightly rates, with guests who will pay for the right home.</li><li>Longer average stays, which lowers turnover cost and cleaning frequency.</li><li>More lead time, so the calendar fills earlier and rewards patience over discounting.</li></ul><p>If your home is genuinely well-finished and the setting is quiet, La Jolla lets that quality get paid for. See how the market reads in our <a class='inline' href='/neighborhoods/la-jolla'>La Jolla neighborhood guide</a>.</p><div class='callout'><p class='eyebrow'>The Cardo view</p><p>In La Jolla, the mistake is chasing occupancy. A home booked 300 nights at a soft rate can easily lose to the same home booked fewer nights at the rate the finish level actually commands. This is a rate market first, a volume market second.</p></div><h2>Who is the guest in Pacific Beach?</h2><p>Pacific Beach sells energy. The guest is younger on average, books shorter and closer in, travels in groups of friends, and comes for the boardwalk, the bars, and the beach being steps away. Demand is livelier and more spontaneous, which changes how the calendar behaves.</p><ul><li>Higher turnover — more, shorter bookings and more frequent cleans.</li><li>Shorter booking windows, so pricing has to react closer to the stay date.</li><li>Strong weekend and summer surges driven by the social scene, not just the season.</li></ul><p>A home that is fun, durable, sleeps a group, and sits close to the action can fill an enormous number of nights here. The trade is operational intensity: more check-ins, more wear, more turns. Our <a class='inline' href='/neighborhoods/pacific-beach'>Pacific Beach neighborhood guide</a> breaks down how that demand shows up.</p><h2>Which market fits my home?</h2><p>Start with the property, not the map. A quiet, high-finish home optimized for volume in La Jolla leaves rate on the table; a livelier group home priced like a serene retreat in Pacific Beach sits empty on the nights it should be busiest. Ask:</p><ul><li><strong>Finish level:</strong> Is this a home people pay a premium to stay in, or a home people pay to be near the action?</li><li><strong>Layout and capacity:</strong> Does it serve couples and families, or groups of friends?</li><li><strong>Setting:</strong> Is quiet a feature or a liability given what's around it?</li><li><strong>Your tolerance for turnover:</strong> Fewer long stays, or many short ones?</li></ul><p>The honest read is that the same physical house earns very differently depending on which of these it's built for — and the goal is to lean into its natural market rather than force it into the one with the flashier headline number.</p><div class='callout'><p class='eyebrow'>The Cardo view</p><p>Owners often ask which neighborhood is 'better' and expect a winner. The better question is which demand curve your home already fits — because the home decides that, not the ZIP code. Our job is to price and position it for the market it belongs to.</p></div><h2>How do I know what my property would actually earn?</h2><p>Averages for a neighborhood tell you almost nothing about a specific home, because the finish, capacity, and exact location move the number more than the ZIP code does. The only way to get a real answer is to model your actual property against the demand pattern it fits. That's what our <a class='inline' href='/owners#estimate'>earnings estimate</a> is for — it looks at your home, not a neighborhood average, and shows how it would perform in the market it's suited to.</p><h2>Quick answers</h2><h3>Does La Jolla or Pacific Beach earn more per night?</h3><p>La Jolla typically commands higher nightly rates from guests paying for quality and quiet, while Pacific Beach earns more through volume and turnover. Which nets more depends on the specific home.</p><h3>Which neighborhood has higher occupancy?</h3><p>Pacific Beach generally fills more nights through shorter, more frequent, closer-in bookings; La Jolla books fewer but longer stays further in advance. Neither pattern is automatically more profitable.</p><h3>What kind of home does well in La Jolla?</h3><p>High-finish homes in quiet settings that suit couples and families and reward longer stays. Quality and calm are the product.</p><h3>What kind of home does well in Pacific Beach?</h3><p>Durable, fun homes close to the boardwalk that sleep groups and can absorb frequent turnover. Energy and location are the product.</p>`,
  },
  {
    slug: 'the-real-cost-of-mystery-fees',
    title: 'The real cost of mystery fees',
    category: 'Accounting',
    excerpt: 'Your management statement, not your headline rate, decides what you actually keep. Here is how to read one and spot the fees quietly eating your net.',
    readTime: '6 min read',
    dateFull: 'March 9, 2026',
    dateShort: 'Mar 2026',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    seo: {
      title: 'The real cost of mystery fees — The Cardo Journal',
      description: 'How to read a short-term-rental management statement, spot cleaning markups and hidden tech and marketing fees, and know what a clean, itemized statement looks like.',
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: "A clear, itemized statement is the easiest way to tell what a management fee is actually buying.",
    bodyHtml: `<p class='lede'>The number that determines what you actually earn is not the management percentage on the first page of the contract. It is the bottom line of your monthly statement after every add-on, markup, and 'convenience' charge has been quietly subtracted. Two managers can both advertise the same headline rate and hand you net checks that differ by thousands, and the difference hides in line items most owners never learn to read.</p><h2>Why does the headline management rate mislead owners?</h2><p>A low percentage is easy to advertise and easy to undercut with everything else. When the base rate is thin, the revenue has to reappear somewhere — a markup on the cleaning fee, a per-booking technology charge, an optional marketing tier, a surcharge on every maintenance visit. The advertised number is designed to win the conversation; the statement is where the actual economics live.</p><div class='callout'><p class='eyebrow'>The Cardo view</p><p>Do not compare management rates. Compare net-in-pocket on the same home for the same month. The rate is marketing; the statement is the truth.</p></div><h2>Which line items quietly eat your net?</h2><p>A few recurring culprits show up on statements across the industry. Watch for:</p><ul><li><strong>Cleaning markups</strong> — the guest pays a cleaning fee, the cleaner is paid less, and the manager keeps the spread. You may never see the real cleaner invoice.</li><li><strong>Convenience or technology fees</strong> — a per-stay or monthly charge for the software you assumed the management rate already covered.</li><li><strong>Marketing add-ons</strong> — 'premium placement' or 'enhanced marketing' tiers billed on top of the base fee for work that should be included.</li><li><strong>Maintenance markups</strong> — a percentage stacked on top of every vendor invoice, so a routine repair quietly costs more than the vendor charged.</li></ul><p>Individually each looks minor. Stacked across a busy season, they are the gap between the earnings you were promised and the deposit you received.</p><h2>What does a clean, itemized statement look like?</h2><p>A statement you can trust does not ask you to take anything on faith. It shows, for every stay:</p><ul><li>Gross booking revenue, by reservation.</li><li>The management fee, calculated transparently against that revenue.</li><li>Pass-through costs at actual cost — the real cleaner invoice, the real vendor invoice — with no undisclosed spread.</li><li>Any fee named plainly, so you know exactly what it is for.</li></ul><p>If a charge cannot be explained in one sentence, it should not be on your statement. Clarity is not a courtesy; it is the product.</p><div class='callout'><p class='eyebrow'>Local tip</p><p>Ask to see one real cleaner invoice next to the cleaning fee charged to the guest. The distance between those two numbers tells you most of what you need to know about a manager.</p></div><h2>What should you ask a manager before signing?</h2><p>The right questions surface the hidden economics before they cost you:</p><ul><li>Is the cleaning fee passed through at cost, or is there a markup?</li><li>Are there any per-booking, technology, or convenience fees on top of the management rate?</li><li>Do you add a percentage to maintenance and vendor invoices?</li><li>Is marketing included, or billed as a separate tier?</li><li>Can I see a sample statement for a home like mine, with every line explained?</li></ul><p>A manager confident in their pricing answers all five without hesitation. You can see how we lay this out on our <a class='inline' href='/owners'>owners page</a>, and run your own head-to-head on the <a class='inline' href='/owners#compare'>compare</a> view.</p><h2>Quick answers</h2><h3>What is the biggest hidden fee in vacation rental management?</h3><p>Usually the cleaning markup — the spread between what the guest is charged for cleaning and what the cleaner is actually paid. It recurs on every stay.</p><h3>How do I compare two managers fairly?</h3><p>Ignore the headline percentage. Compare projected net-in-pocket for the same home and month, after all fees and markups.</p><h3>What makes a management statement trustworthy?</h3><p>Every reservation itemized, pass-through costs shown at actual cost, and every fee named plainly enough to explain in one sentence.</p><h3>Should maintenance invoices carry a markup?</h3><p>Ideally not. Ask whether vendor invoices are passed through at cost or have a percentage added before you sign.</p>`,
  },
  {
    slug: 'turnovers-that-protect-five-star-reviews',
    title: 'Turnovers that protect five-star reviews',
    category: 'Operations',
    excerpt: 'A spotless turnover is not a chore. It is the quiet engine behind five-star reviews, higher ranking, and the rate you can hold.',
    readTime: '6 min read',
    dateFull: 'March 2, 2026',
    dateShort: 'Mar 2026',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    seo: {
      title: 'Turnovers that protect five-star reviews — The Cardo Journal',
      description: 'The inspection and cleaning checklist behind a spotless vacation rental turnover, why it is never skipped on same-day turns, and how it compounds into reviews and rate.',
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: "A turnover in progress — the unglamorous work behind every five-star review.",
    bodyHtml: `<p class='lede'>The most valuable ninety minutes in a vacation rental's month happen between checkout and check-in, when nobody is watching. A turnover is not just cleaning — it is the last inspection before a stranger judges your home in a public review that follows the listing for years. Get it right every time, including the tight same-day turns, and five-star reviews stop being luck and start being a system.</p><h2>Why is the turnover the single most important operation?</h2><p>It is the only moment when the home is both empty and about to be scored. A guest does not review your paint or your neighborhood first — they review whether the counters were sticky, whether the last guest's hair was in the shower, whether the coffee maker was clean. One missed detail can turn a five-star stay into a three-star review, and reviews are the currency that ranking and rate are built on.</p><div class='callout'><p class='eyebrow'>The Cardo view</p><p>A guest forgives a lot in a home that is spotless on arrival. They forgive almost nothing in one that is not. The turnover is where the review is decided, before the guest ever unpacks.</p></div><h2>What is actually on the turnover checklist?</h2><p>A reliable turnover is two jobs, not one: a deep clean and an inspection, run by someone who knows what a paying guest will notice. The checklist covers:</p><ul><li><strong>Kitchen</strong> — appliances wiped inside and out, coffee maker and kettle descaled, no crumbs in drawers, dishware spotless and put away.</li><li><strong>Bathrooms</strong> — grout and glass streak-free, drains clear of hair, fresh linens, sealed amenities restocked.</li><li><strong>Bedrooms</strong> — hotel-grade bed making, mattress and pillow protectors checked, under beds and closets cleared.</li><li><strong>Living spaces</strong> — surfaces dusted, cushions reset, remotes and chargers accounted for, floors done last.</li><li><strong>Inspection layer</strong> — a walk-through for damage, low supplies, burnt-out bulbs, and anything the previous guest broke or moved before the next guest ever sees it.</li></ul><p>That inspection layer is what separates a cleaned home from a guest-ready one. It catches the small maintenance issue while it is still small and free to fix.</p><h2>Why can't it be skipped on a same-day turn?</h2><p>Same-day turns are exactly when the temptation to cut corners is highest and the cost of doing so is worst. A tight window between an 11am checkout and a 4pm check-in is not a reason to shorten the checklist — it is the reason to staff it properly, so the standard never bends to the schedule. The guest arriving at 4pm has no idea the last guest left at 11. They only know whether the home is perfect, and they will say so publicly either way.</p><p>Protecting the standard on the hard days is the whole point. Anyone can clean well with a day of slack; consistency is what earns the reviews.</p><h2>How does turnover quality compound into rate?</h2><p>Turnovers do not just protect one review — they stack. The chain runs in one direction:</p><ul><li>A spotless arrival produces a five-star review.</li><li>A steady stream of five-star reviews lifts the listing's ranking and search visibility.</li><li>Higher ranking and a stronger review profile let the home hold a higher nightly rate without losing occupancy.</li><li>A higher, well-reviewed home attracts guests who treat it well, which makes the next turnover easier.</li></ul><p>That is why we treat turnover quality as a revenue function, not a housekeeping cost. It is the same insight behind everything on our <a class='inline' href='/owners'>owners page</a> — and you can read what it produces in our <a class='inline' href='/reviews'>guest reviews</a>.</p><div class='callout'><p class='eyebrow'>Local tip</p><p>The details guests photograph and mention most are the ones closest to their hands and faces — glassware, linens, the shower. Weight the checklist toward those, and the reviews follow.</p></div><h2>Quick answers</h2><h3>Why do turnovers matter more than the listing itself?</h3><p>The listing gets the booking, but the turnover earns the review. A spotless arrival is what turns a stay into five stars and a repeat guest.</p><h3>Should the cleaning standard change on same-day turns?</h3><p>Never. The arriving guest judges the home the same way regardless of the schedule, so the checklist has to be staffed to hold on tight days.</p><h3>What is the difference between cleaning and a turnover?</h3><p>A turnover is a deep clean plus an inspection — catching damage, low supplies, and maintenance issues before the next guest arrives.</p><h3>How do reviews affect my nightly rate?</h3><p>Strong reviews raise ranking and visibility, which lets a home hold a higher rate without sacrificing occupancy. Turnover quality is where that starts.</p>`,
  },
  {
    slug: 'why-del-mars-racing-season-changes-your-pricing',
    title: "Why Del Mar's racing season changes your pricing",
    category: 'Revenue',
    excerpt: 'Del Mar\'s racing season compresses weeks of demand into a handful of dates — and pricing those nights like ordinary nights quietly leaves the most money on the table.',
    readTime: '6 min read',
    dateFull: 'February 14, 2026',
    dateShort: 'Feb 2026',
    img: 'https://images.unsplash.com/photo-1509399316151-9b86c70fdd40?auto=format&fit=crop&w=1600&q=80',
    seo: {
      title: 'Del Mar Racing Season and Your Pricing — The Cardo Journal',
      description: 'Event-driven demand — Del Mar racing, fairs, conventions, holidays — compresses weeks of bookings into a few dates. Here\'s why pricing ahead of the calendar captures the spike.',
    },
    author: {
      name: 'The Cardo Team',
      initials: 'CV',
    },
    heroCaption: 'Del Mar in summer — a short, sharp demand window that rewards pricing ahead of the calendar.',
    bodyHtml: `<p class='lede'>Del Mar's racing season changes your pricing because it changes the demand itself — it takes what would be weeks of ordinary bookings and compresses them into a concentrated window where far more people want far fewer available homes. On those dates, the market will pay well above a normal summer rate, but only if your price is set ahead of the calendar to meet it. Treat an event week like a regular week and you'll fill the nights early at the wrong number, then watch the real demand arrive with nowhere to go.</p><h2>What actually happens to demand during racing season?</h2><p>An event doesn't gently lift demand — it spikes it. During the Del Mar meet, visitors, groups, and out-of-town racegoers all converge on the same dates, and the supply of nearby homes doesn't grow to match. That imbalance is the entire opportunity. The same dynamic repeats around the county fair, major conventions downtown, and marquee holiday weekends: demand that would normally spread across a month stacks up on a handful of days.</p><p>The key insight is that this is <strong>predictable in advance</strong>. Unlike everyday booking noise, event windows are on the calendar months out — which means they can be priced months out, before the early bargain-hunters lock in your nights at ordinary rates. See how this plays out locally in our <a class='inline' href='/neighborhoods/del-mar'>Del Mar neighborhood guide</a>.</p><div class='callout'><p class='eyebrow'>The Cardo view</p><p>The money in an event week isn't made during the event — it's made months earlier, when the price for those dates was set. By the time racing season arrives, the outcome is already locked. Pricing is a forecast, not a reaction.</p></div><h2>Why does pricing an event week like a normal week cost so much?</h2><p>Because the damage is invisible. A home priced at its usual rate during a high-demand window doesn't sit empty — it books, and often books <em>early</em>, which feels like success. What you never see is the premium you would have captured if the price had reflected the real demand for those specific dates. The calendar looks full; the revenue quietly fell short.</p><p>This is the same principle behind a point we make often: a home booked at the wrong rate loses to one booked at the right one. On an ordinary night the gap is small. On a compressed event night, the gap between the ordinary rate and the market-clearing rate can be substantial — and it's paid on the exact nights that were supposed to be your best of the year.</p><h2>How does dynamic pricing capture the spike?</h2><p>Dynamic pricing sets each night's rate against what's actually happening for that date rather than a flat seasonal number. For event windows, that means:</p><ul><li><strong>Pricing ahead of the calendar</strong> so event dates carry a premium before early bookers can grab them cheap.</li><li><strong>Setting sensible minimum stays</strong> so a peak weekend isn't half-consumed by a single low-value night.</li><li><strong>Watching the pace of bookings</strong> and adjusting as the window fills, rather than guessing once and walking away.</li><li><strong>Protecting the shoulder nights</strong> around the event, which often carry spillover demand of their own.</li></ul><p>Done well, it means the best dates on your calendar are priced like the best dates — not blended into an average that flatters occupancy and starves revenue. For a fuller picture of how these windows add up across a year, see <a class='inline' href='/blog/what-your-san-diego-home-could-earn-2026'>what your San Diego home could earn</a>.</p><div class='callout'><p class='eyebrow'>The Cardo view</p><p>Owners tend to obsess over the annual average rate. The real leverage is in a dozen or so dates. Get the event windows right and the yearly number takes care of itself; get them wrong and no amount of everyday optimization makes it back.</p></div><h2>Which event windows matter beyond racing season?</h2><p>Del Mar's meet is the headline, but a San Diego calendar is dotted with compression events worth pricing deliberately: the county fair that shares the fairgrounds, large downtown conventions that pull in tens of thousands of attendees, and the reliable holiday peaks around summer and the winter holidays. Each one behaves like a mini racing season — concentrated demand, fixed supply, and a premium available to owners who set the price before the demand shows up. The homes that leave the most on the table are the ones running a single flat rate straight through every one of these windows.</p><h2>Quick answers</h2><h3>Should I raise my rate for Del Mar racing season?</h3><p>Almost always, yes — demand compresses onto those dates while supply stays fixed, so the market typically supports a meaningful premium if you price the window ahead of time rather than after bookings arrive.</p><h3>Why did my home book up early but earn less during a big event?</h3><p>Because it was likely priced at an ordinary rate. Event nights that fill early at a normal price feel successful but quietly miss the premium those specific dates could have commanded.</p><h3>How far ahead should event dates be priced?</h3><p>As soon as the dates are known — often months out. The premium is captured before early bookers lock in your best nights at everyday rates, so waiting forfeits it.</p><h3>Do only racing weeks matter?</h3><p>No. Fairs, major conventions, and holiday peaks create the same compressed demand. Any predictable event window rewards pricing ahead of the calendar; you can model the impact with our <a class='inline' href='/owners#estimate'>earnings estimate</a>.</p>`,
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
    excerpt: 'From mellow beginner beach breaks to heavy reef, here is where to surf around San Diego by skill level, plus tide, timing and safety tips.',
    readTime: '5 min read',
    dateFull: 'June 10, 2026',
    dateShort: 'Jun 2026',
    img: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&w=1100&q=80',
    localTip: 'Dawn patrol beats the crowds',
    showOnHome: true,
    seo: {
      title: 'Surfing in San Diego: Where to Surf by Level — The Cardo Journal',
      description: 'Where to surf around San Diego by skill level: beginner breaks like Tourmaline and Cardiff Reef, advanced spots like Black\'s, plus tide, timing and safety.',
    },
    author: { name: 'The Cardo Team', initials: 'CV' },
    heroCaption: 'A clean morning set — the reward for beating the crowd to the sand.',
    bodyHtml: `<p class='lede'>The best surf in San Diego depends on your level: beginners should point toward gentle, forgiving beach breaks like Tourmaline Surfing Park in Pacific Beach or Cardiff Reef in Encinitas, while confident surfers can chase the heavier, faster waves at Black's Beach below the La Jolla bluffs. Match the spot to your ability, paddle out early before the wind fills in, and you will have a very good morning.</p><h2>Where should beginners surf in San Diego?</h2><p>New surfers want soft, rolling waves, a sandy bottom and a relaxed crowd. A few classic first-timer spots deliver exactly that.</p><ul><li><strong>Tourmaline Surfing Park</strong> in <a class='inline' href='/neighborhoods/pacific-beach'>Pacific Beach</a> is a longboard-friendly point with a mellow, forgiving wave and a dedicated surf-only zone, which keeps swimmers out of your way.</li><li><strong>Cardiff Reef</strong> in <a class='inline' href='/neighborhoods/encinitas'>Encinitas</a> serves up long, gentle walls that are perfect for learning to trim and turn, with an easygoing north-county vibe.</li><li><strong>Mission Beach and Pacific Beach</strong> proper have wide, sandy beach breaks that are easy to walk out into on smaller days.</li></ul><p>On a small, clean morning any of these will feel manageable. If the surf report is calling for anything overhead, save it for another day.</p><h2>Where do stronger and advanced surfers go?</h2><p>When the swell picks up, San Diego rewards experience. <strong>Black's Beach</strong>, tucked below the towering La Jolla bluffs near the Torrey Pines gliderport, is the region's marquee break: a powerful, fast beach break fed by an offshore canyon that can produce serious, hollow waves. The catch is a steep, tiring hike down the cliff trail and strong currents, so it is strictly for confident surfers and swimmers.</p><p>Reef spots up and down the coast, from La Jolla's rocky points to north-county reefs, also turn on with the right swell direction and tide. If you are unsure whether conditions are within your comfort zone, watch the lineup for fifteen minutes before you paddle out.</p><div class='callout'><p class='eyebrow'>Local tip</p><p>Check a surf forecast the night before and again at dawn. Swell size, wind and tide all move quickly here, and a spot that was glassy at sunrise can turn choppy and unfriendly by mid-morning.</p></div><h2>Where can you rent a board or take a lesson?</h2><p>You do not need to travel with a board. Surf shops cluster along the boardwalks in Pacific Beach and Mission Beach and throughout the beach towns of north county, and most rent soft-top boards and wetsuits by the hour or day. Many also run group and private lessons that include gear, which is the fastest, safest way for a first-timer to stand up.</p><p>Book a lesson at a designated beginner beach rather than a reef, confirm current hours and pricing directly with the shop, and ask the instructor which nearby break suits the day's conditions. Our <a class='inline' href='/concierge'>concierge team</a> can point you toward reputable local outfitters near your stay.</p><h2>What is basic surf etiquette in the lineup?</h2><p>Every local break runs on the same unwritten rules. Respecting them keeps you safe and welcome.</p><ul><li><strong>One surfer per wave.</strong> The person closest to the breaking part (the peak) has priority. Do not drop in on someone already riding.</li><li><strong>Do not paddle straight through the lineup.</strong> Paddle out around the shoulder, not through the middle where people are riding.</li><li><strong>Hold onto your board.</strong> Never ditch it near others, especially in a crowd.</li><li><strong>Wait your turn and share.</strong> Be patient, take your set, and let others have theirs.</li></ul><h2>When is the best time and tide to paddle out?</h2><p>Early morning is almost always best. Winds are typically lightest at dawn, which keeps the water smooth and clean before the afternoon onshore breeze roughens things up. Beginner beach breaks generally work well around a mid tide, while some reefs and points prefer a specific tide window, so a quick look at the tide chart helps.</p><p>San Diego is a genuinely year-round surf destination. A good wetsuit makes the cooler water of winter and spring comfortable, and those months often bring the most consistent swell. Summer mornings are warmer and mellower, which suits learners.</p><h2>How do you stay safe, and what about the marine layer?</h2><p>A thick coastal fog known as the <strong>marine layer</strong> often blankets the coast on late spring and summer mornings, sometimes called May Gray or June Gloom. It usually burns off by midday, but it can cut visibility at dawn, so give yourself extra awareness in the water and note landmarks on the beach before you paddle out.</p><p>Beyond the fog, respect rip currents, swim and surf near a staffed lifeguard tower when you can, know your limits, and never surf a spot that is clearly beyond your ability. If you are bringing kids along for a beach day around your session, our guide to <a class='inline' href='/blog/beyond-the-big-parks-san-diego-family'>family-friendly San Diego beyond the big parks</a> has calm-water ideas.</p><div class='callout'><p class='eyebrow'>Local tip</p><p>Rip currents pull you out, not under. If you get caught in one, stay calm, do not fight it head-on, and paddle or swim parallel to the beach until you are free of the pull, then head in.</p></div><h2>Quick answers</h2><h3>Where is the best beginner surf spot in San Diego?</h3><p>Tourmaline Surfing Park in Pacific Beach and Cardiff Reef in Encinitas are the classic beginner-friendly picks, with mellow, forgiving waves and surf-oriented zones.</p><h3>Is Black's Beach good for beginners?</h3><p>No. Black's is a powerful, fast break with strong currents and a steep cliff hike down, best left to confident, experienced surfers and swimmers.</p><h3>What time of day is best to surf here?</h3><p>Early morning, when winds are lightest and the water is cleanest, usually before the afternoon onshore breeze picks up.</p><h3>Do you need a wetsuit to surf in San Diego?</h3><p>Most of the year, yes. A wetsuit keeps you comfortable in cooler water, especially from late fall through spring; summer is the warmest stretch.</p>`,
  },
  {
    slug: 'eat-your-way-down-the-coast-san-diego',
    title: 'Eat your way down the coast: San Diego food and drink',
    category: 'Food & drink',
    excerpt: 'Fish tacos in Ocean Beach, pasta and a Saturday market in Little Italy, North Park breweries and Baja-Med flavor: how to eat your way down the coast.',
    readTime: '5 min read',
    dateFull: 'June 4, 2026',
    dateShort: 'Jun 2026',
    img: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1600&q=80',
    localTip: 'Go early — the lines are real',
    showOnHome: true,
    seo: {
      title: 'San Diego Food Guide: Eat Your Way Down the Coast — The Cardo Journal',
      description: 'A San Diego food and drink guide: fish tacos in Ocean Beach, Little Italy pasta and the Saturday Mercato, North Park breweries, Baja-Med flavor and coffee.',
    },
    author: { name: 'The Cardo Team', initials: 'CV' },
    heroCaption: 'Fish tacos in Ocean Beach — the coast\'s most reliable order.',
    bodyHtml: `<p class='lede'>The best way to eat your way down the San Diego coast is to follow the neighborhoods: start with fish tacos in beachy Ocean Beach, graze pasta and produce in Little Italy, sip your way through North Park's craft breweries, and lean into the cross-border Baja-Med flavor that defines the region. Go early or late to beat the lines, and let each district set the pace.</p><h2>Where do you find the best fish tacos in San Diego?</h2><p>The fish taco is San Diego's signature bite, and the beach towns do it best. <strong>Ocean Beach</strong>, the laid-back, bohemian community at the end of the peninsula, is a perfect place to start: casual taco counters and surf-shack kitchens serve both the crispy Baja-style battered fish and lighter grilled versions, usually topped with cabbage, crema and a squeeze of lime.</p><p>You will find excellent versions all along the coast, from Pacific Beach to the north-county beach towns. Eat them close to the water, salt still in your hair, and you are doing it exactly right.</p><div class='callout'><p class='eyebrow'>Local tip</p><p>Order the Baja-style (battered and fried) taco at least once for the classic, then compare it with a grilled fish or shrimp version. Half the fun is deciding which camp you fall into.</p></div><h2>What should you eat in Little Italy?</h2><p><strong>Little Italy</strong>, just north of downtown, has grown into one of the city's premier dining neighborhoods while keeping its old-world heart. It is the place to go for handmade pasta, wood-fired pizza, espresso and lively patios along India Street.</p><p>The highlight for food lovers is the <strong>Mercato farmers' market</strong>, which fills the streets on Saturday mornings with local produce, flowers, cheese, olive oil, prepared food and coffee. Wander with a pastry in hand, gather picnic supplies, then settle in for a long lunch. Check the market's current day and hours before you go, as schedules can shift seasonally.</p><h2>Where is San Diego's craft beer scene?</h2><p>San Diego is one of the great American beer cities, and <strong>North Park</strong> is its walkable epicenter. This hip, creative neighborhood packs tasting rooms, brewpubs and bottle shops within strolling distance of one another, with the hop-forward West Coast IPA as the local calling card alongside crisp lagers, hazy ales and rich stouts.</p><ul><li>Plan a relaxed afternoon crawl and share flights rather than full pours so you can taste widely.</li><li>Many taprooms are family- and dog-friendly and welcome outside food or nearby food trucks.</li><li>Neighboring communities like South Park and the Miramar area, sometimes called the Beer-muda Triangle, add even more stops.</li></ul><p>Always confirm hours and line up a ride if you are tasting seriously.</p><h2>What is Baja-Med, and where does coffee fit in?</h2><p>San Diego's food identity is inseparable from the border. <strong>Baja-Med</strong> cuisine blends Mexican ingredients with Mediterranean and Asian techniques, all built on the incredible seafood and produce of the Baja California region just south. You will taste that cross-border influence in ceviche, aguachile, elevated tacos and the wine coming out of Baja's Valle de Guadalupe.</p><p>The coffee scene is just as serious. Independent roasters and third-wave cafes are scattered through North Park, Little Italy, the beach towns and beyond, making a proper morning flat white or pour-over easy to find before you start exploring.</p><div class='callout'><p class='eyebrow'>Local tip</p><p>Build a day around one neighborhood at a time. Coffee and a bakery stop in the morning, tacos by the water for lunch, and a brewery or Baja-Med dinner in the evening keeps you from criss-crossing the city.</p></div><h2>How do you time visits to beat the lines?</h2><p>The most popular spots draw crowds, especially on weekends. A little timing goes a long way.</p><ul><li><strong>Eat off-peak.</strong> An early lunch before noon or a late one after two, and dinner right when doors open, means shorter waits.</li><li><strong>Hit farmers' markets early.</strong> Arrive close to opening for the best selection and thinnest crowds.</li><li><strong>Go midweek when you can.</strong> Tuesday through Thursday are far calmer than Friday and Saturday nights.</li><li><strong>Reserve ahead</strong> for sit-down dinners, and always double-check current hours, which change seasonally.</li></ul><p>Browse our <a class='inline' href='/neighborhoods'>San Diego neighborhoods guide</a> to see which food districts sit closest to your stay, and let the <a class='inline' href='/concierge'>Cardo concierge</a> help with reservations and recommendations. Traveling with kids? Our guide to <a class='inline' href='/blog/beyond-the-big-parks-san-diego-family'>family-friendly San Diego beyond the big parks</a> pairs easy meals with low-key outings.</p><h2>Quick answers</h2><h3>What food is San Diego known for?</h3><p>Fish tacos and Baja-influenced Mexican food, plus a nationally celebrated craft-beer scene and the cross-border Baja-Med style built on fresh seafood and produce.</p><h3>Where is the best neighborhood for foodies?</h3><p>Little Italy for pasta, markets and cafes; North Park for breweries and independent kitchens; and the beach towns like Ocean Beach for tacos by the water.</p><h3>When is the Little Italy farmers' market?</h3><p>The Mercato market runs on Saturday mornings, filling the streets with produce, prepared food and coffee. Confirm current day and hours before you go.</p><h3>How do you avoid long restaurant lines?</h3><p>Eat off-peak, go midweek, arrive at markets near opening, and reserve ahead for popular dinners.</p>`,
  },
  {
    slug: 'beyond-the-big-parks-san-diego-family',
    title: 'Beyond the big parks: family adventures in San Diego',
    category: 'Family adventures',
    excerpt: 'Balboa Park museums, the Birch Aquarium in La Jolla, and the best tide pools in town — a full family day, no theme-park lines.',
    readTime: '6 min read',
    dateFull: 'May 28, 2026',
    dateShort: 'May 2026',
    img: 'https://images.unsplash.com/photo-1612301738481-cb439dcf3c05?auto=format&fit=crop&w=1600&q=80',
    localTip: 'Free museum Tuesdays in Balboa Park',
    showOnHome: true,
    seo: {
      title: 'Family Things to Do in San Diego Beyond the Theme Parks — The Cardo Journal',
      description: "A local's guide to family days in San Diego without the theme parks: Balboa Park museums, the Birch Aquarium at Scripps in La Jolla, and the best low-tide tide pools — with tips on timing, parking, and free days.",
    },
    author: { name: 'The Cardo Team', initials: 'CV' },
    heroCaption: 'The Lily Pond and El Prado at Balboa Park — the cultural heart of family San Diego.',
    bodyHtml: `<p class="lede">San Diego is famous for its theme parks — but ask a local where they take their own kids and you'll hear about Balboa Park, the tide pools, and the aquarium on the bluff in La Jolla. Here's how to build a full, low-stress family day out of the city's best — and often free — attractions.</p>

        <h2>Why skip the big theme parks?</h2>
        <p>Theme parks are a full day, a big spend, and a lot of lines. San Diego's cultural and coastal attractions are cheaper, closer together, and easier on younger kids — and they show off what actually makes the city special: its museums, its marine life, and 70 miles of coastline. You can pack two or three of the stops below into one day without anyone melting down.</p>

        <h2>How do you spend a day in Balboa Park with kids?</h2>
        <p>Balboa Park is a 1,200-acre park just north of downtown, and it packs roughly 17 museums, the San Diego Zoo, gardens, and Spanish Colonial architecture into an easy, walkable stretch called El Prado. For families, a few stops stand out:</p>
        <ul>
          <li><strong>Fleet Science Center</strong> — hands-on exhibits and a domed planetarium; the easiest win for curious kids.</li>
          <li><strong>San Diego Natural History Museum ("theNAT")</strong> — dinosaurs, fossils, and a giant-screen theater.</li>
          <li><strong>San Diego Model Railroad Museum</strong> — one of the largest in the world and a reliable toddler favorite.</li>
          <li><strong>San Diego Air &amp; Space Museum</strong> — real aircraft and space capsules under a rotunda.</li>
          <li><strong>The Botanical Building &amp; Lily Pond</strong> — free to visit, endlessly photogenic, and a good spot to let little legs run.</li>
          <li><strong>The California Tower at the Museum of Us</strong> — climb it for one of the best views in the city.</li>
        </ul>
        <div class="callout"><p class="eyebrow">Local tip</p><p>San Diego residents get in free to many Balboa Park museums on a rotating <strong>Residents Free Tuesday</strong> schedule — a different set of museums each Tuesday of the month. The lineup changes, so check the current calendar and plan your day around whichever museums are free when you visit.</p></div>
        <p>Parking in the park is free, but the lots fill fast on weekends — arrive before 10am, or hop the free park tram that loops the main lots and El Prado.</p>

        <h2>Is the Birch Aquarium worth the trip to La Jolla?</h2>
        <p>Yes — especially with kids. The <a href="/neighborhoods/la-jolla" class="inline">La Jolla</a> aquarium, officially the Birch Aquarium at Scripps, is run by the Scripps Institution of Oceanography, and it's built for hands-on learning: tide-pool touch tanks, a seahorse gallery, local kelp-forest species, and a bluff-top deck with one of the best ocean views in San Diego. It's smaller and calmer than a big-city aquarium, which is exactly why it works for younger kids. Pair it with lunch in the village or a walk down to the cove.</p>

        <h2>Where are the best tide pools in San Diego?</h2>
        <p>Tide pools are the cheapest, most memorable outing on this list — and San Diego has two standouts:</p>
        <ul>
          <li><strong>Cabrillo National Monument (Point Loma)</strong> — a protected rocky intertidal zone with anemones, crabs, and the occasional octopus, plus a historic lighthouse above it.</li>
          <li><strong>La Jolla</strong> — the reefs and bluffs around the cove reveal pools at low water, a short walk from the aquarium.</li>
        </ul>
        <p>The catch: tide pools only appear at <strong>low tide</strong>. Check a San Diego tide chart the night before and aim for a low tide around one foot or lower — fall and winter mornings are often best. Wear closed-toe shoes with grip (the rocks are slick), keep an eye on the incoming tide, and look but don't take: everything in the pools is protected and alive.</p>

        <h2>What else is easy with kids?</h2>
        <ul>
          <li><strong>La Jolla Cove</strong> — sea lions and harbor seals haul out on the rocks; watch from above (some beaches close seasonally for seal pupping).</li>
          <li><strong>Sunset Cliffs &amp; Old Town</strong> — a dramatic clifftop stroll and a walkable slice of early California history.</li>
          <li><strong>Mission Bay &amp; Belmont Park</strong> — calm-water beaches and a small beachfront amusement park with a classic wooden coaster.</li>
          <li><strong>Coronado Beach</strong> — wide, gentle sand across the bridge, good for all ages.</li>
        </ul>

        <div class="callout"><p class="eyebrow">Plan the day</p><p>Check the tide chart first and build the beach or tide-pool stop around low tide; save Balboa Park or the aquarium for the higher-tide half of the day. Pack layers — San Diego's morning "marine layer" keeps the coast cool until midday — plus water and reef shoes.</p></div>

        <h2>Family San Diego: quick answers</h2>
        <h3>What's the best free thing to do with kids in San Diego?</h3>
        <p>Balboa Park's gardens, the Botanical Building and Lily Pond, and the tide pools at Cabrillo or La Jolla are all free (Cabrillo charges a small per-vehicle entrance fee). Time a Balboa Park visit to a Residents Free Tuesday and the museums are free too.</p>
        <h3>How many days do you need in San Diego with family?</h3>
        <p>Three to four days lets you pair a Balboa Park day, a La Jolla-and-aquarium day, and a beach day without rushing — with a theme park added only if you want one.</p>
        <h3>When is the best time to see the tide pools?</h3>
        <p>At low tide, ideally a foot or lower. Fall and winter mornings tend to have the lowest daytime tides; always check a current San Diego tide chart before you go.</p>
        <h3>Where should families stay in San Diego?</h3>
        <p>La Jolla and the beach towns — Pacific Beach, Mission Beach, Coronado — put you closest to the coast and an easy drive from Balboa Park. A whole-home rental with a kitchen and laundry makes a multi-day family trip far easier than a hotel room.</p>

        <p>Staying in one of our <a href="/" class="inline">San Diego homes</a>? Ask us at check-in for the current Free Tuesday lineup and the week's best low tides — we keep a running local list. Hungry after? Here's <a href="/blog/eat-your-way-down-the-coast-san-diego" class="inline">how to eat your way down the coast</a>.</p>`,
  },
];
