# Design Spec: Cardo CMS — Foundation + Content Management

**Date:** 2026-07-06
**Status:** Approved in brainstorming; pending spec review
**Scope:** The shared Firebase foundation + the content-management app (blog, case studies, Guesty-synced featured properties). The **owner portal** is a separate, later spec built on this same backend.

## Overview

Add a Firebase-backed CMS so Cardo's internal team can create/edit **blog posts** and **case studies**, and choose the **featured properties** on the home page (selected from their real Guesty listings) — without editing code. The public marketing site stays a fully static Astro build; publishing content triggers a rebuild so changes go live in ~1–2 minutes.

This is the **foundation** both the CMS and the future owner portal sit on: Firebase Auth, a Firestore data model, Firebase Storage, and a small set of Cloud Functions.

## Goals

- Internal editors manage blog posts + case studies through a login-gated admin UI (structured fields + rich-text body + image upload), with Draft/Published states.
- Featured home-page properties are chosen and ordered from the team's **Guesty** listings, synced automatically.
- Publishing regenerates the static site automatically; the public site remains 100% static (fast, cheap, no server).
- The backend is reusable by the future owner portal.

## Non-Goals (this spec)

- The **owner portal** (agreements, quotes, onboarding, maintenance, approvals) — separate spec, same backend.
- **Neighborhood** pages become CMS-managed — they stay static for now.
- **Roles/permissions tiers** — all admins have full edit+publish access (small internal team).
- **Property detail pages** on the marketing site — featured cards link to each property's Guesty booking URL.
- Migrating other content (home hero, journal, testimonials, site.ts) into the CMS — the data model is built to extend, but only blog/case-studies/featured-properties are in scope now.

## Locked decisions (from brainstorming)

1. **Update model:** rebuild-on-publish. Content lives in Firestore; the static site pulls *published* content at build time and regenerates on publish.
2. **Shared backend:** Firestore + Firebase Auth, reusable by the portal.
3. **Editors:** small internal team, single access tier (allowlist), all can edit + publish.
4. **CMS scope:** blog posts, case studies, and featured-property selection.
5. **Properties:** synced from **Guesty** (source of truth); the CMS selects/orders featured ones, it does not author properties.
6. **Admin UI:** a React single-page app at `/admin`; the public marketing site stays vanilla Astro, untouched.

## Architecture

```
Guesty API ──(scheduled + on-demand)──► [Cloud Function: guesty-sync] ──► Firestore: properties
                                                                              │
Internal editor ──login──► [Admin SPA /admin] ──read/write──► Firestore: articles, caseStudies, homepage
   (Firebase Auth)              (Firebase JS SDK, client-side)     Firebase Storage (images)
                                       │
                                  "Publish" ──► [Cloud Function: trigger-rebuild] ──► GitHub repository_dispatch
                                                                                              │
                                                                                    [Deploy workflow]
                                                                                    npm run build
                                                                                      │  (Admin SDK reads
                                                                                      │   published content +
                                                                                      │   featured properties)
                                                                                      ▼
                                                                              Static Astro site → Firebase Hosting
```

**Components:**

- **Firestore** — content + config store (collections below).
- **Firebase Auth** — email/password (or email-link) login; access gated to an allowlist.
- **Firebase Storage** — blog/case-study image uploads.
- **Admin SPA** (`/admin`) — React, client-side Firebase SDK (Auth + Firestore + Storage). Isolated from the marketing site; loads only on `/admin`. Client-side routing; a Firebase Hosting rewrite serves `/admin/**` → the SPA.
- **Cloud Function `guesty-sync`** — holds Guesty API credentials (server-side secret), pulls listings, upserts into `properties`. Scheduled (daily) + callable on-demand ("Sync now", admin-only).
- **Cloud Function `trigger-rebuild`** — admin-only callable; fires a GitHub `repository_dispatch` (using a stored GitHub token) to run the existing deploy workflow. Debounced so rapid publishes coalesce.
- **Build-time content fetch** — the Astro build reads *published* `articles`/`caseStudies` and the ordered featured `properties` from Firestore via the Firebase Admin SDK (reusing the CI service account) and generates pages exactly as the current static build does.

## Firestore data model

- `articles/{id}` — mirrors the current `Article` type (slug, title, category, excerpt, readTime, dateFull, dateShort, img, featured, seo, author, heroCaption, bodyHtml) **plus** `status: 'draft' | 'published'`, `createdAt`, `updatedAt`, `publishedAt`.
- `caseStudies/{id}` — mirrors the current `CaseStudy` type (slug, name, neighborhood, beds, date, hook, seo, cardImg, gallery, story, stats, scope, scopeTotal, contactTitle) **plus** the same status/timestamp fields.
- `properties/{guestyId}` — synced from Guesty: `{ guestyId, name, neighborhood, beds, baths, guests, photos[], bookingUrl, active, syncedAt }`. Read-only in the CMS (owned by the sync).
- `homepage/featured` — `{ propertyIds: string[], updatedAt }` — the ordered set of featured property IDs for the home carousel (each may carry a `premier` flag; store as `[{ id, premier }]`).
- `config/admins` — `{ emails: string[] }` allowlist (mirrored into security rules / custom claims — see Auth).
- `config/build` — `{ lastTriggeredAt, lastStatus }` for debounce + status display.

Slugs remain the routing key for articles/case-studies; the build maps published docs → `/blog/<slug>` and `/case-studies/<slug>`.

## Authentication & security

