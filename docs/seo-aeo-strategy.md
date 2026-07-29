# Cardo SEO & AEO Strategy — owning San Diego STR-management search

**Goal:** when a San Diego property owner searches — on Google or by asking an AI —
anything about Airbnb/short-term-rental management, Cardo shows up as the
definitive expert, and the path from that first query ends in a booked sales
consultation.

**Date:** July 2026 · **Author:** Claude (research + strategy) for Rich Scherf
**Status:** proposal — nothing here is built yet; this doc is the backlog source.

---

## 1. Executive summary

Research across ~30 live searches (July 2026) plus the current evidence base on
AI-answer-engine optimization points to one clear conclusion: **the San Diego
STR-management search landscape is winnable, and one local competitor (West
Coast Homestays) is already running the exact playbook we need to run better.**

Five findings drive the whole plan:

1. **Owner queries cluster into ~9 repeatable patterns** (fees, "is it worth
   it," best-companies shortlists, regulations, taxes, co-host-vs-manager,
   revenue estimates, vetting, switching managers). Every winning result is one
   of four formats: a number-rich data page, a year-stamped compliance guide, a
   neighborhood service page, or a third-party listicle. Cardo currently has
   almost none of these formats live.
2. **AI answers are assembled from things we can control.** Yext's 6.8M-citation
   study: 86% of AI citations come from brand-managed sources (44% first-party
   sites, 42% listings/directories). Comparative listicles alone are ~32% of
   citations. Ahrefs (75k brands): unlinked brand *mentions* predict AI
   visibility ~3× better than backlinks. And ranking page-1 locally correlates
   ~0.65 with being named by ChatGPT — **AEO is ~70% "be excellent at local
   SEO" plus ~30% new work** (answer-first content, citations, listings).
3. **San Diego regulation is our unfair advantage.** STRO license scarcity
   (Tier 3 nearly capped, Tier 4/Mission Beach exhausted with a waitlist) and
   the 2025 TOT re-zoning generate recurring, high-anxiety, thinly-served
   queries. Compliance anxiety is the single strongest "hand it to a manager"
   trigger. Nobody has built the definitive STRO resource; the city publishes
   the open dataset that would let us run a live license-availability tracker.
4. **Fee transparency wins twice.** "How much do managers charge" is the
   highest-value informational cluster, and competitors that publish their
   percentage (Superstays 18%, MasterHost "from 10%") turn pricing into both a
   ranking asset and a qualifier. Cardo has no pricing/fees page at all.
5. **The conversion machinery already exists.** `/owners#estimate` → HighLevel
   intake + consultation booking works today. The plan's job is to multiply
   qualified entrances to it, and instrument it so we know which queries book
   calls.

The plan: build ~25 pages and 2 interactive tools in four phases over ~6
months, harden the listings/reviews layer that AI engines actually read, run a
monthly prompt audit, and route every asset to the consultation funnel.

---

## 2. Where we stand today (site audit)

**Already strong — don't rebuild:**

