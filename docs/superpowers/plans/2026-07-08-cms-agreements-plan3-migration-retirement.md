# CMS Agreements — Plan 3: Migration + Supabase Retirement

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Provide a tested one-time migration that copies the live Supabase agreements + settings into Firestore/Storage (tokens preserved), and retire the dead Supabase code from the repo. After this, the only remaining live-cutover actions are the human checklist (run the migration, seed admins, add authorized domain, merge to main).

**Architecture:** A migration **core** (`functions/src/migrate.ts`, pure — takes rows + injected `db`/`bucket`) is emulator-tested; a thin **CLI** (`functions/scripts/migrate.ts`) fetches the real rows from Supabase and calls the core with the Admin SDK. `agreements/{token}` docs keep their Supabase token as the id (so old signing links resolve); signed agreements get their executed PDF re-generated into Storage. Retirement deletes the Supabase staff page + edge-function source and repoints the `/portal` redirect.

**Tech Stack:** firebase-admin + pdf-lib (functions), `@supabase/supabase-js` + `tsx` (migration CLI, dev-only), Firebase emulator (test). Supabase project ref `yyfckfuzoutmdwconrnm`.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-08-agreements-firebase-cms-design.md`. **Predecessors:** Plans 1/2a/2b.
- **Branch:** `feat/cms-agreements` (already checked out). Do NOT branch.
- **Live data (verified 2026-07-08):** `rental_agreements` has **3 rows (1 signed, 2 sent)**; all tokens are 36 hex chars (match `^[0-9a-f]{20,}$`, so they resolve on Firebase). `portal_settings` id=1: `notify_email='rich@cardorentals.com'`, `from_email='Cardo Vacation Rentals <onboarding@resend.dev>'`, **no** resend key.
- **No owner PII / signatures in git.** The migration reads Supabase **live** at run time; do NOT export the data into a committed file.
- **Idempotent:** doc id = token, `.set()` overwrites — safe to re-run.
- **Field casing:** snake_case (Supabase) → camelCase (Firestore).
- **The production migration RUN and the live cutover (merge to main) are HUMAN steps** — this plan delivers tested code + the checklist, and does the safe repo retirement on the branch. Do NOT run the prod migration or merge to main autonomously.
- **ESM `.js`** in `functions/src`.

## File Structure

- `functions/package.json` — **modify**: add devDeps `@supabase/supabase-js`, `tsx`.
- `functions/src/migrate.ts` — **create**: `SupabaseRow`, `toAgreementDoc`, `migrateAgreements` (core).
- `functions/src/actions.ts` — **modify**: `export` the `BucketLike` interface (reused by migrate).
- `functions/scripts/migrate.ts` — **create**: the CLI (Supabase fetch → core). Dev-only, not deployed.
- `functions/test/migrate.test.ts` — **create**: emulator test of the core.
- `src/pages/portal/agreements.astro` — **delete** (dead Supabase staff page; staff use `/admin`).
- `supabase/` — **delete** (the edge-function `index.ts` + `content.ts`; nothing imports them after the owner-page repoint).
- `astro.config.mjs` — **modify**: repoint the `/portal` redirect (target page is being deleted).
- `docs/superpowers/CUTOVER-CHECKLIST.md` — **create**: the human go-live checklist.

## Interfaces (locked signatures)

```ts
// functions/src/actions.ts  (change: add `export`)
export interface BucketLike { file(path: string): { save(data: Buffer, opts?: unknown): Promise<unknown>; download(): Promise<Buffer[]> }; }

// functions/src/migrate.ts
export interface SupabaseRow {
  token: string; status: string; client_name: string | null; client_email: string;
  terms: Record<string, string>; addendum: string | null; owner: Record<string, string> | null;
  acks: Record<string, boolean> | null; sig_name: string | null; sig_date: string | null;
  sig_data: string | null; signed_at: string | null; created_at: string;
}
export function toAgreementDoc(r: SupabaseRow): AgreementDoc;
export async function migrateAgreements(
  rows: SupabaseRow[], settings: { notifyEmail: string; fromEmail: string },
  db: Firestore, bucket: BucketLike,
): Promise<{ migrated: number; pdfs: number }>;
```

---

## Task 1: Migration core + emulator test

**Files:** Modify `functions/src/actions.ts` (export `BucketLike`); Create `functions/src/migrate.ts`, `functions/test/migrate.test.ts`.

- [ ] **Step 1: Export `BucketLike`** — in `functions/src/actions.ts`, add `export` to the existing `interface BucketLike { ... }` (currently unexported). No other change.

- [ ] **Step 2: Create `functions/src/migrate.ts`**

```ts
import type { Firestore } from 'firebase-admin/firestore';
import { buildPdf } from './pdf.js';
import type { AgreementDoc } from './types.js';
import type { BucketLike } from './actions.js';

