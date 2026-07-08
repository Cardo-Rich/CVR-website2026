# CMS Agreements — Plan 2b: Agreements Module + Owner-Page Repoint

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Put the working agreements feature inside the `/admin` SPA (create/send, list, settings — the staff tool, on the Firebase callables) and repoint the owner signing page from Supabase to the deployed Firebase `agreements` function. After this, staff manage agreements in the CMS and owners sign via the Firebase backend — all on the branch/preview (live cutover is Plan 3).

**Architecture:** A React Agreements module mounts in the Plan-2a `/admin` shell and calls the deployed callables (`adminCreate`/`adminList`/`adminGetSettings`/`adminSetSettings`). `adminCreate` is extended to email the signing link (the Supabase "ready to sign" invite). The legal-content module is relocated to `src/shared/agreement-content.ts` (canonical for the front-end: SPA + owner page); the functions keep their drift-guarded copy. The owner page ([`src/pages/agreement/index.astro`](src/pages/agreement/index.astro)) keeps its UI + anonymous-token flow, but its API endpoint flips to the Firebase function and its loading gate is simplified.

**Tech Stack:** React 19 + Firebase JS SDK (SPA); Astro (owner page); firebase-functions v2 (adminCreate email). Same project/region as Plan 1/2a.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-08-agreements-firebase-cms-design.md`. **Predecessors:** Plan 1 (functions deployed), Plan 2a (SPA auth shell).
- **Branch:** `feat/cms-agreements` (already checked out). Do NOT branch.
- **Deployed owner endpoint:** `https://us-central1-cardo-website-2026.cloudfunctions.net/agreements`. The Supabase and Firebase functions share the SAME owner request contract (`POST {action:'get'|'sign', token, ...}`, `GET ?action=pdf&t=TOKEN`) — so repointing the owner page is a URL change, not a rewrite.
- **Callables region us-central1** (SPA `getFunctions(app,'us-central1')`, already set in Plan 2a).
- **Content single-source (front-end):** `src/shared/agreement-content.ts` is canonical for the SPA + owner page. `functions/src/content.ts` stays its own copy; a test asserts they are byte-identical. The Supabase copy (`supabase/functions/agreements/content.ts`) is deleted in Plan 3.
- **ESM `.js` extensions** still apply inside `functions/src/*.ts`.
- **No live deploy.** Redeploy functions (dormant) + refresh the preview channel only.
- **Frequent commits, review each task.**

## File Structure

- `src/shared/agreement-content.ts` — **create**: canonical front-end copy of the content module.
- `functions/test/content.test.ts` — **modify**: drift-guard now compares `functions/src/content.ts` ↔ `src/shared/agreement-content.ts`.
- `admin/vite.config.ts` — **modify**: `@shared` alias → `../src/shared`, `server.fs.allow: ['..']`.
- `admin/src/agreements/api.ts` — **create**: typed callable wrappers.
- `admin/src/agreements/AgreementsModule.tsx` — **create**: create form + list + settings.
- `admin/src/agreements/agreements.css` — **create**: module styles (reuse Plan 2a tokens).
- `admin/src/Shell.tsx` — **modify**: mount `<AgreementsModule/>` in `.main`.
- `functions/src/email.ts` — **modify**: add `signingInviteHtml(clientName, url)`.
- `functions/src/index.ts` — **modify**: `adminCreate` emails the invite (re-bind `RESEND_API_KEY`, accept `siteOrigin`).
- `src/lib/portal-config.js` — **modify**: `AGREEMENTS_API` → the Firebase function URL.
- `src/pages/agreement/index.astro` — **modify**: content import → `src/shared`; simplify the loading gate.

## Interfaces (locked signatures)

```ts
// admin/src/agreements/api.ts
export interface AgreementRow { token: string; status: 'sent'|'signed'; clientName: string|null; clientEmail: string;
  terms: Record<string,string>; createdAt: string; signedAt: string|null; sigName: string|null; }
export interface Settings { notifyEmail: string; fromEmail: string; hasResendKey: boolean; }
export async function createAgreement(input: { clientName: string; clientEmail: string;
  terms: Record<string,string>; addendum: string; siteOrigin: string }): Promise<{ token: string; url: string; emailed: boolean }>;
export async function listAgreements(): Promise<AgreementRow[]>;
export async function getSettings(): Promise<Settings>;
export async function setSettings(patch: { notifyEmail?: string; fromEmail?: string }): Promise<{ ok: true }>;

// functions/src/email.ts (added)
export function signingInviteHtml(clientName: string, url: string): string;
```

