# SEO/AEO Phase 0 — off-site checklist (things the code can't do)

Companion to `docs/seo-aeo-strategy.md` §7 Phase 0. The code side of Phase 0
(schema extensions, Service schema, lead-form attribution field) ships in the
same PR that adds this file. Everything below happens in external dashboards
and needs Rich (or someone with the accounts) — each item is a one-time setup
unless marked recurring.

The NAP (name / address / phone) every listing must match exactly:

> **Cardo Vacation Rentals**
> 3633 Camino Del Rio S, Ste 101, San Diego, CA 92108
> (619) 719-5282 · cardorentals.com

(That's also what the site's LocalBusiness schema now publishes. If any of it
is wrong or changes, fix `src/layouts/Base.astro` in the same breath.)

## 1. Listings layer (highest AEO leverage — Yelp feeds Perplexity + ChatGPT directly)

- [ ] **Google Business Profile** — claim/verify; complete every field
      (category: Property management company; services; hours; photos;
      service areas = the 7 neighborhoods). Start a steady review-ask cadence:
      every happy owner interaction ends with a GBP review link.
- [ ] **Yelp** — claim the [existing page](https://www.yelp.com/biz/cardo-vacation-rentals-san-diego);
      complete services/photos/hours; respond to all reviews (15 today).
      Yelp data is piped into Perplexity (Fusion API) and ChatGPT — this
      listing is effectively an AI data feed now, not just a review site.
- [ ] **Bing Places** — verify (free). ChatGPT retrieval runs through Bing's
      index; this is cheap insurance.
- [ ] **BBB, TripAdvisor** — create/claim with the exact NAP above.
- [ ] **BiggerPockets Property Manager Finder** — get Cardo listed
      (biggerpockets.com/ca/san-diego/property-managers).
- [ ] **NAP consistency audit** — search `"Cardo Vacation Rentals"` and the
      phone number; fix every stale address/phone (old offices, Birdeye,
      directory scrapes like Wheree, the legacy Webflow site
      cardo-furnished-rentals.webflow.io — take it down or canonical it).

## 2. Analytics & attribution

- [ ] **GA4 custom channel group "AI Assistants"** — Admin → Data settings →
      Channel groups → create group matching source contains any of:
      `chatgpt.com`, `chat.openai.com`, `perplexity.ai`, `gemini.google.com`,
      `copilot.microsoft.com`, `claude.ai`. (GA4's native "AI Assistant"
      channel catches some of this; the custom group is the belt-and-braces.)
      Treat the numbers as a floor — a large share of AI referrals arrive
      with no referrer and land in Direct.
- [ ] **HighLevel** — confirm the new `Heard: …` contact tags appear on test
      leads (submit the owners estimate form once with the AI option chosen).
      Build a simple smartlist/report by those tags — that's the real
      AI-attribution dashboard.
- [ ] **Google Search Console** — check the AI Overviews / AI Mode
      performance reports monthly once content ships.

## 3. Baseline prompt audit (recurring — monthly, ~30 min)

Run these 10 prompts in ChatGPT, Claude, Perplexity, Gemini, and Google
AI Mode. Log: (a) which companies get named, (b) which URLs get cited.
The cited URLs are the outreach target list for the listicle campaign
(strategy §6, Workstream 4). Keep results in a running sheet so month-over-
month movement is visible.

1. Who should manage my Airbnb in San Diego?
2. Best vacation rental management companies in San Diego
3. Best Airbnb property manager in La Jolla
4. How much do Airbnb property managers charge in San Diego?
5. Is hiring an Airbnb property manager worth it?
6. Airbnb co-host vs property manager — which do I need?
7. San Diego STRO license — how do I get one and what does it cost?
8. How much could my Pacific Beach house earn on Airbnb?
9. Vacasa alternatives in San Diego
10. What happens to my San Diego STR license when I sell my house?

Expected baseline: Cardo named in 0–1 of 10. Strategy target: 5+ by month 6.

## 4. Branded-SERP cleanup — stale booking portals (takedowns)

Searching "Cardo Vacation Rentals" surfaces booking sites from past PMS
platforms that Cardo no longer controls. They pollute the branded SERP that
owners (and AI assistants doing entity verification) see, they show stale
inventory under our name, and they can even take bookings. Known offenders
(July 2026):

| Site | What it is | Who controls it |
|---|---|---|
| `cardo.guestybookings.com` | Old Guesty booking portal, property pages indexed | **Guesty** (platform subdomain, not the old PM company) |
| `cardorentals.hostify.com` | Old Hostify booking portal | **Hostify** (platform subdomain) |
| `cardo-vacation-rentals.wheree.com` | Directory scrape | Wheree |
| `cardo-furnished-rentals.webflow.io` | Legacy Webflow site | Possibly still ours — check the old Webflow account first |

Key insight: the subdomains belong to the **PMS platforms**, not to the old
management companies who won't cooperate. Platforms have abuse/brand channels
and no incentive to defend a churned account's stale portal.

Escalation ladder, in order:

- [ ] **Webflow site**: check whether the old Webflow account is still
      accessible (it was Cardo's own) — if so, just unpublish it. Done.
- [ ] **Platform brand complaint** (Guesty + Hostify support/legal): the site
      uses the "Cardo Vacation Rentals" name and brand without authorization,
      the account holder no longer manages these properties, and live booking
      pages under our name create consumer confusion and booking risk.
      Request the portal be disabled or the brand name removed. Include proof
      you're Cardo (email from cardorentals.com, business license).
- [ ] **DMCA takedown** if the portals show Cardo-owned photography (they
      almost certainly do): a copyright notice to the platform's designated
      agent is the fastest lever there is — platforms process DMCA on a clock.
      Inventory which photos are ours first.
- [ ] **Trademark angle**: if "Cardo Vacation Rentals" is registered (check —
      if not, a registration is worth it for exactly this), platforms respond
      much faster to trademark complaints. Common-law rights still work in
      the complaint even unregistered.
- [ ] **After any page comes down**: submit the dead URLs to Google's
      [Remove Outdated Content tool](https://search.google.com/search-console/remove-outdated-content)
      so the SERP entry disappears instead of lingering for weeks.
- [ ] **Wheree + other scrapes**: removal-request via their listed contact;
      low priority — they rank below the real profiles once GBP/Yelp/LinkedIn
      are strong.
- [ ] **Fallback = suppression**: if a platform stalls, the parallel fix is
      owning the branded SERP — site, GBP, Yelp, LinkedIn, Instagram,
      Facebook, press mentions all outranking the stale portals. That work is
      sections 1–3 of this checklist and Workstream 4 of the strategy; it
      happens anyway.

## 5. Not doing (on purpose)

- **llms.txt / Speakable schema** — no engine uses them (see strategy §4).
- **Wikipedia page** — won't pass notability for a local SMB; revisit only
  after real press coverage exists.
- **Paid citation trackers** (Otterly ~$29/mo) — hold until Phase 2 content
  ships; the manual audit above is enough signal until then.