export interface SupabaseRow {
  token: string; status: string; client_name: string | null; client_email: string;
  terms: Record<string, string>; addendum: string | null; owner: Record<string, string> | null;
  acks: Record<string, boolean> | null; sig_name: string | null; sig_date: string | null;
  sig_data: string | null; signed_at: string | null; created_at: string;
}

export function toAgreementDoc(r: SupabaseRow): AgreementDoc {
  return {
    token: r.token, status: r.status === 'signed' ? 'signed' : 'sent',
    clientName: r.client_name, clientEmail: r.client_email, terms: r.terms || {}, addendum: r.addendum,
    owner: r.owner, acks: r.acks, sigName: r.sig_name, sigDate: r.sig_date, sigData: r.sig_data,
    signedAt: r.signed_at, createdAt: r.created_at, pdfPath: null,
  };
}

export async function migrateAgreements(
  rows: SupabaseRow[], settings: { notifyEmail: string; fromEmail: string },
  db: Firestore, bucket: BucketLike,
): Promise<{ migrated: number; pdfs: number }> {
  let pdfs = 0;
  for (const r of rows) {
    const doc = toAgreementDoc(r);
    if (doc.status === 'signed') {
      try {
        const pdf = await buildPdf(doc);
        doc.pdfPath = `agreements/${doc.token}/executed.pdf`;
        await bucket.file(doc.pdfPath).save(Buffer.from(pdf), { contentType: 'application/pdf', resumable: false });
        pdfs++;
      } catch (e) { console.error('pdf regen failed for', doc.token, e); }
    }
    await db.doc(`agreements/${doc.token}`).set(doc); // token preserved as doc id
  }
  await db.doc('config/portalSettings').set({ notifyEmail: settings.notifyEmail, fromEmail: settings.fromEmail }, { merge: true });
  return { migrated: rows.length, pdfs };
}
```

- [ ] **Step 3: Create `functions/test/migrate.test.ts`** (emulator; in-memory bucket stub — mirrors actions.test.ts):

```ts
import { beforeEach, describe, it, expect } from 'vitest';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { migrateAgreements, toAgreementDoc, type SupabaseRow } from '../src/migrate';

function db() { if (!getApps().length) initializeApp({ projectId: 'demo-agreements' }); return getFirestore(); }
const files: Record<string, Buffer> = {};
const bucket = { file: (p: string) => ({ save: async (b: Buffer) => { files[p] = b; }, download: async () => [files[p]] }) };

const rows: SupabaseRow[] = [
  { token: 'a'.repeat(36), status: 'signed', client_name: 'Jane Owner', client_email: 'jane@example.com',
    terms: { commissionPct: '20' }, addendum: null, owner: { fullName: 'Jane A. Owner', homeAddress: '123 Ocean', email: 'jane@example.com' },
    acks: { ackConsult: true }, sig_name: 'Jane A. Owner', sig_date: '2026-06-20', sig_data: 'data:image/png;base64,iVBORw0KGgo=',
    signed_at: '2026-06-20T10:00:00Z', created_at: '2026-06-19T10:00:00Z' },
  { token: 'b'.repeat(36), status: 'sent', client_name: 'Bob', client_email: 'bob@example.com',
    terms: {}, addendum: null, owner: null, acks: null, sig_name: null, sig_date: null, sig_data: null, signed_at: null, created_at: '2026-07-01T10:00:00Z' },
];