- Technical SEO is clean: canonical URLs, sitemap-index (redirect-safe as of
  PR #35), robots.txt correct (all AI crawlers allowed), OG/Twitter cards,
  GTM + GA4.
- Schema present: sitewide `LocalBusiness` with `areaServed` (7 cities) and
  `aggregateRating` (5.0 / 2,000+ reviews); `FAQPage` on `/owners`; JSON-LD on
  blog, case-study, and neighborhood templates.
- Conversion path live: "Schedule a consultation" CTAs everywhere →
  `/owners#estimate` → server-side lead intake to HighLevel + booking widget.
- Real proof assets: 6 design case studies, Airbnb + Google review sections,
  founder story (Rich Scherf), 2,000+ reviews, Superhost-since-2013.
- 7 neighborhood pages (La Jolla, Pacific Beach, Mission Beach, Del Mar,
  Encinitas, Carlsbad, Coronado) with consultation CTAs.
- Journal has 7 owner-relevant posts with author bylines (2026 earnings, design
  ROI, STRO/TOT compliance, La Jolla vs PB, mystery fees, turnovers, Del Mar
  racing pricing).

**Gaps (these are the plan):**

| Gap | Why it matters |
|---|---|
| No pricing/fees page | Highest-intent informational cluster; competitors win it with transparent percentage tables |
| No revenue calculator | The proven PM lead-magnet (AvantStay, RedAwning both run one); our estimate is form-gated with no instant value |
| One blog post on STRO/TOT vs a competitor's full compliance library | Regulatory anxiety is the #1 management-handoff trigger and SD's license caps make it evergreen |
| No comparison content (vs Vacasa/Evolve, co-host vs manager, self-manage vs hire, switching managers) | Bottom-funnel queries with weak competition; unhappy Vacasa/Evolve owners are a named acquisition channel |
| No "best companies in San Diego" page of our own | Listicles are the #1 AI-cited format; AvantStay publishes its own and gets cited for it |
| Journal mixes owner and guest content in one feed | Dilutes owner topical authority; fan-out retrieval rewards tight clusters |
| Unknown/unmanaged listings layer (Yelp, Bing Places, BBB, directories, NAP consistency) | 42% of AI citations are listings/directories; Yelp now feeds Perplexity and ChatGPT directly |
| No AI-traffic measurement or prompt tracking | Can't see AI-driven leads; GA4 lumps much of it into Direct |

---

## 3. The search landscape — query taxonomy and who wins today

Nine clusters, ordered roughly top-of-funnel → bottom. ("Difficulty" is
qualitative, from live SERP observation July 2026.)

| # | Cluster | Example queries | Intent / funnel stage | Who wins today | Winning format | Difficulty for Cardo |
|---|---|---|---|---|---|---|
| A | Should I STR my home? | "vacation rental ROI san diego", "is SD airbnb oversaturated 2026", "how much can a san diego airbnb make" | Curiosity, pre-decision | AirDNA/Rabbu/Airbtics data pages + local blogs (West Coast Homestays) | Data-rich market reports, neighborhood benchmarks | Mid — win the long-tail ("neighborhood + year"), not the data giants |
| B | What does management cost? | "airbnb management fees", "how much do airbnb property managers charge", "is a manager worth it" | Evaluation — one step from a sales call | National blogs; locally only WCH, OODA Host, Stay Classy | Fee-breakdown tables (15–25% full-service etc.), hidden-fees exposés | **Low when SD-localized** — top priority |
| C | Co-host vs manager | "airbnb co-host vs property manager", "co-hosting san diego" | Model choice, cost-sensitive | Airbnb's own co-host marketplace + content sites | Head-to-head comparison tables | Mid — differentiate via STRO licensing angle |
| D | Best/top companies | "airbnb property management san diego", "[neighborhood] vacation rental management" | **Shortlisting — the money keywords** | Yelp, RedAwning/Comparent listicles, AvantStay, aged local domains | Third-party listicles + per-neighborhood service pages | High for head terms; **low-mid for neighborhood terms** |
| E | Vetting & switching | "questions to ask a vacation rental manager", "how to fire a property manager", "vacasa vs evolve" | Due diligence; escaping a bad manager | Evolve/AvantStay's own blogs, BiggerPockets threads | Checklists, brand-vs-brand pages | **Low — tiny volume, extreme intent** |
| F | Regulations (SD-specific) | "san diego STRO license", "tier 3 licenses remaining", "mission beach tier 4 waitlist", "airbnb rules san diego 2026" | Compliance anxiety → handoff trigger | sandiego.gov #1, then WCH/Stay Classy/insurance blogs | Year-stamped guides, tier tables | **Low-mid — position 2–5 open; freshness wins** |
| G | Taxes & finance | "san diego TOT rate airbnb", "airbnb schedule C or E", "cost segregation airbnb", "STR loophole" | Mixed; trust-building | CPA firms, mainstream press | Plain-language explainers with worked examples | High nationally; low for SD-TOT; we already have `/cost-segregation` |
| H | Operations how-to | "dynamic pricing tools", "guest screening" | Self-manager education | SaaS vendors | Tool roundups | Low priority — AEO trust content only |
| I | Revenue estimate | "how much could my home earn on airbnb", "airbnb calculator" | Lead-gen tool moment | Awning, Rabbu, AvantStay, RedAwning calculators | Interactive calculator | High for generic terms; the *tool* is table stakes locally |

**Competitive picture, condensed:**

- **West Coast Homestays** — the template and primary rival. Full owner-funnel
  library: STRO 2026 guide, TOT guide, fees explained, neighborhood revenue
  benchmarks, co-host guide, "how to fire a property manager," PB service page.
  Appeared in 8 of 17 research searches.
- **Second tier:** Stay Classy Homes, OODA Host, Titan Beach Rentals (per-
  neighborhood pages + Mission Beach waitlist post), Rakidzich (pure content
  play on "…2026" question queries).
- **Established brands ranking on service pages:** Air Concierge, Bluewater
  (closest luxury-positioning overlap), Haustay, Swell, Pacific Sands, et al.
- **Nationals:** AvantStay executes best (own listicle incl. competitors,
  neighborhood pages, calculator, switching guides). Vacasa (absorbed SeaBreeze
  2021), Evolve, Awning, MasterHost, RedAwning, iTrip.
- **Aggregators own the head terms:** Yelp category pages, RedAwning and
  Comparent listicles, BiggerPockets PM Finder.

Cardo's differentiated wedge against all of them: **luxury/design positioning +
verifiable performance data (case studies, "outperform market by up to 61%") +
2,000+ reviews + a real founder entity.** Nobody local combines proof density
with content depth; WCH has depth but not the luxury proof, Bluewater has the
positioning but not the content.

---

## 4. How AI assistants pick STR managers (evidence base)

What the 2025–26 evidence actually supports, and what it kills:

**Do (evidenced):**

- **Local SEO is the substrate.** Page-1 Google rank correlates ~0.65 with
  ChatGPT brand mentions (Seer, 10k queries); Google's local-pack top 3 are who
  AI Overviews/Gemini name. ChatGPT retrieves via Bing; Perplexity and ChatGPT
  both have **Yelp data partnerships**.
- **Listicles are the #1 cited format** (~32% of AI citations). Getting named
  in RedAwning/Comparent/onefinebnb/Yelp roundups — and publishing our own —
  is the single highest-leverage off-page move for "who should manage my
  Airbnb in San Diego."
- **Brand mentions beat backlinks ~3:1** for AI visibility (Ahrefs, 75k
  brands). Digital PR that gets Cardo *named* (even unlinked) in local press
  and STR trade press is worth more than link-building. YouTube mentions were
  the single strongest signal in that study.
- **Answer-first "chunk" writing.** RAG retrieves 100–300-word passages;
  question-formatted H2s with a 40–80-word direct answer up top win
  citations. ~44% of ChatGPT citations come from the first third of a page.
- **Stats + quotes + cited sources** in content: +30–40% citation visibility
  (Princeton GEO paper — lab conditions, but the best academic evidence).
- **Freshness is real:** AI-cited content skews markedly newer; updating
  existing pages (visible `dateModified`) beats republishing.
- **Query fan-out:** Google AI Mode decomposes "should I hire an Airbnb
  manager" into 8–16 sub-queries (cost, fees, alternatives, local rules…).
  Deep topic clusters win multiple sub-retrievals; thin single pages don't.
- **Reddit matters for advice queries** ("is a manager worth it") — ~47% of
  Perplexity's top citation share — but little for branded-local queries
  (forums are only 2% of citations there, per Yext). Authentic participation
  only.

**Skip (folklore, evidence-checked):**

- **llms.txt** — confirmed unused by Google; no engine commitment; Ahrefs
  found 97% of files get zero traffic. Skip.
- **Speakable schema** — narrow Google news beta; "flags passages for AI Mode"
  is vendor invention. Skip.
- **On-page "instructions to AI"** — no primary evidence, reputational risk.
- **Backlink-volume campaigns for AEO** — near-zero correlation; mentions win.
- Schema generally: keep it for Google/Bing-fed surfaces (high value), but
  don't expect LLMs to parse JSON-LD at inference time.

---

## 5. The funnel — from query or AI answer to a booked call

Three canonical journeys the plan must serve end-to-end:

**Journey 1 — Google, commercial intent.**
"airbnb management fees san diego" → Cardo's fees page ranks (transparent
percentage table, answer-first) → inline: "See what your home would net" →
calculator gives an instant neighborhood-benchmarked range (ungated) → the
detailed estimate + comparable case study is the conversion ask → HighLevel
consultation booking. *Every content page carries this same two-step: instant
value → book the consult.*