---

## Task 1: Relocate the legal-content module to `src/shared`

**Files:** Create `src/shared/agreement-content.ts`; Modify `functions/test/content.test.ts`.

- [ ] **Step 1:** `cp supabase/functions/agreements/content.ts src/shared/agreement-content.ts` (byte copy; canonical front-end copy).
- [ ] **Step 2:** Update the functions drift test so it compares the functions copy to the new canonical front-end copy. In `functions/test/content.test.ts`, change the `canonical` path from `../../supabase/functions/agreements/content.ts` to `../../src/shared/agreement-content.ts`.
- [ ] **Step 3:** Run `cd functions && npm test -- content` → PASS (both copies identical).
- [ ] **Step 4:** Commit: `git add src/shared/agreement-content.ts functions/test/content.test.ts && git commit -m "feat(cms): canonical front-end agreement-content in src/shared"`.

---

## Task 2: `adminCreate` emails the signing invite

**Files:** Modify `functions/src/email.ts`, `functions/src/index.ts`, `functions/test/email.test.ts`.

**Interfaces:** Produces `signingInviteHtml`; `adminCreate` now returns `{ token, url, emailed }` and emails the client.

- [ ] **Step 1: Add `signingInviteHtml` to `functions/src/email.ts`** (port the Supabase `actionCreate` email body — `supabase/functions/agreements/index.ts:390-396`):

```ts
export function signingInviteHtml(clientName: string, url: string): string {
  const firstName = escHtml((clientName || '').trim().split(/\s+/)[0] || 'there');
  return emailShell(`
    <h2 style="margin:0 0 14px;font-size:20px;">Hi ${firstName},</h2>
    <p style="font-size:14px;line-height:1.6;color:#3D3E47;">Your Rental Management Agreement with Cardo Vacation Rentals is ready. The key commercial terms have been filled in for you — review the agreement, complete your details, and sign online. It takes about five minutes.</p>
    <p style="margin:24px 0;"><a href="${url}" style="background:#ED3C78;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:14px 26px;border-radius:999px;display:inline-block;">Review &amp; Sign Agreement</a></p>
    <p style="font-size:13px;line-height:1.6;color:#6B6D78;">Once signed, a PDF copy is emailed to you automatically. You can cancel for any reason within 14 days of signing with no termination fee.</p>
    <p style="font-size:12px;color:#9A9CA6;">If the button doesn't work, copy this link: ${url}</p>`);
}
```

- [ ] **Step 2: Add a test** to `functions/test/email.test.ts`: `signingInviteHtml('Jane Doe','https://x/agreement/?t=abc')` contains the URL and "Hi Jane,". Run `cd functions && npm test -- email` → PASS.

- [ ] **Step 3: Update `adminCreate` in `functions/src/index.ts`** to email the invite (re-bind the secret; accept `siteOrigin` from `req.data`):

```ts
import { getSettings } from './actions.js';           // (ensure imported)
import { makeSendEmail, signingInviteHtml } from './email.js';

export const adminCreate = onCall({ secrets: [RESEND_API_KEY] }, async (req) => {
  requireAdmin(req.auth);
  let doc;
  try {
    doc = await createAgreement(getDb(), req.data);
  } catch (e) {
    if (e instanceof HttpErr && e.status === 400) throw new HttpsError('invalid-argument', e.message);
    throw e;
  }
  const origin = String(req.data?.siteOrigin || '').replace(/\/$/, '');
  const url = `${origin}/agreement/?t=${doc.token}`;
  let emailed = false;
  try {
    const settings = await getSettings(getDb());
    const send = makeSendEmail(RESEND_API_KEY.value(), settings);
    emailed = await send([doc.clientEmail], 'Your Cardo Vacation Rentals management agreement is ready to sign', signingInviteHtml(doc.clientName || '', url));
  } catch (e) { console.error('invite email failed', e); }
  return { token: doc.token, url, emailed };
});
```

- [ ] **Step 4:** `cd functions && npm run build` → tsc clean. Commit: `git add functions/src/email.ts functions/src/index.ts functions/test/email.test.ts && git commit -m "feat(cms): adminCreate emails the signing invite"`.

---

## Task 3: SPA agreements API wrappers

**Files:** Create `admin/src/agreements/api.ts`; Modify `admin/vite.config.ts`.

- [ ] **Step 1: Add the `@shared` alias + fs allow to `admin/vite.config.ts`** (so the SPA can import the shared content):

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  resolve: { alias: { '@shared': fileURLToPath(new URL('../src/shared', import.meta.url)) } },
  server: { fs: { allow: ['..'] } },
  build: { outDir: '../dist/admin', emptyOutDir: true },
});
```

