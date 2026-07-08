# Agreements → Firebase — Go-Live Cutover Checklist

**Status:** All code built, reviewed, and on `feat/cms-agreements` (pushed). Cloud Functions are **deployed** and dormant. The steps below are the remaining **human/credentialed** actions to take the system live. Do them **in order** — step 2 (migration) must happen **before** step 3 (merge to main), or in-flight signing links 404.

Branch: `feat/cms-agreements` · Firebase project: `cardo-website-2026` · Functions region: `us-central1`
Preview (test here first): see the latest `plan3` channel URL printed at the end of the run.

---

## 1. Seed the admin allowlist
Firestore console → https://console.firebase.google.com/project/cardo-website-2026/firestore
- Collection `config` → document `admins` → field `emails` (**array**) → `rich@cardorentals.com` (add more staff as needed).
- **Verify:** on the preview `/admin/`, Google sign-in with `rich@cardorentals.com` reaches the admin shell; a non-allowlisted account gets "Access denied."

## 2. Run the data migration (BEFORE going live)
3 existing agreements (1 signed, 2 sent) move from Supabase → Firestore, tokens preserved so old signing links keep working. Run from `functions/` with **both** credential sets in the environment:
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (read the source — Supabase project `yyfckfuzoutmdwconrnm`)
- `GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json` (write prod Firestore/Storage — a `cardo-website-2026` service-account key with Firestore + Storage admin)

```
cd functions
npx tsx scripts/migrate.ts --dry     # prints the 3 tokens, writes nothing
npx tsx scripts/migrate.ts           # migrates for real (idempotent — safe to re-run)
```
- **Verify:** Firestore has 3 `agreements/*` docs + `config/portalSettings`; Storage has 1 `agreements/<token>/executed.pdf`.

## 3. Go live — merge to main
Merge `feat/cms-agreements` → `main`. This triggers `deploy.yml` (`build:all`), publishing the static site (with the **repointed owner signing page** + the `/admin` SPA) to the live Hosting channel. Only after step 2.

## 4. Authorize the production domain for sign-in
Firebase Auth → Settings → Authorized domains → https://console.firebase.google.com/project/cardo-website-2026/authentication/settings
- Add `cardorentals.com` (and any custom admin domain). Without it, `signInWithPopup` fails on the production domain. (`*.web.app`/`*.firebaseapp.com` are auto-authorized, so the preview works already.)

## 5. Make outbound email real
The Supabase system used the default `onboarding@resend.dev` (which only delivers to the Resend account owner) and had **no** Resend key. For invites + executed-agreement emails to reach real owners:
- Ensure the `RESEND_API_KEY` secret is a valid key for a **verified** Resend domain (cardorentals.com). Re-set if needed: `firebase functions:secrets:set RESEND_API_KEY` then redeploy functions.
- In the `/admin` **Email Settings**, set the **From address** to a verified-domain sender (e.g. `Cardo Vacation Rentals <owners@cardorentals.com>`) and the **Notify** address.

## 6. Live smoke test
- Open a **migrated** signing link `https://cardorentals.com/agreement/?t=<existing-token>` → the RMA loads from Firebase.
- In `/admin`, create a new agreement (your own email) → invite email arrives → open the link → sign → executed PDF emails to you + the notify address, and the row flips to **signed** in the admin list; the PDF link works.

## 7. Decommission Supabase
Once the live smoke test passes, pause/delete the Supabase project `yyfckfuzoutmdwconrnm` (the edge function + tables are no longer referenced anywhere in the repo).

---

## Follow-ups (not blocking go-live)
- **Node 20 runtime EOL 2026-10-30** — bump the functions runtime to Node 22 before then (`functions/package.json` `engines.node`, redeploy).
- **`/portal` → `/owners` is interim** — the footer "Owner login" link + the case-study "Go to my owner portal" CTA currently land on the `/owners` marketing page. Point them at the real authenticated owner portal when it's built (a future spec; the agreements data model already carries `owner.email` as the join key).
- **App Check** on the callables to blunt abuse of the public callable endpoints.
