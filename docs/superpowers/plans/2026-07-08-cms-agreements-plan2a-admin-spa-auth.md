# CMS Agreements — Plan 2a: Admin SPA Foundation (Google Auth Shell)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the React `/admin` single-page app in this Astro repo — a Vite build served under a Firebase Hosting rewrite — with Google sign-in gated to the `config/admins` allowlist via the deployed `bootstrapAdmin` function. Deliverable: an admin can sign in with Google at `/admin` and reach an authenticated (empty) shell; a non-allowlisted user is denied. No agreements UI yet (that's Plan 2b).

**Architecture:** A self-contained Vite + React app in `admin/` (its own `package.json`) builds to `dist/admin/`, alongside the Astro marketing build in `dist/`. A `firebase.json` rewrite serves `/admin/**` → the SPA `index.html` for client routing. The SPA uses the Firebase JS SDK (Auth + Functions). On Google sign-in it calls the already-deployed `bootstrapAdmin` callable, which sets the `admin` custom claim for allowlisted verified-Google emails; the SPA refreshes the ID token and gates the UI on the claim.

**Tech Stack:** Vite 6, React 19, `firebase` (web SDK) v12 (already a repo devDep), `@vitejs/plugin-react`, TypeScript. Firebase project `cardo-website-2026`; callables region **us-central1**.

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-08-agreements-firebase-cms-design.md`. **Predecessor:** Plan 1 (deployed) — 6 functions live in us-central1 incl. `bootstrapAdmin`.
- **Branch:** `feat/cms-agreements` (already checked out). Do NOT create a new branch.
- **The Astro marketing site stays untouched and 100% static.** The SPA is isolated under `/admin`; the only root-level changes are additive build scripts + a hosting rewrite scoped to `/admin/**`.
- **Firebase web config is PUBLIC** (safe to commit — protected by security rules + the server-verified claim). Use exactly:
  ```ts
  {
    apiKey: 'AIzaSyDEvpX1WsRtgaLOSHWh6Pf6SP9pzk-g0UE',
    authDomain: 'cardo-website-2026.firebaseapp.com',
    projectId: 'cardo-website-2026',
    storageBucket: 'cardo-website-2026.firebasestorage.app',
    messagingSenderId: '350974726921',
    appId: '1:350974726921:web:ad0d1bee9a616c9715f9d8',
  }
  ```
- **Callables region is `us-central1`** — the SPA MUST init `getFunctions(app, 'us-central1')` or calls 404.
- **Build order matters:** `astro build` cleans `dist/`; the admin build writes into `dist/admin/`, so it MUST run **after** the Astro build. The combined script is `npm run build:all` (Astro → then admin).
- **No test runner for the SPA.** Verification is: `npm run build:admin` succeeds and emits `dist/admin/index.html` + assets; the app renders (checked via the preview tooling / `vite preview`); and the auth flow is verified end-to-end by a real Google sign-in on a Firebase Hosting preview channel (a documented manual check — real Google auth can't be scripted). Any pure logic gets a light unit test where it's worth it.
- **Node:** repo/CI Node 22 (`.nvmrc`).
- **Do NOT deploy to the live channel** in this plan (that's the Plan 3 cutover). Preview channel only.
- **Frequent commits.** Each task ends with a building, committed increment.

## File Structure

- `admin/package.json` — **create**: SPA package (react, react-dom, vite, @vitejs/plugin-react, firebase, typescript).
- `admin/vite.config.ts` — **create**: `base: '/admin/'`, `build.outDir: '../dist/admin'`, react plugin.
- `admin/tsconfig.json` — **create**.
- `admin/index.html` — **create**: SPA entry.
- `admin/src/main.tsx` — **create**: React root.
- `admin/src/firebase.ts` — **create**: `initializeApp` + `getAuth` + `getFunctions(app,'us-central1')` + `googleProvider`.
- `admin/src/auth.tsx` — **create**: `AuthProvider` + `useAuth()` — sign-in/out, `bootstrapAdmin` call, claim refresh, `{ status, user, isAdmin }`.
- `admin/src/App.tsx` — **create**: routes the auth `status` → sign-in screen / loading / access-denied / `<Shell/>`.
- `admin/src/Shell.tsx` — **create**: authed layout (header, sign-out, nav, module outlet placeholder).
- `admin/src/styles.css` — **create**: Brand V3 styling (ported look from `src/pages/portal/agreements.astro`).
- `package.json` — **modify**: add `build:admin`, `build:all` scripts.
- `firebase.json` — **modify**: add `hosting.rewrites` for `/admin/**` (keep all existing hosting keys).
- `.github/workflows/deploy.yml`, `.github/workflows/pr-preview.yml` — **modify**: build the admin app too (`build:all`).
- `config/admins` (Firestore doc) — **seed** (Task 5): `{ emails: ['rich@cardorentals.com'] }`.

## Interfaces (locked signatures)

```ts
// admin/src/firebase.ts
export const app: FirebaseApp;
export const auth: Auth;
export const functions: Functions;          // region us-central1
export const googleProvider: GoogleAuthProvider;

// admin/src/auth.tsx
type AuthStatus = 'loading' | 'signed-out' | 'checking' | 'admin' | 'denied';
export function useAuth(): {
  status: AuthStatus;
  user: User | null;
  signIn: () => Promise<void>;   // signInWithPopup(googleProvider) then bootstrap
  signOut: () => Promise<void>;
};
export function AuthProvider(props: { children: React.ReactNode }): JSX.Element;
```

---

## Task 1: Scaffold the admin Vite/React app + build & hosting integration

**Files:** Create `admin/{package.json,vite.config.ts,tsconfig.json,index.html,src/main.tsx,src/App.tsx}`; Modify root `package.json`, `firebase.json`.

**Interfaces:** Produces the SPA build target (`dist/admin/`) + the `/admin/**` rewrite. Later tasks fill in auth/shell.

- [ ] **Step 1: Create `admin/package.json`**

```json
{
  "name": "admin",
  "private": true,
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": {
    "firebase": "^12.15.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create `admin/vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  build: { outDir: '../dist/admin', emptyOutDir: true },
});
```

- [ ] **Step 3: Create `admin/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "ESNext", "moduleResolution": "Bundler",
    "jsx": "react-jsx", "strict": true, "esModuleInterop": true,
    "skipLibCheck": true, "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"], "noEmit": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `admin/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Cardo CMS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `admin/src/App.tsx`** (placeholder for now — real routing in later tasks):

```tsx
export default function App() {
  return <div style={{ fontFamily: 'system-ui', padding: 40 }}>Cardo CMS — admin shell (scaffold)</div>;
}
```

- [ ] **Step 6: Create `admin/src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
```

- [ ] **Step 7: Install deps**

Run: `cd admin && npm install`
Expected: react/react-dom/vite/firebase install cleanly.

- [ ] **Step 8: Add root build scripts** — merge into root `package.json` `"scripts"`:

```json
"build:admin": "npm --prefix admin install && npm --prefix admin run build",
"build:all": "npm run build && npm run build:admin"
```
(`build:all` runs Astro first — which cleans `dist/` — then the admin build into `dist/admin/`.)

- [ ] **Step 9: Add the hosting rewrite to `firebase.json`** — inside the existing `"hosting"` object (keep `public`, `ignore`, `cleanUrls`, `trailingSlash`, `headers`), add:

```json
"rewrites": [
  { "source": "/admin/**", "destination": "/admin/index.html" }
]
```
(Firebase serves existing files under `/admin/` first — the built JS/CSS assets — and rewrites only unmatched `/admin/*` client routes to the SPA shell. Marketing routes are unaffected.)

- [ ] **Step 10: Verify the combined build**

Run: `npm run build:all`
Then: `ls dist/admin/index.html && ls dist/admin/assets && ls dist/index.html`
Expected: the Astro site is in `dist/` AND the SPA is in `dist/admin/` (index.html + hashed assets). Both present = build order correct.

- [ ] **Step 11: Verify the SPA renders** — serve `dist/` and load `/admin/`:

Run: `npx firebase emulators:exec --only hosting "curl -s http://127.0.0.1:5000/admin/ | grep -o '<div id=\"root\"></div>'"` (or use the preview tooling to load `/admin/` and confirm the scaffold text renders).
Expected: the SPA `index.html` is served at `/admin/` (root div present); a browser load shows "Cardo CMS — admin shell (scaffold)".

- [ ] **Step 12: Commit**

```bash
git add admin package.json firebase.json
git commit -m "feat(cms): scaffold admin React SPA (vite) + /admin hosting rewrite"
```

---

## Task 2: Firebase client init + Google sign-in

**Files:** Create `admin/src/firebase.ts`, `admin/src/auth.tsx`; Modify `admin/src/App.tsx`, `admin/src/main.tsx`.

**Interfaces:** Consumes the Firebase web config + region (Global Constraints). Produces `useAuth()`/`AuthProvider` with sign-in/out (the claim gate lands in Task 3).

- [ ] **Step 1: Create `admin/src/firebase.ts`**

```ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

export const app = initializeApp({
  apiKey: 'AIzaSyDEvpX1WsRtgaLOSHWh6Pf6SP9pzk-g0UE',
  authDomain: 'cardo-website-2026.firebaseapp.com',
  projectId: 'cardo-website-2026',
  storageBucket: 'cardo-website-2026.firebasestorage.app',
  messagingSenderId: '350974726921',
  appId: '1:350974726921:web:ad0d1bee9a616c9715f9d8',
});
export const auth = getAuth(app);
export const functions = getFunctions(app, 'us-central1'); // callables live in us-central1
export const googleProvider = new GoogleAuthProvider();
```

- [ ] **Step 2: Create `admin/src/auth.tsx`** — sign-in/out + auth-state subscription (Task 3 adds the `bootstrap`/claim step; here `status` is just `loading`/`signed-out`/`checking`, and `checking` resolves to `admin` for any signed-in user *temporarily* until Task 3 wires the claim):

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, type User } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

type AuthStatus = 'loading' | 'signed-out' | 'checking' | 'admin' | 'denied';
interface AuthValue { status: AuthStatus; user: User | null; signIn: () => Promise<void>; signOut: () => Promise<void>; }
const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u);
    setStatus(u ? 'admin' : 'signed-out'); // TEMP: Task 3 replaces this with the bootstrap/claim check
  }), []);

  const signIn = async () => { await signInWithPopup(auth, googleProvider); };
  const signOut = async () => { await fbSignOut(auth); };

  return <Ctx.Provider value={{ status, user, signIn, signOut }}>{children}</Ctx.Provider>;
}
export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
```

- [ ] **Step 3: Wrap the app in `AuthProvider`** — update `admin/src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './auth';

createRoot(document.getElementById('root')!).render(
  <StrictMode><AuthProvider><App /></AuthProvider></StrictMode>,
);
```

- [ ] **Step 4: Update `admin/src/App.tsx`** to a minimal sign-in screen driven by `status`:

```tsx
import { useAuth } from './auth';

export default function App() {
  const { status, user, signIn, signOut } = useAuth();
  if (status === 'loading') return <p style={{ padding: 40 }}>Loading…</p>;
  if (status !== 'admin') return (
    <div style={{ fontFamily: 'system-ui', padding: 40 }}>
      <h1>Cardo CMS</h1>
      <button onClick={() => signIn()}>Sign in with Google</button>
    </div>
  );
  return (
    <div style={{ fontFamily: 'system-ui', padding: 40 }}>
      <p>Signed in as {user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

- [ ] **Step 5: Verify build + typecheck**

Run: `cd admin && npx tsc --noEmit && npm run build`
Expected: no type errors; `dist/admin` rebuilt.

- [ ] **Step 6: Commit**

```bash
git add admin/src
git commit -m "feat(cms): admin firebase init + Google sign-in scaffolding"
```

---

## Task 3: Admin-claim gate via `bootstrapAdmin`

**Files:** Modify `admin/src/auth.tsx`.

**Interfaces:** Consumes the deployed `bootstrapAdmin` callable + `config/admins`. Produces the real `status` machine: `admin` only when the claim is granted; else `denied`.

- [ ] **Step 1: Replace the TEMP status logic in `auth.tsx`** with the bootstrap + claim-refresh flow:

```tsx
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
// ...inside AuthProvider, replace the onAuthStateChanged callback:
useEffect(() => onAuthStateChanged(auth, async (u) => {
  setUser(u);
  if (!u) { setStatus('signed-out'); return; }
  setStatus('checking');
  try {
    // bootstrapAdmin verifies email_verified + Google provider, sets { admin } claim on the allowlist match
    const res = await httpsCallable<unknown, { admin: boolean }>(functions, 'bootstrapAdmin')();
    if (res.data.admin) {
      await u.getIdToken(true); // force-refresh so the new claim is in the token
      setStatus('admin');
    } else {
      setStatus('denied');
    }
  } catch {
    setStatus('denied');
  }
}), []);
```

- [ ] **Step 2: Handle the `denied` and `checking` states in `App.tsx`**:

```tsx
if (status === 'checking') return <p style={{ padding: 40 }}>Checking access…</p>;
if (status === 'denied') return (
  <div style={{ fontFamily: 'system-ui', padding: 40 }}>
    <h1>Access denied</h1>
    <p>This account isn’t authorized for the Cardo CMS. Contact an administrator.</p>
    <button onClick={() => signOut()}>Sign out</button>
  </div>
);
```

- [ ] **Step 3: Build + typecheck**

Run: `cd admin && npx tsc --noEmit && npm run build`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add admin/src
git commit -m "feat(cms): gate admin access on bootstrapAdmin claim"
```

---

## Task 4: The `/admin` shell + Brand V3 styling

**Files:** Create `admin/src/Shell.tsx`, `admin/src/styles.css`; Modify `admin/src/App.tsx`, `admin/src/main.tsx`.

**Interfaces:** Produces `<Shell/>` (header + nav + a module outlet placeholder) that Plan 2b mounts the Agreements module into.

- [ ] **Step 1: Create `admin/src/styles.css`** — port the visual language from `src/pages/portal/agreements.astro` (Inter + Cardo fonts via Google Fonts `@import`, the sunset bar `linear-gradient(90deg,#D12C66,#C19A5B,#FBD24E)`, pink `#ED3C78` accents, off-white `#F8F3EC` panels). Provide: `.app-header`, `.sunset-bar`, `.nav`, `.nav a`, `.main`, buttons (`.btn`, `.btn-ghost`), and a base reset. (Keep it a single stylesheet; ~120 lines is fine.)

- [ ] **Step 2: Create `admin/src/Shell.tsx`**

```tsx
import { useAuth } from './auth';

export default function Shell() {
  const { user, signOut } = useAuth();
  return (
    <div>
      <header className="app-header">
        <div className="header-inner">
          <strong>Cardo CMS</strong>
          <nav className="nav">
            <a href="#" aria-current="page">Agreements</a>
          </nav>
          <span className="spacer" />
          <span className="who">{user?.email}</span>
          <button className="btn-ghost" onClick={() => signOut()}>Sign out</button>
        </div>
        <div className="sunset-bar" />
      </header>
      <main className="main">
        {/* Plan 2b mounts the Agreements module here */}
        <p>Welcome. The Agreements module lands in Plan 2b.</p>
      </main>
    </div>
  );
}
```

- [ ] **Step 2b: Import the stylesheet** in `admin/src/main.tsx` (add `import './styles.css';`).

- [ ] **Step 3: Use `<Shell/>` for the admin state in `App.tsx`** — replace the signed-in block:

```tsx
import Shell from './Shell';
// ...
if (status === 'admin') return <Shell />;
```

- [ ] **Step 4: Build + render check**

Run: `cd admin && npm run build`, then load `/admin/` via the preview tooling (signed-out view). Confirm the sign-in screen shows the Brand V3 styling (sunset bar, fonts).
Expected: builds; styled sign-in screen renders.

- [ ] **Step 5: Commit**

```bash
git add admin/src
git commit -m "feat(cms): admin shell + Brand V3 styling"
```

---

## Task 5: Seed `config/admins`, CI build integration, and preview-channel auth verification

**Files:** Modify `.github/workflows/deploy.yml`, `.github/workflows/pr-preview.yml`. Seed `config/admins`. Preview-channel end-to-end auth check.

**Interfaces:** Makes the admin gate actually pass for `rich@cardorentals.com` and ensures CI builds the SPA into the deployed `dist/`.

- [ ] **Step 1: Seed `config/admins` in the live project.** Two options — pick one:
  - **Console (simplest):** Firestore → Start collection `config` → doc id `admins` → field `emails` (type *array*) → one string element `rich@cardorentals.com` → Save. (https://console.firebase.google.com/project/cardo-website-2026/firestore)
  - **Script (needs Admin creds):** `gcloud auth application-default login` then `GOOGLE_APPLICATION_CREDENTIALS`-less ADC run: `npx tsx scripts/seed-admins.ts rich@cardorentals.com`.

  Verify: the doc `config/admins` exists with `emails: ['rich@cardorentals.com']`.

- [ ] **Step 2: Build the SPA in CI** — in `.github/workflows/deploy.yml`, change the build step from `npm run build` to `npm run build:all` (keep the `FIREBASE_SERVICE_ACCOUNT` env). Do the same in `.github/workflows/pr-preview.yml`.

  (The `action-hosting-deploy` step still deploys `dist/`, which now contains `dist/admin/`.)

- [ ] **Step 3: Deploy to a PREVIEW channel** (not live) and get the URL:

Run: `npx firebase hosting:channel:deploy plan2a --project cardo-website-2026 --expires 7d`
Expected: prints a preview URL like `https://cardo-website-2026--plan2a-xxxx.web.app`. (Run `npm run build:all` first so `dist/admin` exists.)

