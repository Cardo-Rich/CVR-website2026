# CMS Plan 1 — Firebase Foundation + Build Integration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Stand up the Firebase backend (Firestore data model + security rules + emulator + test setup) and switch the Astro build to read *published* content from Firestore, falling back to the existing `src/data/*.ts` as a seed — so the site builds identically with or without Firestore.

**Architecture:** Firestore holds `articles`, `caseStudies`, `properties`, and a `homepage/featured` doc. A build-time content module reads Firestore via the Firebase Admin SDK when credentials are present, else falls back to the committed seed data. Security rules are tested against the Firebase emulator. No admin UI or Guesty sync yet (later plans).

**Tech Stack:** Astro 7, `firebase-admin` (build-time reads), `firebase-tools` (emulator), `vitest` + `@firebase/rules-unit-testing` (rules/unit tests), `tsx` (run TS scripts). Firebase project `cardo-website-2026`.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-06-cardo-cms-foundation-design.md`.
- **Update model:** rebuild-on-publish; the public site stays 100% static. The build reads only `status == 'published'` docs.
- **Fallback:** `npm run build` MUST succeed with no Firebase credentials (local/offline) by using the seed data in `src/data/*.ts`. Firestore is used only when `GOOGLE_APPLICATION_CREDENTIALS` / `FIREBASE_SERVICE_ACCOUNT` is present.
- **Output parity:** after switching to the content module, the generated `dist/` for `/blog`, `/blog/<slug>`, `/case-studies/<slug>`, and the home featured carousel must match the current output (same slugs, same rendered content) when Firestore is seeded from `src/data`.
- **Node:** `>=20` (repo runs Node 22).
- **Firebase project:** `cardo-website-2026` (in `.firebaserc`).
- **Branch:** create a new branch `feat/cms-foundation` off `main` (the site build lives on `feat/brand-v3-site`; the CMS is a distinct effort — confirm base branch with the controller before branching).
- **No secrets in the client bundle or the repo.** Service-account JSON is provided via env/CI secret only.

## File Structure

- `package.json` — **modify**: add deps + scripts (`test`, `emulators`, `seed`).
- `firebase.json` — **modify**: add `firestore`, `storage`, `emulators` blocks (keep existing `hosting`).
- `firestore.rules` — **create**: security rules.
- `firestore.indexes.json` — **create**: (empty/minimal).
- `storage.rules` — **create**: Storage security rules.
- `vitest.config.ts` — **create**: test config.
- `src/lib/content/types.ts` — **create**: `Article`, `CaseStudy`, `Property`, `FeaturedEntry` (extends the current `src/data` interfaces with `status`/timestamps).
- `src/lib/content/firestore.ts` — **create**: guarded Admin SDK init + `getDb()` returning a Firestore instance or `null`.
- `src/lib/content/articles.ts` — **create**: `getPublishedArticles()`, `getArticleBySlug()`.
- `src/lib/content/case-studies.ts` — **create**: `getPublishedCaseStudies()`, `getCaseStudyBySlug()`.
- `src/lib/content/properties.ts` — **create**: `getFeaturedProperties()`.
- `src/data/blog.ts`, `case-studies.ts` — **keep** as the seed (unchanged); the content module imports them as fallback.
- `scripts/seed-firestore.ts` — **create**: migrate seed data → Firestore.
- `src/pages/blog.astro`, `blog/[slug].astro`, `case-studies/[slug].astro`, `src/components/home/FeaturedHomes.astro` — **modify**: source data from the content module.
- `tests/rules.test.ts`, `tests/content.test.ts` — **create**.
- `.github/workflows/deploy.yml` — **modify**: expose Admin credentials to the build step.

## Interfaces (locked signatures)

```ts
// src/lib/content/types.ts
export type Status = 'draft' | 'published';
export interface Article { /* current src/data Article fields */ slug: string; /* … */ status: Status; }
export interface CaseStudy { /* current src/data CaseStudy fields */ slug: string; /* … */ status: Status; }
export interface Property { guestyId: string; name: string; neighborhood: string; beds: string; baths: string; guests: string; photos: string[]; bookingUrl: string; active: boolean; }
export interface FeaturedEntry { id: string; premier: boolean; }