beforeEach(async () => {
  const base = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/demo-agreements/databases/(default)/documents`;
  await fetch(base, { method: 'DELETE' }).catch(() => {});
  for (const k of Object.keys(files)) delete files[k];
});

describe('migrateAgreements (emulator)', () => {
  it('maps snake_case → camelCase, preserving the token as id', () => {
    const d = toAgreementDoc(rows[0]);
    expect(d.token).toBe(rows[0].token);
    expect(d.clientName).toBe('Jane Owner');
    expect(d.sigData).toBe(rows[0].sig_data);
  });
  it('writes docs under their token, regenerates the PDF only for signed', async () => {
    const res = await migrateAgreements(rows, { notifyEmail: 'rich@cardorentals.com', fromEmail: 'X <onboarding@resend.dev>' }, db(), bucket);
    expect(res).toEqual({ migrated: 2, pdfs: 1 });
    const signed = (await db().doc(`agreements/${rows[0].token}`).get()).data()!;
    expect(signed.status).toBe('signed');
    expect(signed.pdfPath).toBe(`agreements/${rows[0].token}/executed.pdf`);
    expect(files[`agreements/${rows[0].token}/executed.pdf`]).toBeInstanceOf(Buffer);
    const sent = (await db().doc(`agreements/${rows[1].token}`).get()).data()!;
    expect(sent.status).toBe('sent');
    expect(sent.pdfPath).toBeNull();
    const cfg = (await db().doc('config/portalSettings').get()).data()!;
    expect(cfg.notifyEmail).toBe('rich@cardorentals.com');
  });
});
```

- [ ] **Step 4: Build + test** — `cd functions && npm run build` (tsc clean), then (Java 21 on PATH):
  `export JAVA_HOME=/c/Users/rich8/AppData/Local/Java/jdk-21.0.11+10; export PATH=$JAVA_HOME/bin:$PATH; cd C:/Dev/CVR-website2026; npx firebase emulators:exec --only firestore,storage --project demo-agreements "cd functions && npm test -- migrate"`
  Expected: both migrate tests pass.

- [ ] **Step 5: Commit** — `git add functions/src/migrate.ts functions/src/actions.ts functions/test/migrate.test.ts && git commit -m "feat(cms): agreement migration core (supabase→firestore) + emulator test"`.

---

## Task 2: Migration CLI

**Files:** Modify `functions/package.json`; Create `functions/scripts/migrate.ts`.

- [ ] **Step 1: Add dev deps** — `cd functions && npm install -D @supabase/supabase-js tsx` (dev-only — the CLI is never deployed).

- [ ] **Step 2: Create `functions/scripts/migrate.ts`**

```ts
// One-time migration: Supabase rental_agreements + portal_settings → Firestore/Storage.
// Run at cutover with BOTH credential sets in env:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (read the source)
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa.json (or ADC)  (write prod Firestore/Storage)
// Usage: cd functions && npx tsx scripts/migrate.ts [--dry]
import { createClient } from '@supabase/supabase-js';
import { getDb, getBucket } from '../src/db.js';
import { migrateAgreements, type SupabaseRow } from '../src/migrate.js';

const dry = process.argv.includes('--dry');
const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

const sb = createClient(url, key);
const { data: rows, error } = await sb.from('rental_agreements').select('*');
if (error) { console.error('Supabase read failed:', error.message); process.exit(1); }
const { data: settingsRow } = await sb.from('portal_settings').select('notify_email, from_email').eq('id', 1).single();
const settings = { notifyEmail: settingsRow?.notify_email ?? '', fromEmail: settingsRow?.from_email ?? '' };

console.log(`Read ${rows!.length} agreements (${rows!.filter((r: any) => r.status === 'signed').length} signed).`);
if (dry) { console.log('--dry: not writing. Sample tokens:', rows!.map((r: any) => r.token).join(', ')); process.exit(0); }

const res = await migrateAgreements(rows as SupabaseRow[], settings, getDb(), getBucket());
console.log(`Migrated ${res.migrated} agreements, regenerated ${res.pdfs} PDF(s), wrote config/portalSettings.`);
```

- [ ] **Step 3: Verify it compiles / dry-run parses** — `cd functions && npx tsc --noEmit` (the script is outside `src`, so also run `npx tsx --check scripts/migrate.ts` if available, or at least confirm `tsc` on src passes). Do NOT run it against prod here (no creds; it's a cutover step).
- [ ] **Step 4: Commit** — `git add functions/package.json functions/package-lock.json functions/scripts/migrate.ts && git commit -m "feat(cms): supabase→firestore migration CLI (run at cutover)"`.

---

## Task 3: Retire the Supabase code

**Files:** Delete `src/pages/portal/agreements.astro`, `supabase/`; Modify `astro.config.mjs`.

- [ ] **Step 1: Confirm nothing imports the Supabase sources** — `grep -rn "supabase/functions" src/` should return NOTHING (the owner page was repointed to `src/shared` in Plan 2b; `portal/agreements.astro` is the only remaining importer and is being deleted). If anything else shows up, STOP and report.
- [ ] **Step 2: Delete the dead files** — `git rm src/pages/portal/agreements.astro && git rm -r supabase/`. (`src/lib/portal-config.js` STAYS — it now holds the Firebase endpoint used by the owner signing page.)
- [ ] **Step 3: Repoint the `/portal` redirect** — in `astro.config.mjs`, change `redirects: { '/portal': '/portal/agreements' }` to `redirects: { '/portal': '/owners' }` and update the comment to: `// /portal is the owner-login entry. Interim: send it to the owners page until the authenticated owner portal ships (owners currently sign via emailed tokenized links). Staff use /admin.` **(JUDGMENT CALL — flag for the user: the "Owner login" footer link + case-study CTA now land on /owners; revisit when the real owner portal exists.)**
- [ ] **Step 4: Build** — `npm run build` → succeeds; `grep -rn "supabase" src/ | grep -v node_modules` returns nothing (all Supabase references gone from `src/`). `ls supabase 2>/dev/null` → not found.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "chore(cms): retire Supabase staff page + edge function; /portal → /owners (interim)"`.

---

## Task 4: Cutover checklist + phase verification

**Files:** Create `docs/superpowers/CUTOVER-CHECKLIST.md`.

- [ ] **Step 1: Write `docs/superpowers/CUTOVER-CHECKLIST.md`** — the ordered human steps to go live (see content below).
- [ ] **Step 2: Full local verification** — functions suite (emulator) all pass incl. migrate; `build:all` produces `dist/` + `dist/admin/`; `grep -rn "supabase" src/` empty.
- [ ] **Step 3: Refresh the preview channel** — `npm run build:all && npx firebase hosting:channel:deploy plan3 --project cardo-website-2026 --expires 7d`.
- [ ] **Step 4: Commit + push.** Report the final checkpoint. Do NOT merge to main.

**`CUTOVER-CHECKLIST.md` content (ordered — do NOT reorder 3 before 2):**
1. **Seed prod `config/admins`** (Firestore console → `config/admins` → `emails: ['rich@cardorentals.com']`). Verify sign-in on the preview reaches the admin shell.
2. **Run the migration** (before the owner page goes live): `cd functions` with `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `GOOGLE_APPLICATION_CREDENTIALS` set → `npx tsx scripts/migrate.ts --dry` then without `--dry`. Confirm 3 agreements + config/portalSettings in Firestore, 1 PDF in Storage.
3. **Merge `feat/cms-agreements` → main** (triggers the live deploy of the static site incl. the repointed owner page + the `/admin` SPA). Only after step 2.
4. **Add the production custom domain** (cardorentals.com) to Firebase Auth → Authorized domains (else `signInWithPopup` fails on it).
5. **Set a verified Resend from-address** — update `config/portalSettings.fromEmail` (and ensure the `RESEND_API_KEY` secret is a valid key for a verified domain) so invite/executed emails actually send (the Supabase default `onboarding@resend.dev` only delivers to the Resend account owner).
6. **Smoke test live:** open an existing migrated signing link (`/agreement/?t=<token>`) → loads from Firebase; create a new agreement in `/admin` → invite emails → sign → executed PDF emails + row flips to signed.
7. **Decommission Supabase** (pause/delete project `yyfckfuzoutmdwconrnm`) once the live smoke test passes.

---

## Self-Review

**Spec coverage:** Migration of real agreements with tokens preserved + PDFs regenerated (spec "Migration") — Tasks 1–2 ✓; Supabase retirement (delete staff page + edge function; keep the shared content) (spec "Retiring Supabase") — Task 3 ✓; cutover documented — Task 4 ✓.

**Placeholder scan:** none — the migration core/CLI/test are concrete; the retirement deletions are explicit; the checklist is ordered with the migrate-before-cutover dependency called out.

**Type consistency:** `SupabaseRow`/`toAgreementDoc`/`migrateAgreements` defined in Task 1, consumed by the Task-2 CLI. `BucketLike` (exported from actions.ts) reused by migrate. `AgreementDoc` shape matches what the owner page + admin list read.

**Risk notes:** (1) migration writes prod Firestore — requires Admin creds; it's a human cutover step, not run here. (2) The `/portal → /owners` repoint is a judgment call flagged for the user. (3) `functions/scripts/migrate.ts` uses top-level `await` (ESM, Node 20+ ok via tsx). (4) The migration is idempotent (token = id), so a re-run after a partial failure is safe.