- Firebase Auth (email). On sign-in, the app checks the user's email against the admin allowlist; non-admins are rejected.
- **Firestore security rules**: reads of `articles`/`caseStudies`/`properties`/`homepage` are open **only** to authenticated admins for the *editing* surface; the public site reads via the Admin SDK at build (bypasses rules). Writes to all collections require an admin (allowlist via custom claim `admin: true`, set by a Cloud Function when an allowlisted user first signs in, or checked against `config/admins`). `properties` is writable **only** by the sync function (no client writes).
- Cloud Functions `guesty-sync` (on-demand) and `trigger-rebuild` are **callable** functions that verify `context.auth` + admin claim.
- Secrets (Guesty credentials, GitHub token) live in Cloud Functions config / Secret Manager — never in the client bundle.

## Rich text & media

- The article body is authored in a **rich-text editor** (e.g. TipTap/Lexical) that outputs HTML into `bodyHtml`; the build renders it with `set:html` (as today). HTML is **sanitized** on save (allowlist of tags) so stored `bodyHtml` is safe to inline.
- Images: uploaded to Firebase Storage from the editor; the returned public URL is stored in the relevant field (`img`, `gallery[]`, or inline in `bodyHtml`).

## Build integration & migration

- The current `src/data/blog.ts` and `src/data/case-studies.ts` become the **initial seed**: a one-time migration script writes their entries into Firestore (`status: 'published'`).
- The build's `getStaticPaths` for `/blog/[slug]`, `/case-studies/[slug]`, and the home featured carousel switch from importing the static arrays to a small **content module** that fetches from Firestore (Admin SDK) when credentials are present, and **falls back to the committed seed data** (or the Firebase emulator) for local dev without credentials. This keeps `npm run build` working offline and preserves the current output shape.
- Featured home cards: built from `homepage/featured` → resolve each `propertyId` in `properties` → render the carousel (name, photo, specs, premier badge, Guesty booking URL).

## Guesty sync

- `guesty-sync` authenticates to the Guesty API with stored credentials, pages through the account's listings, maps each to the `properties` shape, and upserts (marking missing ones `active: false`). Records `syncedAt`.
- Runs on a daily schedule and on the CMS "Sync now" button. It does **not** trigger a rebuild by itself; featured selection/publish does.
- Guesty credentials are a **dependency the user provides**; the exact API (Open API / OAuth2) and endpoints are finalized at implementation.

## Publish → rebuild flow

1. Editor sets an article/case-study to **Published**, or edits the featured-properties order, then hits **Publish**.
2. The app calls `trigger-rebuild` (admin-only). The function debounces (coalesces rapid publishes within a short window) and fires a GitHub `repository_dispatch`.
3. The deploy workflow runs `npm run build` (Admin SDK pulls published content + featured properties from Firestore) and deploys `dist/` to Firebase Hosting.
4. Changes are live in ~1–2 minutes. The CMS shows build status from `config/build`.

## Error handling

- **Guesty sync failure:** logged; last good `properties` data remains; CMS surfaces a "last synced" timestamp + error state on the Properties view.
- **Build/deploy failure:** `trigger-rebuild` records status; the CMS shows the last build result and a link to the workflow run; previously deployed site stays live.
- **Missing/unpublished content:** the build only includes `status: 'published'` docs; drafts never reach the public site.
- **Auth edge cases:** non-allowlisted sign-ins are rejected client-side and by rules; the SPA shows an "access denied" state.

## Testing / verification

- Security rules tested with the Firebase emulator (admin can write, non-admin cannot, public/anon cannot write; `properties` writable only by the sync identity).
- Guesty sync tested against sandbox/credentials with a mapping unit test (Guesty listing → `properties` doc).
- Build integration tested by pointing the build at the emulator/seed and confirming `/blog`, `/case-studies`, and the home carousel render identically to today.
- End-to-end: edit → publish → rebuild triggers → site updates (verified on the preview channel).
- No unit-test runner exists in the repo today; add a light test setup (emulator + a runner) for the functions/rules as part of implementation.

## Dependencies (user-provided)

- **Guesty API credentials** (client id/secret or API key) — for the sync function.
- **GitHub token** with `repository_dispatch` scope — for `trigger-rebuild` (stored server-side).
- Confirmation of the **admin email allowlist** (who logs into the CMS).
- Firebase project `cardo-website-2026` already exists; enable Auth, Firestore, Storage, Functions.

## Rollout

1. Stand up Firebase (Auth, Firestore, Storage, Functions, rules).
2. Seed Firestore from the current `src/data/*.ts`.
3. Switch the build to Firestore-with-seed-fallback (no visible change to the site).
4. Ship the admin SPA (auth + blog/case-study editors + properties/featured).
5. Wire Guesty sync + publish/rebuild.
6. Verify end-to-end on the preview channel, then enable for the team.

## Future (separate specs)

- **Owner portal** on this backend (external owner auth, portal collections).
- CMS-managing more content (neighborhoods, home hero/journal/testimonials).
- Roles/permissions tiers; property detail pages.

## Open items to resolve in planning

- Admin SPA packaging: Astro client-only island vs. a dedicated Vite app in-repo (both deploy to the same Firebase Hosting). Decide in the plan.
- Rich-text editor choice (TipTap vs Lexical) and the HTML sanitizer allowlist.
- Whether local dev uses the Firebase emulator or the committed seed as the build fallback (likely both: emulator for CMS dev, seed for offline site builds).