// src/lib/content/firestore.ts
export function getDb(): FirebaseFirestore.Firestore | null;   // null when no credentials

// src/lib/content/articles.ts
export async function getPublishedArticles(): Promise<Article[]>;
export async function getArticleBySlug(slug: string): Promise<Article | null>;
// src/lib/content/case-studies.ts
export async function getPublishedCaseStudies(): Promise<CaseStudy[]>;
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null>;
// src/lib/content/properties.ts  (returns featured, ordered, resolved to card shape)
export interface FeaturedCard { slug: string; name: string; neighborhood: string; specs: string[]; photo: string; premier: boolean; href: string; }
export async function getFeaturedProperties(): Promise<FeaturedCard[]>;
```

---

## Task 1: Dependencies, scripts, and Firebase config

**Files:** Modify `package.json`, `firebase.json`; Create `firestore.rules`, `firestore.indexes.json`, `storage.rules`, `vitest.config.ts`.

**Interfaces:** Produces the toolchain + emulator config all later tasks use.

- [ ] **Step 1: Add dependencies**

```bash
npm install firebase-admin
npm install -D vitest @firebase/rules-unit-testing firebase-tools tsx
```

- [ ] **Step 2: Add npm scripts** — merge into `package.json` `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest",
"emulators": "firebase emulators:start --only firestore,auth,storage",
"seed": "tsx scripts/seed-firestore.ts"
```

- [ ] **Step 3: Extend `firebase.json`** (keep the existing `hosting` block; add):

```json
"firestore": { "rules": "firestore.rules", "indexes": "firestore.indexes.json" },
"storage": { "rules": "storage.rules" },
"emulators": {
  "auth": { "port": 9099 },
  "firestore": { "port": 8080 },
  "storage": { "port": 9199 },
  "ui": { "enabled": true }
}
```

- [ ] **Step 4: Create `firestore.indexes.json`**

```json
{ "indexes": [], "fieldOverrides": [] }
```

- [ ] **Step 5: Create `storage.rules`** (admins write, public read of uploaded media):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /media/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

- [ ] **Step 6: Create `firestore.rules`** (placeholder that Task 4 tightens/tests):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() { return request.auth != null && request.auth.token.admin == true; }
    match /articles/{id}     { allow read, write: if isAdmin(); }
    match /caseStudies/{id}  { allow read, write: if isAdmin(); }
    match /properties/{id}   { allow read: if isAdmin(); allow write: if false; } // sync-only (server)
    match /homepage/{id}     { allow read, write: if isAdmin(); }
    match /config/{id}       { allow read, write: if isAdmin(); }
  }
}
```

- [ ] **Step 7: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', include: ['tests/**/*.test.ts'] } });
```

- [ ] **Step 8: Verify emulator boots and config is valid**

Run: `npx firebase emulators:start --only firestore --project cardo-website-2026` (Ctrl-C after it prints "All emulators ready"). Expected: Firestore emulator starts on :8080 with `firestore.rules` loaded, no config error.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json firebase.json firestore.rules firestore.indexes.json storage.rules vitest.config.ts
git commit -m "feat(cms): firebase config, emulator, and test toolchain"
```

---

## Task 2: Content types

**Files:** Create `src/lib/content/types.ts`.

**Interfaces:** Produces `Status`, `Article`, `CaseStudy`, `Property`, `FeaturedEntry` (see locked interfaces). Consumed by every content module + the seed script.

- [ ] **Step 1:** Re-export/extend the existing seed interfaces. Import the field shapes from `src/data/blog.ts` (`Article`) and `src/data/case-studies.ts` (`CaseStudy`) if they are exported; otherwise copy their field lists verbatim and add `status: Status`. Add `Property` and `FeaturedEntry` exactly as in the locked interfaces. Add `createdAt?`, `updatedAt?`, `publishedAt?` (ISO strings) to `Article`/`CaseStudy`.
- [ ] **Step 2:** `npx tsc --noEmit` (or `npm run build`) compiles. Commit: `git commit -m "feat(cms): content types with status"`.

---

## Task 3: Guarded Firestore reader

**Files:** Create `src/lib/content/firestore.ts`. Test: `tests/content.test.ts` (part 1).

**Interfaces:** Produces `getDb(): Firestore | null`. Consumed by all content modules.