**Journey 2 — AI assistant, recommendation intent.**
Owner asks ChatGPT/Perplexity "who should manage my Airbnb in La Jolla?" → the
engine assembles from Yelp + listicles + local-pack + our own pages → Cardo is
named (because we're in all four sources) with the luxury/5-star framing we
seeded → owner searches "Cardo Vacation Rentals" (branded search is the #1
AI-answer aftermath) → lands on `/owners` or the La Jolla management page →
proof stack (2,000 reviews, case studies, founder) → books. *Requirement: the
branded SERP and the landing pages must instantly confirm what the AI said.*

**Journey 3 — regulatory panic.**
"mission beach tier 4 waitlist" or a TOT bill lands → Cardo's STRO hub / live
license tracker answers precisely → CTA reframes: "Your license is a scarce
asset — here's how we protect it" (compliance-guarantee angle) → consult.
*This journey converts owners who weren't even shopping for a manager.*

**Conversion-side work so all three journeys close:**

- Keep the ungated/gated split honest: calculators and answers give real value
  before any form. The form asks for the call, not just the email.
- Add **"How did you hear about us?"** (with explicit "AI assistant (ChatGPT,
  etc.)" option) to the lead form — for a booked-calls business, self-reported
  attribution will out-signal analytics (35–70% of AI referrals arrive with no
  referrer and register as Direct).
- Contextual CTAs per cluster: fees page → "get your net-income estimate";
  STRO pages → "compliance handled, license protected"; comparison pages →
  "talk to the local alternative."
- Speed-to-lead: HighLevel automation answering estimate requests within
  minutes (already partially in place — verify the follow-up sequence).

---

## 6. The plan — five workstreams

### Workstream 1 — Money pages (commercial intent, Cluster B/D/E)

| Page | Target queries | Notes |
|---|---|---|
| `/management-fees` (or `/pricing`) | "airbnb management fees san diego", "how much do managers charge" | Transparent fee philosophy + market-rate table (15–25% full service, 25–40% luxury, flat-fee models), what's included vs the industry's "mystery fees" (we already have that post). Fee transparency is a qualifier: it pre-sells the consult. |
| `/compare/vacasa-alternative`, `/compare/evolve-alternative` | "vacasa alternative san diego", "vacasa vs local manager", "[brand] reviews" | Factual, respectful brand-vs-local pages. Documented pain points (Vacasa fee levels/thin local ops; Evolve listing-ownership lock-in — leave and lose your reviews) vs Cardo's model. Unhappy national-brand owners are a named channel on BiggerPockets/Reddit. |
| `/compare/co-host-vs-manager` | "airbnb co-host vs property manager" | Differentiate via SD licensing/TOT reality; table format wins here. |
| `/compare/self-manage-vs-hire` | "self manage airbnb or hire manager", "is a manager worth it" | Honest hours-and-dollars math; include the material-participation tax nuance (below) nobody else covers. |
| `/switch` (switching managers guide) | "how to switch/fire property manager" | Tiny volume, extreme intent, almost no competition. Include transition checklist + "we handle the handover" CTA. |
| `/best-vacation-rental-management-san-diego` | "best vacation rental management companies san diego" | Our own honest listicle including competitors (the AvantStay play). Listicles are the #1 AI-cited format; owning one makes us both a ranker and a citable source. |
| Neighborhood **management** pages (7 existing areas, owner-angle) | "[la jolla] vacation rental management", "airbnb management [pacific beach]" | Either add owner-intent sections + Service schema to existing neighborhood pages or build `/management/[slug]` siblings: local reg status, revenue benchmark, a matching case study, area-specific FAQ. Then expand: Ocean Beach, Point Loma, North Park, Oceanside, Solana Beach, Cardiff — thin small-operator pages currently hold these SERPs. |

### Workstream 2 — The Owner Library (topical authority, Clusters A/F/G + fan-out depth)

Restructure content so owner authority is a tight, crawlable cluster —
`/guides/` hub (or an "Owner guides" spine within the Journal) separate from
guest content. Wave 1 (each page: question H2s, 40–80-word direct answers
first, SD-specific numbers with cited sources, visible updated-date, refreshed
on a calendar):

1. **STRO license hub** — the definitive guide: 4 tiers, costs, one-license
   rule, renewal, primary-residence rules. *Verify every figure against
   sandiego.gov before publishing* (research snapshot: T1 ≤20 days/$226, T2
   home-share/$317, T3 whole-home 1%-cap/$1,170 ~880 remaining, T4 Mission
   Beach 1,097 all issued/waitlist).
2. **STRO license availability tracker** — auto-updated from the city's open
   dataset (data.sandiego.gov/datasets/stro-licenses). Nobody has this; it's
   citable, linkable, newsworthy every time tiers tighten, and it makes the
   scarcity → "protect your license with a professional" argument for us.
3. **Mission Beach Tier 4 page** — waitlist mechanics, license-lapse
   opportunities, what happens when you sell (non-transferability!). "Buying/
   selling a home with an STRO license" is high-intent and unserved.
4. **TOT & taxes guide + zone lookup** — the May 2025 re-zoning (flat 10.5% →
   11.75/12.75/13.75% by zone + TMD) created fresh confusion and no one built
   an address→rate lookup. Pairs with existing `/cost-segregation`.
5. **"Does hiring a manager kill the STR tax loophole?"** — the material-
   participation × property-manager intersection: genuinely unserved, directly
   relevant to our sales objection-handling, and CPA-adjacent enough to earn
   citations. (Review by a CPA before publish.)
6. **San Diego revenue benchmarks by neighborhood — 2026** (annual refresh) —
   our performance data + market data, the citable stats asset that also feeds
   the PR workstream. Extends the existing "what your home could earn" post.
7. **"Is San Diego oversaturated?" / STR vs long-term rental** — top-funnel
   capture, honest data take.
8. **Annual rules refresh** — "Airbnb rules San Diego 2027" refresh of the
   existing STRO post each January, plus North County set: separate short
   pages for Coronado, Oceanside, Carlsbad, Encinitas, Del Mar rules (each has
   different regs; thin competition; supports the neighborhood pages).

### Workstream 3 — Interactive assets (Cluster I + lead-gen)

1. **Revenue calculator** — neighborhood + bedrooms + quality tier → instant
   ungated range built from our benchmark data, with "Cardo-designed homes
   outperform market by up to 61%" framing → gated: detailed estimate +
   comparable case study → consult booking. This is the site's second
   conversion engine and every content page funnels into it.
2. **STRO tracker + TOT lookup** (from Workstream 2) — smaller builds, same
   pattern: instant answer, contextual consult CTA.

### Workstream 4 — Off-site: listings, mentions, community (the 86%)

1. **Listings hardening (week 1):** Google Business Profile complete +
   review velocity; **Yelp** page claimed/active (pipes into Perplexity +
   ChatGPT directly); Bing Places verified (ChatGPT retrieves via Bing); BBB,
   TripAdvisor; NAP consistency audit across everything.
2. **Listicle/directory campaign:** run the monthly prompt audit (below), list
   every source AI engines cite for our target prompts, and get Cardo into
   each: RedAwning, Comparent, onefinebnb roundups; BiggerPockets PM Finder;
   any SD press "best of" lists.
3. **Digital PR for mentions:** pitch the neighborhood-benchmarks report and
   STRO-tracker findings to SD outlets (Union-Tribune, Voice of SD, SD
   Magazine) and STR trades (Skift, VRM Intel, Rent Responsibly). Goal is
   *named mentions*, links optional. Rich as the quotable SD-STR expert.
4. **Community presence (authentic only):** r/airbnb_hosts, r/sandiego,
   BiggerPockets forums, SD host Facebook groups — answer regulation and
   fee questions as a named expert. Wins Perplexity's advice-query surface.
5. **YouTube (phase 4):** strongest single mention signal in the Ahrefs study.
   Case-study walkthroughs + "SD STR rules explained" — repurpose, don't
   produce from scratch.

### Workstream 5 — Technical/AEO layer + measurement

1. **Schema extensions:** `Organization` with full `sameAs` (GBP, Yelp,
   Instagram, LinkedIn, directories); `Service` schema per service line with
   `areaServed`; `Person` schema for Rich (founder entity, links bylines);
   `FAQPage` wherever visible Q&A exists; `dateModified` on all guides.
   Skip llms.txt and Speakable (evidence says dead ends).
2. **Content formatting standard:** codify the answer-first pattern (question
   H2 → 40–80-word answer → depth → stat with cited source) as a template for
   every guide — this is what gets chunks retrieved.
3. **Measurement stack:**
   - GA4: custom AI channel group (chatgpt.com, perplexity.ai, gemini.google,
     copilot.microsoft) on top of the native AI Assistant channel; treat as a
     floor.
   - GSC: watch the new AI Overviews/AI Mode reports.
   - Lead form: "How did you hear about us?" incl. AI option (the real signal).
   - **Monthly manual prompt audit:** ~10 prompts ("best Airbnb manager San
     Diego," "is a manager worth it," "management fees SD," La Jolla/Del Mar
     variants) across ChatGPT, Claude, Perplexity, Gemini, AI Mode. Log who's
     named + which URLs are cited → that citation list IS the outreach list.
   - Consider Otterly.ai (~$29/mo) once Phase 2 content ships; watch OpenAI's
     self-serve Ads Manager (open beta, home-services targeting) as a paid test.

---

## 7. Phased execution plan

**Phase 0 — Foundations (weeks 1–2, small builds)**
- Listings sweep: GBP, Yelp, Bing Places, BBB, NAP audit. *(off-site, no code)*
- Schema extensions in `Base.astro` + templates (Organization sameAs, Person,
  Service, dateModified plumbing).
- GA4 AI channel group; add "How did you hear about us?" to lead form.
- Baseline prompt audit #1 (records the before-state; produces outreach list).

**Phase 1 — Money pages (weeks 2–6)**
- `/management-fees` · `/switch` · `/compare/self-manage-vs-hire` ·
  `/compare/co-host-vs-manager` · own best-of listicle.
- Owner-intent + Service schema upgrade to the 7 existing neighborhood pages.
- Journal restructure: Owner Guides spine separated from guest content.

**Phase 2 — Regulatory moat + calculator (months 2–3)**
- STRO hub, Mission Beach/Tier 4 page, TOT guide (+ zone lookup), rules
  refresh. Facts verified against sandiego.gov at publish time.
- **STRO license tracker** (open-data build — the flagship citable asset).
- **Revenue calculator v1** + neighborhood benchmarks 2026 report.
- PR push #1 riding the benchmarks report + tracker launch.

**Phase 3 — Coverage + comparisons (months 3–5)**
- Vacasa/Evolve alternative pages; material-participation tax piece (CPA-
  reviewed); oversaturation/LTR-vs-STR pieces.
- New neighborhood management pages (Ocean Beach, Point Loma, North Park,
  Oceanside, Solana Beach, Cardiff) + North County rules pages.
- Community presence cadence begins (2–3 quality answers/week).

**Phase 4 — Compounding (month 6+, ongoing cadence)**
- Quarterly refresh calendar for every guide (freshness is a ranking input).
- Annual January rules + benchmarks refresh ("…2027").
- Monthly prompt audit → listicle/directory outreach loop.
- YouTube repurposing; Otterly tracking; OpenAI Ads test if beta performs.

**Success metrics (in priority order):**
1. Booked consultations attributed to organic + AI (form field + GHL source).
2. Prompt-audit share: # of 10 target prompts where Cardo is named (baseline
   likely 0–1; target 5+ by month 6).