- [ ] **Step 2: Create `admin/src/agreements/api.ts`** — typed `httpsCallable` wrappers (exact interfaces in "Interfaces" above):

```ts
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import type { AgreementRow, Settings } from './types';

export async function createAgreement(input: { clientName: string; clientEmail: string; terms: Record<string,string>; addendum: string; siteOrigin: string }) {
  const r = await httpsCallable<typeof input, { token: string; url: string; emailed: boolean }>(functions, 'adminCreate')(input);
  return r.data;
}
export async function listAgreements(): Promise<AgreementRow[]> {
  const r = await httpsCallable<unknown, { agreements: AgreementRow[] }>(functions, 'adminList')();
  return r.data.agreements;
}
export async function getSettings(): Promise<Settings> {
  const r = await httpsCallable<unknown, Settings>(functions, 'adminGetSettings')();
  return r.data;
}
export async function setSettings(patch: { notifyEmail?: string; fromEmail?: string }) {
  const r = await httpsCallable<typeof patch, { ok: true }>(functions, 'adminSetSettings')(patch);
  return r.data;
}
```

- [ ] **Step 3: Create `admin/src/agreements/types.ts`** with `AgreementRow` + `Settings` (from the Interfaces block).
- [ ] **Step 4:** `cd admin && npx tsc --noEmit` → clean. Commit: `git add admin/vite.config.ts admin/src/agreements && git commit -m "feat(cms): admin agreements API wrappers + @shared alias"`.

---

## Task 4: Agreements module UI (create / list / settings)

**Files:** Create `admin/src/agreements/AgreementsModule.tsx`, `admin/src/agreements/agreements.css`; Modify `admin/src/Shell.tsx`, `admin/src/main.tsx`.

**Interfaces:** Consumes the Task-3 API + `TERMS_META` from `@shared/agreement-content`.

- [ ] **Step 1: Create `admin/src/agreements/AgreementsModule.tsx`** — a React port of the create/list/settings UI in `src/pages/portal/agreements.astro` (read it for the layout). Requirements:
  - **Create form:** iterate `TERMS_META` (from `import { TERMS_META } from '@shared/agreement-content'`) to render term inputs (label, sub, prefix/suffix, default value in state); client name, client email, addendum textarea. "Create & Send Signing Link" button → `createAgreement({...terms, clientName, clientEmail, addendum, siteOrigin: window.location.origin})`; on success show the returned `url` (copyable) + whether it emailed; then refresh the list. Validate client email is non-empty before calling.
  - **Recent agreements table:** on mount + after create, `listAgreements()` → table (client, status badge, commission %, created, signed, links: Open `/agreement/?t=<token>` and, if signed, PDF `…/agreements?action=pdf&t=<token>`). Use the deployed function base for the PDF link.
  - **Email settings (collapsible):** `getSettings()` on mount → notify/from email inputs + a "Resend key on file" indicator (`hasResendKey`); "Save" → `setSettings({notifyEmail, fromEmail})`. (No Resend-key field — the key lives in Secret Manager now.)
  - Handle callable errors (e.g. `permission-denied`, `invalid-argument`) by showing the error message inline; don't crash.
