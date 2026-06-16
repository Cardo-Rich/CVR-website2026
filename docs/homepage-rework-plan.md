# Cardo Homepage Rework Plan — Owner Acquisition Front Page

> Strategic frame: **one audience** (property owners), **one persona**
> (luxury / second-home owners), **one job** (book a free property analysis).
> Guest booking is demoted off the main funnel. Every decision below serves that.

## Decisions locked (from owner input, 2026-06-16)

- **Primary homepage goal:** owner acquisition only. Guest "Book a Stay" leaves the
  main funnel and moves to its own page; it stays in the nav.
- **Persona to write for:** luxury / second-home owners. Lead with trust, care of a
  home they love, and peace of mind — money is the proof, not the hook.
- **Proof we can use now:** real owner testimonials, our own photography, real
  (even anonymized) earnings/case data, and our true guest-review count.
  **We are NOT currently a Superhost — that claim must not appear anywhere.**

---

## Phase 0 — Truth & compliance ✅ (done in this PR)

These were live claims on a site bound to a real, paying business — liability, not polish.

| # | Issue | Where | Fix applied |
|---|---|---|---|
| 0.1 | "5-star Superhost" claim (we're not one) | `index.astro`, `site-config.js`, `blog/index.astro` | Removed every "Superhost." Replaced with the defensible "trusted with San Diego homes since 2013 · 2,000+ five-star guest reviews." |
| 0.2 | Fabricated + conflicting rating schema (`4.9 / 180` vs `2,000+`) | `index.astro` Service schema | Removed the second `aggregateRating`. Single source of truth is the `LodgingBusiness` schema in `Layout.astro`, driven by real `COMPANY` figures. |
| 0.3 | "Here's the receipts" + specific gains shown as actuals | `index.astro` results section | Reframed as explicitly **illustrative/modeled** until real case data lands (Phase 3). |
| 0.4 | Booking widget in `demo: true` | `site-config.js` `BOOKING` | Leaving the homepage in Phase 1; do not ship a demo widget publicly. |

---

## Phase 1 — Refocus homepage on ONE audience (owners) ✅ (done)

- Removed the guest "Book a Stay" section + inline `BookingWidget` from `index.astro`.
- Guest booking now lives in a **global "Book direct" modal** (`BookingModal.astro`)
  launched from a header **"Book now"** button (desktop), the mobile nav, and the
  footer — keeping the homepage body owner-focused.
- The modal dims the site and pairs the search widget with three direct-booking
  value props (save 10% direct, guest damage protection, flexible cancellation).
- Homepage funnel is now single-intent: Hero → Trust strip → Why owners switch →
  Proof → Design showcase → How it works → Transparency → Testimonials →
  Neighborhoods → Final CTA + lead form.

## Phase 2 — Reposition for the luxury / second-home owner

- Keep the "cared for, not managed" hero — it already speaks to this buyer.
- Tune subhead toward the emotional driver (immaculate home, guests looked after,
  no 11pm call) over raw yield. (Started in Phase 0 hero copy.)
- Make **in-house design + white-glove care under one roof** the spine of the page —
  it's the moat the nationals (Vacasa/Evolve) structurally can't copy.
- Add a "your home, protected" angle: inspections, vetted vendors, dashboard framed
  as peace of mind, not just transparency.

## Phase 3 — Replace placeholder proof with real proof

- Swap all Unsplash images in `site-config.js` for Cardo's own photography.
- Replace the four illustrative `CASE_STUDIES` with real (anonymized OK) homes +
  true numbers; restore a confident "real homes, real numbers" headline.
- Replace invented testimonials with named, consented owner quotes (+ face photos).
- Add a founder/team section with real faces — "in-house team" is the differentiator.

## Phase 4 — Conversion mechanics

- Cut `LeadForm` required fields to name + email + neighborhood; defer the rest.
- Surface the phone number in the header + sticky mobile CTA bar.
- Strengthen risk reversal near every CTA (no setup fees; cancel-anytime / "we don't
  earn until you do" if offerable).
- Standardize the CTA verb on "Get your free property analysis."

## Phase 5 — Measurement

- Lead + phone-click analytics events on submit.
- A/B hero headline and CTA label once traffic justifies it.
- Track lead → consult → signed owner, not just form fills.

---

**Sequencing:** Phase 0 (this PR) → Phase 1 (structural) → Phase 3 as real assets
arrive → Phases 2 & 4 copy/UX in parallel.
