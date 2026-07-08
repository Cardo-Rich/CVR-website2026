# Design Spec: Agreements → Firebase CMS (Owner Portal, part 1)

**Date:** 2026-07-08
**Status:** Approved in brainstorming; pending spec review
**Branch:** `feat/cms-agreements` — created off `feat/cms-foundation`, then merged with `feat/brand-v3-site` so the branch carries **both** the CMS foundation (Firestore/rules/content modules/emulators) and the Supabase agreements portal to migrate. (Those two branches had diverged at the Plan-1 doc commit; neither alone had both halves.)
**Builds on:** `docs/superpowers/specs/2026-07-06-cardo-cms-foundation-design.md` (Plan 1, implemented on `feat/cms-foundation`)

## Overview

Move the Rental Management Agreement (RMA) system off **Supabase** entirely and rebuild it as the **first module of the Firebase CMS admin**, on the same Firebase backend the CMS foundation established. In doing so this work stands up three shared pieces the rest of the CMS (Plans 2/3) will reuse:

1. The **Firebase Auth layer** — Google sign-in, an admin allowlist, and the `admin: true` custom claim that Plan 1's Firestore rules already assume.
2. The **React `/admin` SPA** shell — an auth-gated single-page app hosting CMS modules; **Agreements** is its first module.
3. The **Cloud Functions backend** — a Node port of the Supabase edge function (create/list/get/sign/pdf/email), reusing the existing legal-content module, pdf-lib, and Resend.

The public marketing site stays 100% static Astro (unchanged). The owner-facing signing flow stays an anonymous tokenized link (unchanged UX).

## Goals

- Cardo staff manage agreements inside the authenticated CMS admin (Google sign-in → `admin` claim), with **no shared admin key**.
- Property owners keep signing via the same anonymous tokenized link — no login, no new friction.
- The agreements backend runs entirely on Firebase (Firestore + Cloud Functions + Storage + Secret Manager); Supabase is decommissioned.
- Existing signed agreements are migrated with their **tokens preserved**, so old signing/PDF links keep working.
- The Auth layer and `/admin` SPA shell are reusable by CMS Plans 2 (editors) and 3 (Guesty sync + publish).

## Non-Goals (this spec)

- Owner accounts / an owner-facing portal home (statements, quotes, maintenance) — owners remain anonymous-token signers. **Future direction (out of scope here):** owners will eventually get an authenticated portal that surfaces *their* agreements as dynamic data. A static owner-portal surface already exists (what `/portal`, the footer "Owner login" link, and the case-study "Go to my owner portal" CTA point at); wiring it to live agreement data is a later owner-portal spec. This spec keeps `clientEmail`/`owner.email` on every agreement as the natural join key for that future work.
- Blog / case-study / featured-property editor modules — Plan 2 adds them into this same SPA shell.
- Guesty sync + publish→rebuild — Plan 3.
- Roles/permission tiers — a single admin allowlist; all admins have full access (mirrors the CMS foundation decision).
- Changing the RMA legal content, terms, or signing UX.

## Locked decisions (from brainstorming)

1. **Owner auth:** unchanged — anonymous per-agreement token in the URL (`/agreement/?t=TOKEN`). No owner login.
2. **Staff auth:** Firebase Auth **Google** sign-in, gated to an admin allowlist; grants CMS access including agreements. No separate/second auth. Replaces the shared admin key.
3. **Packaging:** a **React `/admin` SPA** (Vite), deployed to the same Firebase Hosting under a `/admin/**` rewrite. Agreements is its first module; a React port of the current portal UI.
4. **Backend:** faithful **port** of the Supabase edge function to **Cloud Functions** (approach A). Admin actions = callable functions (verify ID token + `admin` claim); owner actions = token-guarded HTTPS/callable (public).
5. **Existing data:** real signed agreements exist and **must be migrated**, tokens preserved.
6. **First admin:** `rich@cardorentals.com`.
7. **Infra confirmed:** project `cardo-website-2026` is on the **Blaze** plan; Google provider to be enabled; the existing Resend key carries over.

## Architecture

```
Cardo staff ──Google sign-in (Firebase Auth)──► React /admin SPA ──┐
  (email in config/admins → admin:true claim)   • Agreements module │ callable fns
                                                 • (Plan 2 modules)  │ (verify ID token + admin claim)
                                                                     ▼
                                              Cloud Functions ◄────► Firestore: agreements/{token}, config/*
                                              create · list ·              Firebase Storage: executed PDFs (private)
                                              get · sign · pdf ·           Secret Manager: RESEND_API_KEY
                                              settings · setAdminClaim
                                                     ▲
Owner ──tokenized link /agreement/?t=TOKEN──► Astro signing page ──get / sign / pdf (token-guarded)──┘
  (no login — unchanged UX)
```

### Components