- [ ] **Step 2: Create `admin/src/agreements/agreements.css`** — reuse the Plan 2a design tokens (CSS vars) for cards, term rows, table, status badges (`.status-sent`/`.status-signed`), buttons.
- [ ] **Step 3: Mount in `admin/src/Shell.tsx`** — replace the `.main` placeholder with `<AgreementsModule/>` (import it). Import `agreements.css` in `main.tsx` (or the module).
- [ ] **Step 4:** `cd admin && npx tsc --noEmit && npm run build` → clean. Render-check the module (dev server, signed-in path can't be reached without auth, so at least confirm it compiles + renders structurally via a temporary `status='admin'` bypass IF needed — but revert any bypass before commit).
- [ ] **Step 5:** Commit: `git add admin/src && git commit -m "feat(cms): agreements module (create/list/settings) in the admin SPA"`.

---

## Task 5: Repoint the owner signing page to Firebase

**Files:** Modify `src/lib/portal-config.js`, `src/pages/agreement/index.astro`.

- [ ] **Step 1: Repoint the API** — in `src/lib/portal-config.js`, change `AGREEMENTS_API` to `'https://us-central1-cardo-website-2026.cloudfunctions.net/agreements'`. (Same request contract — no other client change needed for the fetch to work.)
- [ ] **Step 2: Update the content import** — in `src/pages/agreement/index.astro`, change the import from `'../../../supabase/functions/agreements/content.ts'` to `'../../shared/agreement-content.ts'`.
- [ ] **Step 3: Simplify the loading gate** — the current gate shows a "Loading agreement…" card (`#gate`) while fetching. Keep the same states (loading / not-found / signed) but ensure the transition is clean (the sheet stays hidden until data loads; on error the not-found gate shows). No behavioral change to signing — just confirm the gate no longer flashes awkwardly (the existing `showGate`/`load()` logic is fine; verify it still works against the new endpoint).
- [ ] **Step 4: Verify the build** — `npm run build` → the `/agreement` page builds; grep the built page to confirm it references the new function URL, not Supabase. (`grep -r "cloudfunctions.net/agreements" dist/agreement/ ` returns a match; `grep -r "supabase.co" dist/agreement/` returns nothing.)
- [ ] **Step 5:** Commit: `git add src/lib/portal-config.js src/pages/agreement/index.astro && git commit -m "feat(cms): repoint owner signing page to the Firebase agreements function"`.

---

## Task 6: Redeploy functions, refresh preview, and verify

**Files:** none (deploy + verification).

- [ ] **Step 1: Redeploy the functions** (adminCreate changed):

Run: `npx firebase deploy --only functions --project cardo-website-2026`
Expected: `adminCreate` (+ unchanged others) update successfully.

- [ ] **Step 2: Build + refresh the preview channel:**

Run: `npm run build:all && npx firebase hosting:channel:deploy plan2b --project cardo-website-2026 --expires 7d`
Expected: a preview URL. The `/admin` SPA + the repointed `/agreement` page are both on it.

- [ ] **Step 3: Emulator/behavior checks** (no auth needed):
  - `cd functions && npm test` → all functions tests pass (incl. the new invite-email test).
  - `cd admin && npx tsc --noEmit` clean.
- [ ] **Step 4: HUMAN verification (needs an allowlisted Google admin + a browser)** — on the preview:
  - `/admin/` → sign in → Agreements module loads; create a test agreement (use your own email) → a signing link appears + an invite email arrives.
  - Open the signing link `/agreement/?t=<token>` → the RMA loads from Firebase → fill + sign → "Agreement Signed" + the executed PDF emails; the row flips to `signed` in the admin list; the PDF link works.
  - This exercises the full Firebase round-trip (create→email→sign→store→PDF→list).
- [ ] **Step 5:** Push the branch. Report the checkpoint + preview URL. Do NOT deploy live (Plan 3 cutover).

---

## Self-Review

**Spec coverage:** Agreements module in the SPA (create/list/settings) — Tasks 3–4 ✓; `adminCreate` emails the signing link (spec "Publish/create → email") — Task 2 ✓; owner page on Firebase, gate simplified (spec "remove the loading/gate page; owner page on Firebase") — Task 5 ✓; content single-source — Task 1 ✓. **Deferred to Plan 3 (correct):** migrate real Supabase agreements, retire the Supabase page/function/config, delete the Supabase content copy, production cutover.

**Placeholder scan:** Task 4 Step 1 describes the UI against a concrete reference file (`portal/agreements.astro`) with exact API calls — the one component whose full JSX isn't inlined; the implementer ports it from the named source. Everything else is concrete.

**Type consistency:** `AgreementRow`/`Settings` defined in Task 3 (`types.ts`) consumed by Task 4. `createAgreement` return `{token,url,emailed}` matches the Task-2 `adminCreate` return. `signingInviteHtml` (Task 2) is the only email addition.

**Risk notes:** (1) the SPA's `@shared` import of the content module must bundle in the Vite build — Task 3 adds the alias + `fs.allow`. (2) The owner-page repoint means agreements created via the OLD Supabase portal won't resolve on the new endpoint — acceptable because staff switch to `/admin`, and existing signed agreements are migrated in Plan 3 before live cutover. (3) Full verification (Task 6.4) needs a human admin — autonomous runs stop at build/emulator checks + the redeploy.