- [ ] **Step 4: End-to-end auth verification (manual — real Google sign-in).** On the preview URL, visit `/admin/`:
  - Sign in with `rich@cardorentals.com` → after the popup + "Checking access…", the shell renders ("Signed in as rich@cardorentals.com", Agreements nav). ✅ allowlisted admin path.
  - (If a non-allowlisted Google account is available) sign in with it → "Access denied". ✅ deny path.
  - Confirm the browser console shows no errors and the `bootstrapAdmin` call succeeds (Network tab).

  Record the outcome. (This step requires a human with the Google account — the controller should hand it to the user and await confirmation before marking the task complete.)

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml .github/workflows/pr-preview.yml
git commit -m "ci(cms): build admin SPA into dist; config/admins seeded; preview auth verified"
```

---

## Task 6: Phase verification

- [ ] **Step 1:** `npm run build:all` succeeds; `dist/admin/index.html` + assets present; `dist/` marketing site intact.
- [ ] **Step 2:** `cd admin && npx tsc --noEmit` clean.
- [ ] **Step 3:** Preview channel: allowlisted Google sign-in reaches the shell; non-allowlisted denied; no console errors.
- [ ] **Step 4:** Marketing site unaffected on the preview channel (spot-check `/`, `/owners`, `/blog`).
- [ ] **Step 5:** Push the branch. Do NOT deploy live. Report the checkpoint + preview URL.

---

## Self-Review

**Spec coverage:** React `/admin` SPA (spec Architecture "Admin SPA") — Tasks 1–4 ✓; Google sign-in + `admin` claim + allowlist gate (spec Auth) — Tasks 3, 5 ✓; Hosting rewrite `/admin/**` (spec Build & hosting) — Task 1 ✓; build coexists with static Astro (spec) — Tasks 1, 5 ✓. **Deferred to Plan 2b (correctly out of scope):** the agreements module (create/list/settings UI), `adminCreate` email, content relocation, owner-page repoint.

**Placeholder scan:** none — every code/command step is concrete except the intentionally human-gated manual auth check (Task 5.4) and the CSS port (Task 4.1, bounded by the referenced source). The Task 2 `status='admin'` line is explicitly a labeled TEMP superseded in Task 3.

**Type consistency:** `AuthStatus`/`useAuth()`/`AuthProvider` defined in Task 2 and refined in Task 3; `<Shell/>` (Task 4) consumes `useAuth()`. Firebase config + `us-central1` region used once in `firebase.ts` and consumed everywhere.

**Risk notes for the controller:** (1) real Google auth can't be scripted — Task 5.4 is a genuine human checkpoint. (2) `authDomain` sign-in popups require the preview/live domain to be in Firebase Auth's *Authorized domains* (`*.web.app` and `*.firebaseapp.com` are allowlisted by default; a custom domain like `cardorentals.com` must be added before the live cutover in Plan 3). (3) `config/admins` must be seeded (Task 5.1) or every sign-in is denied.