- [ ] **Step 1: Write the failing test**

```ts
// tests/content.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getDb } from '../src/lib/content/firestore';
describe('getDb', () => {
  beforeEach(() => { delete process.env.FIREBASE_SERVICE_ACCOUNT; delete process.env.GOOGLE_APPLICATION_CREDENTIALS; delete process.env.FIRESTORE_EMULATOR_HOST; });
  it('returns null when no credentials/emulator are configured', () => {
    expect(getDb()).toBeNull();
  });
});
```

- [ ] **Step 2:** Run `npm test -- tests/content.test.ts` → FAIL (module not found).
- [ ] **Step 3: Implement `firestore.ts`**

```ts
import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let cached: Firestore | null | undefined;

export function getDb(): Firestore | null {
  if (cached !== undefined) return cached;
  const hasEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;
  const svcJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  const adc = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!hasEmulator && !svcJson && !adc) { cached = null; return cached; }
  if (!getApps().length) {
    if (svcJson) initializeApp({ credential: cert(JSON.parse(svcJson)), projectId: 'cardo-website-2026' });
    else if (hasEmulator) initializeApp({ projectId: 'cardo-website-2026' });
    else initializeApp({ credential: applicationDefault(), projectId: 'cardo-website-2026' });
  }
  cached = getFirestore();
  return cached;
}
```

- [ ] **Step 4:** Run the test → PASS. Commit: `git commit -m "feat(cms): guarded build-time firestore reader"`.

---

## Task 4: Security rules + emulator tests

**Files:** Modify `firestore.rules`; Create `tests/rules.test.ts`.

**Interfaces:** Consumes the emulator (Task 1). Produces tested rules: admins read/write content; anon denied; `properties` not client-writable.

- [ ] **Step 1: Write failing rules tests** (uses `@firebase/rules-unit-testing` against the emulator):

```ts
// tests/rules.test.ts
import { initializeTestEnvironment, assertFails, assertSucceeds, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { beforeAll, afterAll, it, describe } from 'vitest';

let env: RulesTestEnvironment;
beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'cardo-rules-test',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
  });
});
afterAll(() => env.cleanup());

describe('firestore rules', () => {
  it('admin can write an article', async () => {
    const db = env.authenticatedContext('u1', { admin: true }).firestore();
    await assertSucceeds(setDoc(doc(db, 'articles/a1'), { slug: 'x', status: 'draft' }));
  });
  it('non-admin cannot write an article', async () => {
    const db = env.authenticatedContext('u2', {}).firestore();
    await assertFails(setDoc(doc(db, 'articles/a2'), { slug: 'y' }));
  });
  it('anonymous cannot read articles', async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'articles/a1')));
  });
  it('nobody can client-write properties', async () => {
    const db = env.authenticatedContext('u1', { admin: true }).firestore();
    await assertFails(setDoc(doc(db, 'properties/p1'), { name: 'Villa' }));
  });
});
```

- [ ] **Step 2:** Start the emulator (`npm run emulators` in another shell, or use `firebase emulators:exec`). Run `npm test -- tests/rules.test.ts`. If any assertion fails, adjust `firestore.rules` (the Task 1 rules should already pass these; the `firebase` client dep is needed — add `npm i -D firebase` if missing). Prefer running via: `npx firebase emulators:exec --only firestore "npm test -- tests/rules.test.ts"`.
- [ ] **Step 3:** All 4 tests PASS. Commit: `git commit -m "test(cms): firestore security rules (admin/anon/properties)"`.

---

## Task 5: Articles content module (Firestore-or-seed)

**Files:** Create `src/lib/content/articles.ts`; extend `tests/content.test.ts`.

**Interfaces:** Consumes `getDb()` (Task 3), the seed `src/data/blog.ts`. Produces `getPublishedArticles()`, `getArticleBySlug()`.

- [ ] **Step 1: Write failing tests** (fallback path — no emulator/creds → returns seed, published only):

```ts
// append to tests/content.test.ts
import { getPublishedArticles, getArticleBySlug } from '../src/lib/content/articles';
describe('articles (seed fallback)', () => {
  it('returns the seed articles when no db', async () => {
    const arts = await getPublishedArticles();
    expect(arts.length).toBeGreaterThan(0);
    expect(arts.every(a => a.slug)).toBe(true);
  });
  it('finds one by slug', async () => {
    const arts = await getPublishedArticles();
    const one = await getArticleBySlug(arts[0].slug);
    expect(one?.slug).toBe(arts[0].slug);
  });
});
```