- **Firebase Auth (Google) + `setAdminClaim`** — a function (Auth `beforeSignIn` blocking function, or an `onCreate`/callable) that looks up the signing-in email in `config/admins`; if present, sets custom claim `admin: true`, else denies. The SPA reads the claim to gate the UI; Firestore rules and callable functions enforce it server-side.
- **React `/admin` SPA** — Vite + React app in `admin/` (in-repo), built to `dist/admin`. Firebase JS SDK (Auth). Auth-guarded shell with nav; **Agreements** module = create form (commercial terms + client + addendum), recent-agreements table (status, links, PDF), and email settings (notify/from address; Resend-key status). Client-side routing; Hosting rewrite `/admin/** → /admin/index.html`. Non-admins see an "access denied" state.
- **Cloud Functions** (`functions/`, Node) — port of `supabase/functions/agreements/index.ts`:
  - **Admin, callable** (verify `context.auth` + `admin` claim): `create`, `list`, `getSettings`, `setSettings`.
  - **Owner, token-guarded** (public; validate the 36-hex token): `get`, `sign`, `pdf`.
  - `sign` validates required fields + acks server-side, writes the signed doc, generates the executed PDF (pdf-lib), stores it in Storage, and emails owner + client + notify address via Resend.
  - Reuses the shared legal-content module and the existing `PdfWriter` logic verbatim where possible.
- **Owner signing page** (`src/pages/agreement/index.astro`) — same UI and anonymous-token flow. Changes: (a) call the new Functions endpoint instead of the Supabase URL; (b) replace the "Loading agreement…" gate card with a clean inline skeleton; (c) import the relocated shared content module.

## Firestore data model

- `agreements/{token}` — **doc id = the existing token** (preserves old links). Fields mirror `rental_agreements`:
  `{ token, status: 'sent' | 'signed', clientName, clientEmail, terms{}, addendum, owner{}, acks{}, sigName, sigDate, sigData, signedAt, createdAt, pdfPath? }`.
  `sigData` is the signature PNG data URL (as today); `pdfPath` is the Storage path of the executed PDF (set at sign/migration time). `clientEmail`/`owner.email` are retained as the future owner-portal join key (see Non-Goals).
- `config/portalSettings` — `{ notifyEmail, fromEmail, hasResendKey: boolean }`. The Resend **key value** lives in Secret Manager, never Firestore.
- `config/admins` — `{ emails: string[] }` allowlist (shared with the CMS model). Seeded with `rich@cardorentals.com`.

## Authentication & security