3. Page-1 rankings for Cluster B/D/F target terms; local-pack position.
4. Calculator completions and estimate-form starts from content pages.

---

## 8. Risks & honest caveats

- **Regulatory facts drift.** Tier counts, TOT rates, waitlist status change;
  every regulatory figure in this doc is a July 2026 research snapshot and
  must be re-verified against sandiego.gov at publish time. The refresh
  calendar is not optional — stale compliance content is a trust liability.
- **Comparison pages need legal care:** factual, sourced, no disparagement —
  documented public complaints and published fee ranges only.
- **AI volume is still small** (~3% of search traffic) — but AI-referred
  visitors convert 4–20× better, and for a high-ticket service the intent
  trade is exactly right. The work above wins classic Google either way; AEO
  rides on top of it.
- **West Coast Homestays will keep publishing.** Our edge is proof density
  (reviews, case studies, performance data) and interactive assets they don't
  have. Speed matters on the tracker and calculator — they're buildable by
  anyone.
- **Claimed metrics must be defensible:** "outperform by up to 61%" and the
  aggregateRating in schema should have a documented methodology page —
  answer engines increasingly cross-check.

---

## Appendix — research sources

Full source lists live in the two research reports this strategy synthesizes
(30+ SERP observations and the 2025–26 AEO evidence base). Keystone sources:
Yext 6.8M-citation study; Ahrefs 75k-brand mention-correlation study; Profound
30M-citation study; Seer Interactive rank↔mention correlation; Princeton GEO
paper (KDD 2024); Search Engine Land query fan-out guide; sandiego.gov STRO +
TOT pages; data.sandiego.gov STRO license dataset; competitor sites:
westcoasthomestays.com, avantstay.com, airconcierge.net, titanbeachrentals.com,
stayclassyhomes.com, oodahost.com.