- [ ] **Step 2:** Run → FAIL (module missing).
- [ ] **Step 3: Implement `articles.ts`**

```ts
import { getDb } from './firestore';
import { articles as seedArticles } from '../../data/blog';
import type { Article } from './types';

function fromSeed(): Article[] {
  return (seedArticles as any[]).map(a => ({ ...a, status: 'published' as const }));
}
export async function getPublishedArticles(): Promise<Article[]> {
  const db = getDb();
  if (!db) return fromSeed();
  const snap = await db.collection('articles').where('status', '==', 'published').get();
  return snap.docs.map(d => d.data() as Article);
}
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return (await getPublishedArticles()).find(a => a.slug === slug) ?? null;
}
```

- [ ] **Step 4:** Run → PASS. Commit: `git commit -m "feat(cms): articles content module with seed fallback"`.

---

## Task 6: Case-studies + featured-properties content modules

**Files:** Create `src/lib/content/case-studies.ts`, `src/lib/content/properties.ts`; extend `tests/content.test.ts`.

**Interfaces:** Produces `getPublishedCaseStudies()`, `getCaseStudyBySlug()`, `getFeaturedProperties()` (returns `FeaturedCard[]`).

- [ ] **Step 1: Write failing tests** for both (seed fallback): case studies return seed; featured properties fall back to the current hardcoded home cards.

```ts
import { getPublishedCaseStudies } from '../src/lib/content/case-studies';
import { getFeaturedProperties } from '../src/lib/content/properties';
describe('case studies + featured (seed fallback)', () => {
  it('returns seed case studies', async () => { expect((await getPublishedCaseStudies()).length).toBe(6); });
  it('returns featured cards with hrefs', async () => {
    const f = await getFeaturedProperties();
    expect(f.length).toBeGreaterThan(0);
    expect(f.every(c => c.href && c.name)).toBe(true);
  });
});
```

- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3: Implement `case-studies.ts`** (mirror `articles.ts`, seed = `caseStudies` from `../../data/case-studies`).
- [ ] **Step 4: Implement `properties.ts`** — when no db, return the current hardcoded FeaturedHomes cards (copy the `cards` array from `src/components/home/FeaturedHomes.astro` into a seed constant here, mapping to `FeaturedCard` with `href` = `/neighborhoods/<slug>` as today, `photo` = `homePhotos[key]`). When db present: read `homepage/featured` → resolve each `id` in `properties` → map to `FeaturedCard` (`href` = property.bookingUrl, photo = property.photos[0], specs from beds/baths/guests). Keep the seed href behavior for parity now (Guesty booking URLs arrive in Plan 3).
- [ ] **Step 5:** Run → PASS. Commit: `git commit -m "feat(cms): case-studies + featured-properties content modules"`.

---

## Task 7: Wire Astro pages to the content module

**Files:** Modify `src/pages/blog.astro`, `src/pages/blog/[slug].astro`, `src/pages/case-studies/[slug].astro`, `src/components/home/FeaturedHomes.astro`.

**Interfaces:** Consumes the Task 5–6 modules. Produces the same `dist/` output as today (seed = current data).

- [ ] **Step 1:** In `blog/[slug].astro` and `case-studies/[slug].astro`, make `getStaticPaths` `async` and source from `getPublishedArticles()` / `getPublishedCaseStudies()` instead of importing the static arrays. Keep the `related`/wrapping logic identical (operate on the fetched array).
- [ ] **Step 2:** In `blog.astro`, replace `import { articles }` with `const articles = await getPublishedArticles()` (+ `categories` stays from `src/data/blog`). Keep featured/rest split.
- [ ] **Step 3:** In `FeaturedHomes.astro`, replace the local `cards` array with `const cards = await getFeaturedProperties()` and adjust the template to the `FeaturedCard` shape (`c.href`, `c.photo`, `c.specs`, `c.premier`).
- [ ] **Step 4: Verify output parity** — `npm run build`, then confirm the same routes exist and content matches:

Run: `npm run build && ls dist/blog dist/case-studies && grep -c "scard" dist/index.html`
Expected: same blog/case-study slugs as before; home carousel still renders featured cards. (No Firebase creds → seed path, so output equals pre-change.)

- [ ] **Step 5:** Commit: `git commit -m "feat(cms): source blog/case-studies/featured from content module"`.

---

## Task 8: Seed script + CI build credentials

**Files:** Create `scripts/seed-firestore.ts`; Modify `.github/workflows/deploy.yml`.

**Interfaces:** Consumes the seed data + types. Produces a documented one-time migration + a CI build that reads Firestore.

- [ ] **Step 1: Implement `scripts/seed-firestore.ts`** — using `getDb()` (requires emulator or creds), upsert each seed article/case-study with `status: 'published'` and timestamps into Firestore. Idempotent (doc id = slug).

```ts
import { getDb } from '../src/lib/content/firestore';
import { articles } from '../src/data/blog';
import { caseStudies } from '../src/data/case-studies';
const db = getDb();
if (!db) { console.error('No Firestore (set FIRESTORE_EMULATOR_HOST or FIREBASE_SERVICE_ACCOUNT)'); process.exit(1); }
for (const a of articles as any[]) await db.collection('articles').doc(a.slug).set({ ...a, status: 'published' }, { merge: true });
for (const c of caseStudies as any[]) await db.collection('caseStudies').doc(c.slug).set({ ...c, status: 'published' }, { merge: true });
console.log('Seeded', (articles as any[]).length, 'articles,', (caseStudies as any[]).length, 'case studies');
```

- [ ] **Step 2: Verify the seed against the emulator**

Run: `npx firebase emulators:exec --only firestore "FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run seed"`
Expected: prints "Seeded 7 articles, 6 case studies", no error.

- [ ] **Step 3: Wire CI build to read Firestore** — in `.github/workflows/deploy.yml`, before `npm run build`, expose the service account so the Admin SDK can read Firestore. Add an env var on the build step:

```yaml
- run: npm run build
  env:
    FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_CARDO_WEBSITE_2026 }}
```

(The same secret already used by the deploy step; the build now pulls published content from Firestore. If the secret is absent — e.g. fork PRs — the build falls back to the seed, which still succeeds.)

- [ ] **Step 4:** Commit: `git commit -m "feat(cms): firestore seed script + CI build credentials"`.

---

## Task 9: Phase verification

- [ ] **Step 1:** `npm test` — all rules + content tests pass.
- [ ] **Step 2:** `npm run build` with no creds — succeeds via seed; `/blog`, `/case-studies/*`, home carousel render as before.
- [ ] **Step 3:** Emulator end-to-end — start the emulator, seed it, run `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run build`, confirm the same output (now sourced from Firestore).
- [ ] **Step 4:** Push the branch; open a PR (do NOT merge to `main` without the controller/user's go-ahead — this changes the deploy build). Report the checkpoint.

---

## Self-Review

**Spec coverage:** Firestore data model (Tasks 2, 4) ✓; security rules + admin allowlist via `admin` claim (Task 4) ✓; Storage rules (Task 1) ✓; build reads published content with seed fallback (Tasks 3, 5–7) ✓; migration/seed (Task 8) ✓; CI build integration (Task 8) ✓; emulator-based tests (Tasks 4, 9) ✓. **Deferred to later plans (correctly out of scope here):** admin SPA + editors, Guesty sync function, publish/rebuild trigger function, custom-claim-setting function, rich text/media upload UI.

**Placeholder scan:** none — every code/command step is concrete. The `properties` featured seed reuses the existing FeaturedHomes cards for parity (Guesty replaces it in Plan 3).

**Type consistency:** `Article`/`CaseStudy`/`Property`/`FeaturedEntry`/`FeaturedCard` defined in Tasks 2/6 and consumed consistently. `getDb()` (Task 3) is the single Firestore accessor used by Tasks 5, 6, 8. `status: 'published'` filter used identically in the modules and the seed.

**Note for the controller:** the admin `admin: true` custom claim is *assumed* by the rules; the function that *sets* it (on allowlisted sign-in) is built in Plan 2 (admin SPA/auth). For Plan 1, tests inject the claim directly via the emulator, which is correct for rules testing.
