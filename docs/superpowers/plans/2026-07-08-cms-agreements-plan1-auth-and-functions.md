# CMS Agreements — Plan 1: Firebase Auth + Cloud Functions Backend

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Firebase backend for the Rental Management Agreement (RMA) system — a Cloud Functions port of the Supabase edge function (create/list/get/sign/pdf/settings), plus the Google-sign-in admin-claim layer — all emulator-tested. No admin UI and no owner-page changes yet (those are Plan 2).

**Architecture:** A new `functions/` package (firebase-functions v2, TypeScript) holds the agreements API. Owner actions (`get`/`sign`/`pdf`) are a public, token-guarded HTTPS function that mirrors today's request contract. Staff actions (`create`/`list`/`getSettings`/`setSettings`) and a `bootstrapAdmin` claim-setter are callable functions that require a Firebase ID token with the `admin: true` custom claim. PDF generation (pdf-lib) and email (Resend) are ported verbatim; the Resend key moves to Secret Manager. Pure action/pdf/content logic is decoupled from the function wrappers so it can be unit-tested against the Firebase emulator.

**Tech Stack:** firebase-functions v2, firebase-admin, pdf-lib, Resend (via `fetch`), Firebase Secret Manager, vitest (in `functions/`), Firebase emulators (auth/firestore/storage/functions). Project `cardo-website-2026` (Blaze).

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-08-agreements-firebase-cms-design.md`.
- **Branch:** `feat/cms-agreements` (already checked out; carries both the CMS foundation and the Supabase agreements portal). Do NOT create a new branch.
- **Firebase project:** `cardo-website-2026` (in `.firebaserc`), on the **Blaze** plan.
- **Node:** functions runtime **Node 20**; repo runs Node 22.
- **No secrets in the repo or any client bundle.** `RESEND_API_KEY` lives only in Secret Manager (and the emulator env for local tests). Never in Firestore, never committed.
- **Owner trust model:** knowing the unguessable per-agreement token (36 hex chars = 18 random bytes) is the owner's sole credential — unchanged from today. All agreement reads/writes are mediated by Cloud Functions (Admin SDK); **no client reads or writes `agreements/*` directly** (this is safer than, and supersedes, the spec's `allow get: if true` note — every read is shaped server-side, withholding owner/signature data until signed).
- **Admin identity:** Firebase Auth Google sign-in; `admin: true` custom claim granted only to emails in `config/admins`. First admin: `rich@cardorentals.com`.
- **Field casing:** Firestore docs use **camelCase** (the Supabase Postgres columns were snake_case; map on port).
- **Do not touch** `src/pages/agreement/index.astro`, `src/pages/portal/agreements.astro`, or the live Supabase function in this plan. The owner page is repointed in Plan 2; Supabase is retired in Plan 3. The legal-content module is *copied* here and de-duplicated in Plan 3.
- **TDD, frequent commits.** Every task ends green and committed.

## File Structure

- `functions/package.json` — **create**: functions package (deps, scripts, Node 20 engine).
- `functions/tsconfig.json` — **create**.
- `functions/.gitignore` — **create**: ignore `lib/`, `node_modules/`.
- `functions/src/content.ts` — **create**: copy of `supabase/functions/agreements/content.ts` (drift-guarded by a test; canonical copy relocates in Plan 3).
- `functions/src/types.ts` — **create**: `AgreementDoc`, `PortalSettings`, `PublicAgreementView`.
- `functions/src/pdf.ts` — **create**: `buildPdf(doc)` — port of the `PdfWriter`/`buildPdf` in `supabase/functions/agreements/index.ts`.
- `functions/src/email.ts` — **create**: `sendEmail`, `escHtml`, `emailShell` — port of the Resend helpers.
- `functions/src/db.ts` — **create**: guarded `admin.initializeApp`; `getDb()`, `getBucket()`.
- `functions/src/actions.ts` — **create**: `newToken`, `getSettings`, `createAgreement`, `getAgreementPublic`, `signAgreement`, `listAgreements`, `setSettings` — pure logic (deps injected), no `firebase-functions` import.
- `functions/src/claims.ts` — **create**: `resolveAdmin(db, email)` allowlist check.
- `functions/src/index.ts` — **create**: the deployed functions (HTTPS `agreements`; callables `adminCreate`/`adminList`/`adminGetSettings`/`adminSetSettings`/`bootstrapAdmin`); binds the `RESEND_API_KEY` secret.
- `functions/test/*.test.ts` — **create**: emulator-backed vitest suites.
- `firebase.json` — **modify**: add `functions` block + emulator `functions` port.
- `firestore.rules` — **modify**: add `agreements/{token}` (deny all client access).
- `storage.rules` — **modify**: add private `agreements/**` PDF path.
- `tests/rules.test.ts` — **modify**: assert agreements client access denied.
- `scripts/seed-admins.ts` — **create**: seed `config/admins` with the first admin.

## Interfaces (locked signatures)

```ts
// functions/src/types.ts
export interface AgreementDoc {
  token: string;
  status: 'sent' | 'signed';
  clientName: string | null;
  clientEmail: string;
  terms: Record<string, string>;
  addendum: string;
  owner: Record<string, string> | null;
  acks: Record<string, boolean> | null;
  sigName: string | null;
  sigDate: string | null;
  sigData: string | null;   // signature PNG data URL
  signedAt: string | null;  // ISO
  createdAt: string;        // ISO
  pdfPath: string | null;   // Storage path of the executed PDF
}
export interface PortalSettings { notifyEmail: string; fromEmail: string; }
export interface PublicAgreementView {
  status: 'sent' | 'signed';
  clientName: string | null;
  clientEmail: string;
  terms: Record<string, string>;
  addendum: string;
  owner: Record<string, string> | null;   // null until signed
  acks: Record<string, boolean> | null;    // null until signed
  sigName: string | null;
  sigDate: string | null;
  sigData: string | null;                  // null until signed
  signedAt: string | null;
}

// functions/src/db.ts
export function getDb(): FirebaseFirestore.Firestore;
export function getBucket(): import('firebase-admin/storage').Storage extends never ? never : any; // Storage bucket

// functions/src/actions.ts   (deps injected — no firebase-functions import)
export function newToken(): string;                                             // 36 hex chars
export async function getSettings(db: Firestore): Promise<PortalSettings>;
export async function createAgreement(db: Firestore, input: {
  clientName?: string; clientEmail: string; terms?: Record<string, string>; addendum?: string;
}): Promise<AgreementDoc>;
export async function getAgreementPublic(db: Firestore, token: string): Promise<PublicAgreementView>;
export async function signAgreement(
  db: Firestore, bucket: any, token: string,
  input: { owner: Record<string,string>; acks: Record<string,boolean>; sigName: string; sigDate: string; sigData: string },
  sendMail: (to: string[], subject: string, html: string, attachments?: { filename: string; content: string }[]) => Promise<boolean>,
): Promise<{ signedAt: string; emailed: boolean }>;
export async function listAgreements(db: Firestore): Promise<Array<Pick<AgreementDoc,
  'token'|'status'|'clientName'|'clientEmail'|'terms'|'createdAt'|'signedAt'|'sigName'>>>;
export async function setSettings(db: Firestore, patch: Partial<PortalSettings>): Promise<void>;

// functions/src/claims.ts
export async function resolveAdmin(db: Firestore, email: string | undefined): Promise<boolean>;

// functions/src/email.ts
export function escHtml(s: string): string;
export function emailShell(inner: string): string;
export function makeSendEmail(apiKey: string | undefined, settings: PortalSettings):
  (to: string[], subject: string, html: string, attachments?: { filename: string; content: string }[]) => Promise<boolean>;

// functions/src/pdf.ts
export async function buildPdf(doc: AgreementDoc): Promise<Uint8Array>;
```

---

## Task 1: Scaffold the `functions/` package and wire the emulator

**Files:** Create `functions/package.json`, `functions/tsconfig.json`, `functions/.gitignore`; Modify `firebase.json`.

**Interfaces:** Produces the package + emulator config every later task builds on.

- [ ] **Step 1: Create `functions/package.json`**

```json
{
  "name": "functions",
  "type": "module",
  "private": true,
  "engines": { "node": "20" },
  "main": "lib/index.js",
  "scripts": {
    "build": "tsc",
    "test": "vitest run"
  },
  "dependencies": {
    "firebase-admin": "^14.1.0",
    "firebase-functions": "^6.4.0",
    "pdf-lib": "^1.17.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "typescript": "^5.6.0",
    "vitest": "^4.1.10"
  }
}
```

- [ ] **Step 2: Create `functions/tsconfig.json`**

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "outDir": "lib",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `functions/.gitignore`**

```
lib/
node_modules/
```

- [ ] **Step 4: Extend `firebase.json`** — add a `functions` block and an emulator port (keep the existing `hosting`, `firestore`, `storage`, `emulators` blocks; add the two shown lines):

```jsonc
// add as a top-level key:
"functions": { "source": "functions", "codebase": "default" },
// inside "emulators", add:
"functions": { "port": 5001 }
```

- [ ] **Step 5: Install deps**

Run: `cd functions && npm install`
Expected: installs firebase-functions, firebase-admin, pdf-lib, vitest, typescript without error.

- [ ] **Step 6: Verify the functions emulator boots**

Run: `npx firebase emulators:start --only functions,firestore,auth,storage --project cardo-website-2026` (Ctrl-C after "All emulators ready"; the functions codebase will report no functions yet — that's fine, it must not error on config).
Expected: emulators start, functions codebase `default` loads with 0 functions, no config error.

- [ ] **Step 7: Commit**

```bash
git add functions/package.json functions/tsconfig.json functions/.gitignore functions/package-lock.json firebase.json
git commit -m "feat(agreements): scaffold Cloud Functions package + emulator wiring"
```

---

## Task 2: Port the legal-content module into `functions/`

**Files:** Create `functions/src/content.ts`, `functions/test/content.test.ts`.

**Interfaces:** Produces `TERMS_META`, `ACKS`, `SECTIONS`, `PREAMBLE`, `BACKOUT_CALLOUT`, `FOOTER_LINE`, `richToPlain` (consumed by `pdf.ts`, `actions.ts`). This is a byte-for-byte copy of `supabase/functions/agreements/content.ts`; a test guards against drift until Plan 3 de-duplicates.

- [ ] **Step 1: Copy the content module**

Run: `cp supabase/functions/agreements/content.ts functions/src/content.ts`
(The module is dependency-free plain TS; it needs no edits to run under Node/TS.)

- [ ] **Step 2: Write the drift-guard test** — `functions/test/content.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

describe('content module parity', () => {
  it('matches the canonical Supabase content module byte-for-byte', () => {
    const here = readFileSync(new URL('../src/content.ts', import.meta.url), 'utf8');
    const canonical = readFileSync(new URL('../../supabase/functions/agreements/content.ts', import.meta.url), 'utf8');
    expect(here).toBe(canonical);
  });
});
```

- [ ] **Step 3: Run the test**

Run: `cd functions && npm test -- content`
Expected: PASS (files identical).

- [ ] **Step 4: Commit**

```bash
git add functions/src/content.ts functions/test/content.test.ts
git commit -m "feat(agreements): port legal-content module into functions (drift-guarded)"
```

---

## Task 3: PDF builder

**Files:** Create `functions/src/types.ts`, `functions/src/pdf.ts`, `functions/test/pdf.test.ts`.

**Interfaces:** Produces `AgreementDoc`/`PortalSettings`/`PublicAgreementView` (types) and `buildPdf(doc): Promise<Uint8Array>` (consumed by `actions.signAgreement` and the `pdf` HTTPS handler).

- [ ] **Step 1: Create `functions/src/types.ts`** — exactly the `AgreementDoc`, `PortalSettings`, `PublicAgreementView` interfaces from the "Interfaces (locked signatures)" block above.

- [ ] **Step 2: Create `functions/src/pdf.ts` by porting the existing builder.**

Port the `INK/BODY/MUTED/PINK/GREEN` constants, `sanitize`, the `PdfWriter` class, and the `buildPdf` function from `supabase/functions/agreements/index.ts:110-339` **verbatim**, with exactly these adaptations:
  1. Imports: `import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';` and `import { SECTIONS, ACKS, TERMS_META, PREAMBLE, BACKOUT_CALLOUT, FOOTER_LINE, richToPlain } from './content';` and `import type { AgreementDoc } from './types';`.
  2. Change `buildPdf(row: AgreementRow)` → `buildPdf(doc: AgreementDoc)` and replace the snake_case field reads with the camelCase `AgreementDoc` fields: `row.terms`→`doc.terms`, `row.owner`→`doc.owner`, `row.acks`→`doc.acks`, `row.addendum`→`doc.addendum`, `row.sig_data`→`doc.sigData`, `row.sig_name`→`doc.sigName`, `row.sig_date`→`doc.sigDate`, `row.signed_at`→`doc.signedAt`, `row.client_email`→`doc.clientEmail`.
  3. Delete the local `AgreementRow` interface (use `AgreementDoc`).
  4. Keep everything else (layout, fonts, section rendering) identical.

- [ ] **Step 3: Write `functions/test/pdf.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { buildPdf } from '../src/pdf';
import type { AgreementDoc } from '../src/types';

const signed: AgreementDoc = {
  token: 'a'.repeat(36), status: 'signed',
  clientName: 'Jane Owner', clientEmail: 'jane@example.com',
  terms: { commissionPct: '20', startupFee: '500', lockSyncFee: '190' },
  addendum: 'None.',
  owner: { fullName: 'Jane A. Owner', homeAddress: '123 Ocean View Dr', email: 'jane@example.com' },
  acks: { ackConsult: true }, sigName: 'Jane A. Owner', sigDate: '2026-07-08',
  sigData: null, signedAt: '2026-07-08T12:00:00.000Z', createdAt: '2026-07-08T11:00:00.000Z', pdfPath: null,
};

describe('buildPdf', () => {
  it('produces a non-empty PDF starting with the %PDF header', async () => {
    const bytes = await buildPdf(signed);
    expect(bytes.length).toBeGreaterThan(1000);
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-');
  });
});
```

- [ ] **Step 4: Run**

Run: `cd functions && npm test -- pdf`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add functions/src/types.ts functions/src/pdf.ts functions/test/pdf.test.ts
git commit -m "feat(agreements): port PDF builder to functions"
```

---

## Task 4: Email (Resend) + DB init support modules

**Files:** Create `functions/src/email.ts`, `functions/src/db.ts`, `functions/test/email.test.ts`.

**Interfaces:** Produces `makeSendEmail`/`escHtml`/`emailShell` (consumed by `index.ts` wrappers and injected into `actions`), and `getDb`/`getBucket` (consumed by `index.ts`).

- [ ] **Step 1: Create `functions/src/email.ts`** — port `escHtml`, `emailShell`, and the Resend `sendEmail` from `supabase/functions/agreements/index.ts:93-104` and `:66-91`, wrapped in a factory that closes over the key + settings:

```ts
import { FOOTER_LINE } from './content';
import type { PortalSettings } from './types';

export function escHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
export function emailShell(inner: string): string {
  return `<div style="background:#EDEAE2;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#0E1528;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;border:1px solid #e2dfd6;">
      ${inner}
      <p style="margin:28px 0 0;font-size:12px;color:#9A9CA6;">${FOOTER_LINE}</p>
    </div>
  </div>`;
}
export function makeSendEmail(apiKey: string | undefined, settings: PortalSettings) {
  return async (
    to: string[], subject: string, html: string,
    attachments: { filename: string; content: string }[] = [],
  ): Promise<boolean> => {
    if (!apiKey) return false;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: settings.fromEmail || 'Cardo Vacation Rentals <onboarding@resend.dev>',
        to, subject, html,
        attachments: attachments.length ? attachments : undefined,
      }),
    });
    if (!res.ok) { console.error('Resend error', res.status, await res.text()); return false; }
    return true;
  };
}
```

- [ ] **Step 2: Create `functions/src/db.ts`**

```ts
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function ensureApp() { if (!getApps().length) initializeApp(); }
export function getDb() { ensureApp(); return getFirestore(); }
export function getBucket() { ensureApp(); return getStorage().bucket(); }
```

- [ ] **Step 3: Write `functions/test/email.test.ts`** (pure helpers + the no-key path — no network):

```ts
import { describe, it, expect } from 'vitest';
import { escHtml, emailShell, makeSendEmail } from '../src/email';

describe('email helpers', () => {
  it('escapes HTML', () => { expect(escHtml('<b>&"')).toBe('&#60;b&#62;&#38;&#34;'); });
  it('wraps content in the shell', () => { expect(emailShell('<p>hi</p>')).toContain('<p>hi</p>'); });
  it('returns false when no API key is configured', async () => {
    const send = makeSendEmail(undefined, { notifyEmail: '', fromEmail: '' });
    expect(await send(['x@y.com'], 's', '<p>h</p>')).toBe(false);
  });
});
```

- [ ] **Step 4: Run**

Run: `cd functions && npm test -- email`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add functions/src/email.ts functions/src/db.ts functions/test/email.test.ts
git commit -m "feat(agreements): email (Resend) + db/storage init modules"
```

---

## Task 5: Agreement actions + emulator tests

**Files:** Create `functions/src/actions.ts`, `functions/test/actions.test.ts`.

**Interfaces:** Consumes `content`, `pdf.buildPdf`, `types`. Produces `newToken`, `getSettings`, `createAgreement`, `getAgreementPublic`, `signAgreement`, `listAgreements`, `setSettings` (consumed by `index.ts`). All are pure (Firestore/bucket/mailer injected) so they test against the emulator.

- [ ] **Step 1: Create `functions/src/actions.ts`**

```ts
import { randomBytes } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';
import { TERMS_META, ACKS } from './content';
import { buildPdf } from './pdf';
import type { AgreementDoc, PortalSettings, PublicAgreementView } from './types';

export function newToken(): string { return randomBytes(18).toString('hex'); } // 36 hex chars

export async function getSettings(db: Firestore): Promise<PortalSettings> {
  const snap = await db.doc('config/portalSettings').get();
  const d = snap.data() as Partial<PortalSettings> | undefined;
  return { notifyEmail: d?.notifyEmail ?? '', fromEmail: d?.fromEmail ?? '' };
}

export async function setSettings(db: Firestore, patch: Partial<PortalSettings>): Promise<void> {
  const clean: Partial<PortalSettings> = {};
  if (typeof patch.notifyEmail === 'string') clean.notifyEmail = patch.notifyEmail.trim();
  if (typeof patch.fromEmail === 'string') clean.fromEmail = patch.fromEmail.trim();
  if (Object.keys(clean).length) await db.doc('config/portalSettings').set(clean, { merge: true });
}

export async function createAgreement(
  db: Firestore,
  input: { clientName?: string; clientEmail: string; terms?: Record<string, string>; addendum?: string },
): Promise<AgreementDoc> {
  const clientEmail = String(input.clientEmail || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clientEmail)) throw new HttpErr('A valid client email is required', 400);
  const terms: Record<string, string> = {};
  for (const m of TERMS_META) {
    const raw = String(input.terms?.[m.key] ?? m.default).trim();
    terms[m.key] = raw === '' ? m.default : raw;
  }
  const doc: AgreementDoc = {
    token: newToken(), status: 'sent',
    clientName: String(input.clientName || '').trim() || null,
    clientEmail, terms, addendum: String(input.addendum || ''),
    owner: null, acks: null, sigName: null, sigDate: null, sigData: null,
    signedAt: null, createdAt: new Date().toISOString(), pdfPath: null,
  };
  await db.doc(`agreements/${doc.token}`).set(doc);
  return doc;
}

async function getDoc(db: Firestore, token: string): Promise<AgreementDoc> {
  if (!token || token.length < 20) throw new HttpErr('Invalid link', 404);
  const snap = await db.doc(`agreements/${token}`).get();
  if (!snap.exists) throw new HttpErr('Agreement not found', 404);
  return snap.data() as AgreementDoc;
}

export async function getAgreementPublic(db: Firestore, token: string): Promise<PublicAgreementView> {
  const d = await getDoc(db, token);
  const signed = d.status === 'signed';
  return {
    status: d.status, clientName: d.clientName, clientEmail: d.clientEmail,
    terms: d.terms, addendum: d.addendum,
    owner: signed ? d.owner : null, acks: signed ? d.acks : null,
    sigName: d.sigName, sigDate: d.sigDate, sigData: signed ? d.sigData : null, signedAt: d.signedAt,
  };
}

export async function signAgreement(
  db: Firestore, bucket: any, token: string,
  input: { owner: Record<string, string>; acks: Record<string, boolean>; sigName: string; sigDate: string; sigData: string },
  sendMail: (to: string[], subject: string, html: string, attachments?: { filename: string; content: string }[]) => Promise<boolean>,
): Promise<{ signedAt: string; emailed: boolean }> {
  const d = await getDoc(db, token);
  if (d.status === 'signed') throw new HttpErr('This agreement has already been signed.', 409);
  const owner = input.owner || {}, acks = input.acks || {};
  const sigName = String(input.sigName || '').trim();
  const sigData = String(input.sigData || '');
  const missing: string[] = [];
  if (!owner.fullName?.trim()) missing.push('full legal name');
  if (!owner.homeAddress?.trim()) missing.push('managed property address');
  if (!owner.email?.trim()) missing.push('email address');
  if (!sigName) missing.push('typed signature');
  if (!sigData.startsWith('data:image/png;base64,')) missing.push('drawn signature');
  for (const ack of ACKS) if (ack.required && !acks[ack.key]) missing.push('all acknowledgements');
  if (missing.length) throw new HttpErr('Please complete: ' + [...new Set(missing)].join(', ') + '.', 400);

  const signedAt = new Date().toISOString();
  const signed: AgreementDoc = {
    ...d, status: 'signed', owner, acks, sigName,
    sigDate: String(input.sigDate || '').trim(), sigData, signedAt,
  };
  // Executed PDF → Storage
  let pdfPath: string | null = null;
  try {
    const pdf = await buildPdf(signed);
    pdfPath = `agreements/${token}/executed.pdf`;
    await bucket.file(pdfPath).save(Buffer.from(pdf), { contentType: 'application/pdf', resumable: false });
  } catch (e) { console.error('pdf/store failed', e); }
  await db.doc(`agreements/${token}`).set({ ...signed, pdfPath }, { merge: true });

  // Notify (best-effort)
  let emailed = false;
  try {
    const settings = await getSettings(db);
    let attachments: { filename: string; content: string }[] = [];
    if (pdfPath) {
      const [buf] = await bucket.file(pdfPath).download();
      attachments = [{ filename: 'Cardo-Rental-Management-Agreement.pdf', content: buf.toString('base64') }];
    }
    const recipients = [...new Set([owner.email.trim(), d.clientEmail, settings.notifyEmail].filter(Boolean))];
    emailed = await sendMail(
      recipients,
      `Signed: Rental Management Agreement — ${owner.homeAddress}`,
      `<h2>Agreement signed ✓</h2><p>${sigName} executed the Rental Management Agreement for ${owner.homeAddress}.</p>`,
      attachments,
    );
  } catch (e) { console.error('post-sign email failed', e); }
  return { signedAt, emailed };
}

export async function listAgreements(db: Firestore) {
  const snap = await db.collection('agreements').orderBy('createdAt', 'desc').limit(50).get();
  return snap.docs.map((s) => {
    const d = s.data() as AgreementDoc;
    return { token: d.token, status: d.status, clientName: d.clientName, clientEmail: d.clientEmail,
      terms: d.terms, createdAt: d.createdAt, signedAt: d.signedAt, sigName: d.sigName };
  });
}

export class HttpErr extends Error { constructor(msg: string, public status: number) { super(msg); } }
```

*(Note: `HttpErr.status` is mapped to HTTP/callable error codes by the wrappers in Task 7. The full `create`/`sign` notification email bodies are kept minimal here; the richer marketing HTML from the Supabase function is reintroduced in Plan 2 when the SPA sends the initial "ready to sign" email — this plan's create path does not email, matching "create" moving to the callable in Plan 2.)*

- [ ] **Step 2: Write `functions/test/actions.test.ts`** (runs against the Firestore emulator; `getDb` reads `FIRESTORE_EMULATOR_HOST`):

```ts
import { beforeEach, describe, it, expect } from 'vitest';
import { initializeApp, getApps, deleteApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createAgreement, getAgreementPublic, signAgreement, listAgreements, setSettings, getSettings } from '../src/actions';

function db() {
  if (!getApps().length) initializeApp({ projectId: 'demo-agreements' });
  return getFirestore();
}
// Minimal in-memory bucket stub (Storage emulator not required for action logic)
const files: Record<string, Buffer> = {};
const bucket = { file: (p: string) => ({
  save: async (b: Buffer) => { files[p] = b; },
  download: async () => [files[p]],
}) };
const noMail = async () => false;

beforeEach(async () => {
  const base = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/demo-agreements/databases/(default)/documents`;
  await fetch(base, { method: 'DELETE' }).catch(() => {});
});

describe('agreement actions (emulator)', () => {
  it('creates a sent agreement with a 36-hex token and defaulted terms', async () => {
    const d = await createAgreement(db(), { clientEmail: 'jane@example.com', clientName: 'Jane' });
    expect(d.status).toBe('sent');
    expect(d.token).toMatch(/^[0-9a-f]{36}$/);
    expect(d.terms.commissionPct).toBeTruthy();
  });

  it('rejects an invalid client email', async () => {
    await expect(createAgreement(db(), { clientEmail: 'nope' } as any)).rejects.toThrow(/valid client email/);
  });

  it('withholds owner/signature until signed', async () => {
    const d = await createAgreement(db(), { clientEmail: 'jane@example.com' });
    const view = await getAgreementPublic(db(), d.token);
    expect(view.status).toBe('sent');
    expect(view.owner).toBeNull();
  });

  it('signs, stores a PDF, and flips status', async () => {
    const d = await createAgreement(db(), { clientEmail: 'jane@example.com' });
    const res = await signAgreement(db(), bucket, d.token, {
      owner: { fullName: 'Jane A. Owner', homeAddress: '123 Ocean View Dr', email: 'jane@example.com' },
      acks: Object.fromEntries((await import('../src/content')).ACKS.filter(a => a.required).map(a => [a.key, true])),
      sigName: 'Jane A. Owner', sigDate: '2026-07-08', sigData: 'data:image/png;base64,iVBORw0KGgo=',
    }, noMail);
    expect(res.signedAt).toBeTruthy();
    const view = await getAgreementPublic(db(), d.token);
    expect(view.status).toBe('signed');
    expect(view.owner?.fullName).toBe('Jane A. Owner');
  });

  it('refuses to re-sign', async () => {
    const d = await createAgreement(db(), { clientEmail: 'jane@example.com' });
    const args = { owner: { fullName: 'J', homeAddress: 'X', email: 'j@e.com' },
      acks: Object.fromEntries((await import('../src/content')).ACKS.filter(a => a.required).map(a => [a.key, true])),
      sigName: 'J', sigDate: '2026-07-08', sigData: 'data:image/png;base64,iVBORw0KGgo=' };
    await signAgreement(db(), bucket, d.token, args, noMail);
    await expect(signAgreement(db(), bucket, d.token, args, noMail)).rejects.toThrow(/already been signed/);
  });

  it('lists agreements and round-trips settings', async () => {
    await createAgreement(db(), { clientEmail: 'a@b.com' });
    expect((await listAgreements(db())).length).toBeGreaterThan(0);
    await setSettings(db(), { notifyEmail: 'rich@cardorentals.com' });
    expect((await getSettings(db())).notifyEmail).toBe('rich@cardorentals.com');
  });
});
```

- [ ] **Step 3: Run against the emulator**

Run: `npx firebase emulators:exec --only firestore --project demo-agreements "cd functions && npm test -- actions"`
Expected: all action tests PASS. (If `orderBy('createdAt','desc')` prompts a composite-index notice, it does not — single-field ordering needs no index.)

- [ ] **Step 4: Commit**

```bash
git add functions/src/actions.ts functions/test/actions.test.ts
git commit -m "feat(agreements): agreement actions (create/get/sign/list/settings) + emulator tests"
```

---

## Task 6: Admin-claim resolution + allowlist seed

**Files:** Create `functions/src/claims.ts`, `functions/test/claims.test.ts`, `scripts/seed-admins.ts`.

**Interfaces:** Produces `resolveAdmin(db, email)` (consumed by the `bootstrapAdmin` callable in Task 7). Seeds `config/admins`.

- [ ] **Step 1: Create `functions/src/claims.ts`**

```ts
import type { Firestore } from 'firebase-admin/firestore';

export async function resolveAdmin(db: Firestore, email: string | undefined): Promise<boolean> {
  if (!email) return false;
  const snap = await db.doc('config/admins').get();
  const emails = (snap.data()?.emails as string[] | undefined) ?? [];
  return emails.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}
```

- [ ] **Step 2: Write `functions/test/claims.test.ts`** (emulator):

```ts
import { beforeEach, describe, it, expect } from 'vitest';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { resolveAdmin } from '../src/claims';

function db() { if (!getApps().length) initializeApp({ projectId: 'demo-agreements' }); return getFirestore(); }
beforeEach(async () => {
  await db().doc('config/admins').set({ emails: ['rich@cardorentals.com'] });
});
describe('resolveAdmin', () => {
  it('grants an allowlisted email (case-insensitive)', async () => {
    expect(await resolveAdmin(db(), 'Rich@CardoRentals.com')).toBe(true);
  });
  it('denies a non-allowlisted email', async () => {
    expect(await resolveAdmin(db(), 'stranger@gmail.com')).toBe(false);
  });
  it('denies when email is undefined', async () => {
    expect(await resolveAdmin(db(), undefined)).toBe(false);
  });
});
```

- [ ] **Step 3: Run**

Run: `npx firebase emulators:exec --only firestore --project demo-agreements "cd functions && npm test -- claims"`
Expected: PASS.

- [ ] **Step 4: Create `scripts/seed-admins.ts`** (root; mirrors `scripts/seed-firestore.ts` — uses the root `getDb()` guarded reader):

```ts
import { getDb } from '../src/lib/content/firestore';
const email = process.argv[2] || 'rich@cardorentals.com';
const db = getDb();
if (!db) { console.error('No Firestore (set FIRESTORE_EMULATOR_HOST or FIREBASE_SERVICE_ACCOUNT)'); process.exit(1); }
await db.doc('config/admins').set({ emails: [email] }, { merge: true });
console.log('Seeded config/admins with', email);
```

- [ ] **Step 5: Verify the seed against the emulator**

Run: `npx firebase emulators:exec --only firestore "FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npx tsx scripts/seed-admins.ts rich@cardorentals.com"`
Expected: prints "Seeded config/admins with rich@cardorentals.com".

- [ ] **Step 6: Commit**

```bash
git add functions/src/claims.ts functions/test/claims.test.ts scripts/seed-admins.ts
git commit -m "feat(agreements): admin-claim resolution + config/admins seed script"
```

---

## Task 7: Function wrappers (HTTPS + callables) + secret binding

**Files:** Create `functions/src/index.ts`.

**Interfaces:** Consumes every module above. Produces the deployed functions: HTTPS `agreements` (owner `get`/`sign`/`pdf`) and callables `adminCreate`/`adminList`/`adminGetSettings`/`adminSetSettings`/`bootstrapAdmin`. Binds the `RESEND_API_KEY` secret.

- [ ] **Step 1: Create `functions/src/index.ts`**

```ts
import { onRequest } from 'firebase-functions/v2/https';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { getAuth } from 'firebase-admin/auth';
import { getDb, getBucket } from './db';
import { makeSendEmail } from './email';
import { buildPdf } from './pdf';
import {
  createAgreement, getAgreementPublic, signAgreement, listAgreements,
  getSettings, setSettings, HttpErr,
} from './actions';
import { resolveAdmin } from './claims';
import type { AgreementDoc } from './types';

const RESEND_API_KEY = defineSecret('RESEND_API_KEY');
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function requireAdmin(auth: { token?: { admin?: boolean } } | undefined) {
  if (!auth?.token?.admin) throw new HttpsError('permission-denied', 'Admin access required.');
}

// ---- Owner-facing, token-guarded HTTPS (mirrors today's request contract) ----
export const agreements = onRequest({ secrets: [RESEND_API_KEY], cors: false }, async (req, res) => {
  Object.entries(CORS).forEach(([k, v]) => res.set(k, v));
  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
  const db = getDb();
  try {
    if (req.method === 'GET' && req.query.action === 'pdf') {
      const token = String(req.query.t || '');
      const snap = await db.doc(`agreements/${token}`).get();
      if (token.length < 20 || !snap.exists) throw new HttpErr('Agreement not found', 404);
      const doc = snap.data() as AgreementDoc;
      const bytes = doc.pdfPath
        ? (await getBucket().file(doc.pdfPath).download())[0]
        : Buffer.from(await buildPdf(doc));
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'inline; filename="Cardo-Rental-Management-Agreement.pdf"');
      res.status(200).send(bytes);
      return;
    }
    const body = req.body ?? {};
    if (body.action === 'get') { res.json(await getAgreementPublic(db, String(body.token || ''))); return; }
    if (body.action === 'sign') {
      const settings = await getSettings(db);
      const send = makeSendEmail(RESEND_API_KEY.value(), settings);
      res.json(await signAgreement(db, getBucket(), String(body.token || ''), body, send));
      return;
    }
    res.status(400).json({ error: 'Unknown action' });
  } catch (e) {
    const status = (e as HttpErr).status ?? 500;
    if (status === 500) console.error(e);
    res.status(status).json({ error: (e as Error).message || 'Server error' });
  }
});

// ---- Staff callables (require the admin claim) ----
export const adminCreate = onCall({ secrets: [RESEND_API_KEY] }, async (req) => {
  requireAdmin(req.auth);
  try { return await createAgreement(getDb(), req.data); }
  catch (e) { throw new HttpsError('invalid-argument', (e as Error).message); }
});
export const adminList = onCall(async (req) => { requireAdmin(req.auth); return { agreements: await listAgreements(getDb()) }; });
export const adminGetSettings = onCall({ secrets: [RESEND_API_KEY] }, async (req) => {
  requireAdmin(req.auth);
  const s = await getSettings(getDb());
  return { ...s, hasResendKey: !!RESEND_API_KEY.value() };
});
export const adminSetSettings = onCall(async (req) => { requireAdmin(req.auth); await setSettings(getDb(), req.data); return { ok: true }; });

// ---- Claim bootstrap: any signed-in user calls this; allowlist decides ----
export const bootstrapAdmin = onCall(async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const email = req.auth.token.email as string | undefined;
  const isAdmin = await resolveAdmin(getDb(), email);
  await getAuth().setCustomUserClaims(req.auth.uid, { admin: isAdmin });
  return { admin: isAdmin };
});
```

- [ ] **Step 2: Build the functions (type-check)**

Run: `cd functions && npm run build`
Expected: `tsc` compiles with no errors; `functions/lib/` produced.

- [ ] **Step 3: Emulator end-to-end smoke** (owner path, no secret needed — email returns false without a key):

Run (with the emulator suite up via `npm run emulators` plus functions — use `firebase emulators:start --only functions,firestore,auth,storage`):
```bash
# seed one agreement via a callable is admin-gated; instead create directly through the emulator shell:
npx firebase emulators:exec --only functions,firestore,storage,auth \
  "curl -s -X POST http://127.0.0.1:5001/cardo-website-2026/us-central1/agreements \
    -H 'Content-Type: application/json' -d '{\"action\":\"get\",\"token\":\"deadbeef\"}'"
```
Expected: JSON `{"error":"Invalid link"}` (proves the HTTPS function is served and routes/errors correctly). Deeper create→sign e2e is exercised by the Task 5 unit tests and by Plan 2's UI.

- [ ] **Step 4: Commit**

```bash
git add functions/src/index.ts
git commit -m "feat(agreements): function wrappers (owner HTTPS + staff callables + claim bootstrap)"
```

---

## Task 8: Firestore + Storage rules for agreements

**Files:** Modify `firestore.rules`, `storage.rules`, `tests/rules.test.ts`.

**Interfaces:** Consumes the emulator. Produces tested rules: no client access to `agreements/*`; `agreements` PDFs private in Storage; `config/*` admin-only (already true).

- [ ] **Step 1: Add the `agreements` match to `firestore.rules`** (inside the `documents` match, alongside the existing collections):

```
    // All agreement access is mediated by Cloud Functions (Admin SDK). No client reads/writes.
    match /agreements/{token} { allow read, write: if false; }
```

- [ ] **Step 2: Add the private PDF path to `storage.rules`** (inside the bucket match, alongside `media`):

```
    match /agreements/{allPaths=**} {
      allow read, write: if false;   // executed PDFs are served only via the token-guarded function / Admin SDK
    }
```

- [ ] **Step 3: Extend `tests/rules.test.ts`** — add cases proving client access to `agreements` is denied (append inside the existing `describe`):

```ts
  it('denies anonymous read of an agreement', async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'agreements/tok1')));
  });
  it('denies even an admin client-writing an agreement', async () => {
    const db = env.authenticatedContext('u1', { admin: true }).firestore();
    await assertFails(setDoc(doc(db, 'agreements/tok1'), { status: 'sent' }));
  });
```

- [ ] **Step 4: Run the rules tests against the emulator**

Run: `npx firebase emulators:exec --only firestore "npm test -- tests/rules.test.ts"`
Expected: all rules tests PASS (existing + the 2 new agreement cases).

- [ ] **Step 5: Commit**

```bash
git add firestore.rules storage.rules tests/rules.test.ts
git commit -m "feat(agreements): firestore/storage rules — agreements are function-mediated only"
```

---

## Task 9: Infra enablement + phase verification

**Files:** none (infra + verification). Produces a deployable, verified backend.

- [ ] **Step 1: Enable the Google sign-in provider** — in the Firebase Console → Authentication → Sign-in method → add **Google**, set the project support email. (One-time; approved by the owner.) Record completion in the commit message of Step 6.

- [ ] **Step 2: Set the Resend secret** — reuse the existing Resend key (from the current Supabase `portal_settings`):

Run: `npx firebase functions:secrets:set RESEND_API_KEY --project cardo-website-2026`
Paste the key at the prompt. Expected: "Created a new secret version".

- [ ] **Step 3: Seed `config/admins` in the real project** (Admin SDK, bypasses rules — needs `FIREBASE_SERVICE_ACCOUNT` or `GOOGLE_APPLICATION_CREDENTIALS`):

Run: `FIREBASE_SERVICE_ACCOUNT="$(cat path/to/service-account.json)" npx tsx scripts/seed-admins.ts rich@cardorentals.com`
Expected: "Seeded config/admins with rich@cardorentals.com".

- [ ] **Step 4: Deploy functions + rules**

Run: `npx firebase deploy --only functions,firestore:rules,storage --project cardo-website-2026`
Expected: `agreements`, `adminCreate`, `adminList`, `adminGetSettings`, `adminSetSettings`, `bootstrapAdmin` deploy successfully; rules published.

- [ ] **Step 5: Full local test sweep**

Run: `npx firebase emulators:exec --only firestore,auth,storage "cd functions && npm test && cd .. && npm test -- tests/rules.test.ts"`
Expected: functions suites (content, pdf, email, actions, claims) + root rules tests all PASS.

- [ ] **Step 6: Phase checkpoint** — confirm and record:
  - [ ] All emulator tests green.
  - [ ] Functions deployed; `agreements` HTTPS URL noted (needed by Plan 2 to repoint the owner page).
  - [ ] `RESEND_API_KEY` secret set; `config/admins` seeded in production.
  - [ ] Google provider enabled.
  - [ ] Push the branch; do **not** open a PR to `main` yet (Plans 2–3 complete the feature). Report the checkpoint to the controller with the deployed `agreements` URL.

```bash
git commit --allow-empty -m "chore(agreements): Plan 1 backend verified (functions deployed, rules published, secret + admins seeded)"
git push -u origin feat/cms-agreements
```

---

## Self-Review

**Spec coverage:**
- Auth layer (Google + `admin` claim + allowlist): `bootstrapAdmin` + `resolveAdmin` + `config/admins` seed (Tasks 6, 7, 9) ✓. *Google provider enablement is a console step (Task 9.1).*
- Cloud Functions port (create/list/get/sign/pdf/settings): Tasks 5, 7 ✓ (faithful port; snake_case→camelCase mapped).
- PDF (pdf-lib) + Resend email + Secret Manager: Tasks 3, 4, 7, 9 ✓.
- Firestore data model (`agreements/{token}`, `config/portalSettings`, `config/admins`): Tasks 5, 6 ✓.
- Security (function-mediated; no client access; private PDFs): Task 8 ✓ (safer than the spec's `allow get: if true`; deviation flagged in Global Constraints).
- Shared legal-content module: copied + drift-guarded (Task 2); canonical relocation deferred to Plan 3 per spec.
- **Deferred to later plans (correctly out of scope):** React `/admin` SPA + agreements module, repointing the owner signing page, the initial "ready to sign" email on create (Plan 2); migration of real agreements + Supabase teardown + content de-dup (Plan 3).

**Placeholder scan:** none — every code/command step is concrete. The PDF port (Task 3.2) references exact source lines in-repo with an explicit adaptation list, not a vague "port it."

**Type consistency:** `AgreementDoc`/`PortalSettings`/`PublicAgreementView` defined in Task 3 and consumed unchanged in Tasks 5, 7. `HttpErr` (Task 5) is thrown by actions and mapped to HTTP/callable codes in Task 7. `makeSendEmail`'s signature (Task 4) matches the `sendMail` parameter of `signAgreement` (Task 5). `resolveAdmin` (Task 6) is consumed by `bootstrapAdmin` (Task 7). Token format is 36 hex chars everywhere (`newToken`, the `< 20` length guard, and the `/^[0-9a-f]{36}$/` test).

**Open follow-ups for Plan 2 (recorded, not gaps):** the `create` action currently does not send the initial email (that moves to the `adminCreate` path with the full marketing HTML when the SPA is built); `getAgreementPublic`'s response shape matches what the existing owner page expects, easing the Plan 2 repoint.