- **Google sign-in** only. `setAdminClaim` enforces the allowlist; only allowlisted emails receive `admin: true`.
- **Firestore rules** (extend Plan 1's `firestore.rules`):
  - `agreements/{token}`: `allow get: if true` (knowing the unguessable token == access, matching today), `allow list: if false`. **No client writes** — all writes go through functions (Admin SDK, bypasses rules). The staff list is served by the `list` callable (keeps owner PII out of broad client reads).
  - `config/portalSettings`, `config/admins`: read/write require the `admin` claim (or function-mediated).
  - Existing `articles`/`caseStudies`/`properties`/`homepage` rules unchanged.
- **Storage rules**: executed PDFs are **private** (no public read). Staff download via the SPA (authed); owners download via the token-guarded `pdf` function, which streams the stored PDF (or returns a short-lived signed URL). Extends Plan 1's `storage.rules`.
- **Secrets**: `RESEND_API_KEY` in Secret Manager, bound to the functions. No secrets in the client bundle or repo.
- Callable functions verify `context.auth.token.admin === true`; token-guarded functions validate the token shape and look up the doc.

## Shared legal-content module

`supabase/functions/agreements/content.ts` (dependency-free: `TERMS_META`, `ACKS`, `SECTIONS`, `PREAMBLE`, `BACKOUT_CALLOUT`, `FOOTER_LINE`, `richToHtml`, `richToPlain`) is **relocated** to a neutral shared path (e.g. `src/shared/agreement-content.ts`) importable by all three consumers: the Astro signing page (Vite), the React SPA, and the Node Cloud Function. It stays dependency-free so it runs in every runtime.

## Migration (one-time)

A script reads the live Supabase `rental_agreements` + `portal_settings` and writes them into Firebase:

1. For each `rental_agreements` row → `agreements/{token}` doc (same token as id), field-mapped (snake_case → camelCase). Signature data carried over as-is.
2. For each **signed** row, re-generate the executed PDF (reuse the port's PDF builder) and upload to Storage; set `pdfPath`.
3. `portal_settings` → `config/portalSettings` (notify/from email); load `resend_api_key` into Secret Manager.
4. Seed `config/admins` with `rich@cardorentals.com`.

Old signing links (`/agreement/?t=TOKEN`) and PDF links keep working because tokens are preserved and the owner page points at the new backend. Verified against the emulator/seed before touching production.

## Retiring Supabase

Once migration is verified in production:

- Delete `src/pages/portal/agreements.astro` (replaced by the SPA Agreements module).
- **Staff** now reach agreements at the new authenticated **`/admin`** SPA.
- **`/portal` stays owner-facing.** The current `/portal → /portal/agreements` redirect (which sent the owner-labeled "Owner login" link into the *staff* tool) is removed; `/portal` instead points at the existing **static owner-portal page**, a placeholder until the future owner-portal spec wires it to live agreement data. The footer "Owner login" and case-study "Go to my owner portal" links keep pointing at `/portal`. (Confirm the exact static target when implementing; do **not** send owners to `/admin`.)
- Delete `supabase/functions/agreements/index.ts` and `src/lib/portal-config.js`.
- Move `content.ts` to the shared path (above) and update the signing page's import.
- Decommission the Supabase project.

## Build & hosting integration

- The React SPA builds separately (Vite) into `dist/admin`; the Astro build continues to produce the static marketing site into `dist/`. A combined build step produces both. `firebase.json` gains a rewrite so `/admin/**` serves the SPA `index.html` (SPA client routing) while all other routes serve static Astro pages.
- Cloud Functions deploy via `firebase deploy --only functions`. Emulators (auth/firestore/storage + functions) already configured in Plan 1; add the functions emulator for local end-to-end.

## Error handling

- **Sign failures** (validation, already-signed): the function returns a clear error; the signing page shows it inline (as today). Idempotency: a signed agreement cannot be re-signed (409), matching current behavior.
- **Email failures** (Resend down/misconfigured): logged; the agreement is still created/signed; the SPA surfaces "email not sent — copy link" (as today). Signed PDF is still stored even if the email fails.
- **Auth edge cases**: non-allowlisted Google sign-in is denied by `setAdminClaim`; the SPA shows "access denied." Expired/absent ID token → re-auth.
- **Owner token invalid/not found**: the signing page shows the same "Agreement not found / link not valid" states as today.
- **PDF generation failure**: logged; sign still succeeds and records the data; PDF can be regenerated on demand by the `pdf` function.

## Testing / verification

- **Security rules** (emulator, extend `tests/rules.test.ts`): owner `get` on `agreements/{token}` succeeds; `list` denied for everyone client-side; client writes to `agreements` denied; `config/*` writable only by `admin` claim.
- **Functions** (emulator): `create` (admin only — rejects no/!admin token), `sign` (validation, PDF generated + stored, already-signed → 409), `get` (withholds owner/sig until signed), `pdf` streams stored PDF. Resend calls mocked.
- **Content parity**: the ported PDF matches the Supabase output for a fixed fixture (same sections/terms/signature).
- **Migration**: run against a Supabase snapshot into the emulator; assert doc count + tokens preserved + PDFs present.
- **End-to-end** (emulator, then preview channel): staff Google sign-in → create agreement → owner opens tokenized link → signs → PDF stored + emailed → appears signed in the SPA list.

## Dependencies (confirmed / user-provided)

- Firebase **Blaze** plan on `cardo-website-2026` — **confirmed active**.
- **Admin allowlist**: seed `rich@cardorentals.com` (more added later via `config/admins`).
- **Google provider** in Firebase Auth — enable during implementation (approved).
- **Resend API key** — reuse the existing key from Supabase `portal_settings` (migrated to Secret Manager).
- Supabase read access for the one-time migration (service role / MCP).

## Rollout

1. Stand up the Auth layer (`config/admins`, `setAdminClaim`, Google provider) + extend rules; test on emulator.
2. Port the edge function → Cloud Functions (relocate shared content; port PDF + Resend); test on emulator.
3. Build the React `/admin` SPA shell (auth guard) + Agreements module; wire to callables.
4. Repoint the owner signing page to Functions; clean up the loading gate.
5. Migrate Supabase data → Firestore/Storage/Secret Manager (dry-run on emulator, then production).
6. Verify end-to-end on the preview channel; enable for staff.
7. Retire the Supabase portal page/redirect, edge function, `portal-config.js`, and decommission the Supabase project.

## Open items to resolve in planning

- **`setAdminClaim` mechanism:** Auth blocking function (`beforeSignIn`) vs. `onCreate` trigger vs. callable "refresh claim" — pick in the plan (blocking function is cleanest for allowlist enforcement, needs Identity Platform).
- **Owner PDF delivery:** stream bytes through the `pdf` function vs. return a short-lived Storage signed URL — pick in the plan.
- **SPA packaging details:** Vite React app location (`admin/`), shared build script, and how it coexists with the Astro build in `dist/` and CI.
- **Callable vs HTTPS** for owner `get`/`sign` (no auth context): plain HTTPS with CORS mirrors today; decide in the plan.
- **Migration cutover:** brief freeze on new Supabase agreements during migration, or dual-write window — decide in the plan.
```
