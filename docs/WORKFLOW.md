# Working on the Cardo site

This is the day-to-day workflow: local previews, GitHub PRs that auto-deploy on
merge, Claude Code for engineering, Claude Design for look-and-feel.

## The pieces

| Piece | What it is | Where it runs |
|-------|------------|---------------|
| **Local repo** | Your clone of the GitHub repo | Your machine |
| **Dev server** | `npm run dev` — live preview with hot reload | `localhost:4321` |
| **GitHub** | The source of truth (`origin`), home of PRs | github.com |
| **CI/CD** | GitHub Actions: PR previews + deploy-on-merge | GitHub Actions |
| **Firebase Hosting** | Where the live site is served | `cardo-website-2026.web.app` |
| **Claude Code** | New pages, refactors, wiring, big edits | Your terminal / editor |
| **Claude Design** | UI/UX exploration in the design system | claude.ai/design |

## One-time local setup

```bash
git clone <your-repo-url> cardo-website
cd cardo-website
nvm use            # picks Node 22 from .nvmrc (install nvm if you don't have it)
npm install
npm run dev        # open http://localhost:4321
```

## The everyday loop

1. **Branch** off the latest main:
   ```bash
   git checkout main && git pull
   git checkout -b feat/<short-name>     # e.g. feat/owner-dashboard
   ```
2. **Build** the change — by hand or with Claude Code. Keep `npm run dev` running to preview.
3. **Commit** as you go:
   ```bash
   git add -A
   git commit -m "Add owner dashboard hero"
   ```
4. **Push** the branch and open a **pull request**:
   ```bash
   git push -u origin feat/<short-name>
   ```
   Opening the PR triggers a **preview deploy** — Actions comments a temporary
   `…--preview-xxxx.web.app` URL on the PR so you (and anyone reviewing) can see it live.
5. **Review → merge.** When it looks good, merge the PR into `main`.
   The merge triggers the **live deploy** — `cardo-website-2026.web.app` updates automatically.
6. Delete the branch. Repeat.

> You never push straight to `main`. Work happens on branches; `main` only changes
> through merged PRs. (Recommended: turn on branch protection so this is enforced — see below.)

## Claude Code vs Claude Design — how they fit

- **Claude Code** (this tool) edits the *real* code: `src/pages/`, `src/components/`,
  data, build config, deploys. Use it for new pages, new sections, logic, refactors,
  fixing bugs, anything structural. It opens PRs and runs the dev server for you.
- **Claude Design** edits the *design system* in `project/` — the tokens, the visual
  foundations, and prototype "UI kits." Use it to explore a new look, a restyle, a new
  component's appearance, before committing to code.

**The handoff loop:** Claude Design changes land in `project/` (tokens in
`project/tokens/*.css`, prototypes in `project/ui_kits/`). To bring those into the live
site, point Claude Code at the changed design files and ask it to port them into
`src/styles/tokens/` and the relevant `src/components/`. Because the site's tokens are
copied verbatim from the design system, a token change is often a near-mechanical sync.
The `project/SKILL.md` file is written to be loadable by Claude Code as a brand skill.

## Deploying manually (escape hatch)

CI handles deploys, but you can always deploy from your machine:

```bash
npm run build
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
  npx firebase-tools deploy --only hosting
```

## Recommended GitHub settings

- **Branch protection on `main`:** require a PR before merging; optionally require the
  preview build to pass. (Repo → Settings → Branches → Add rule.)
- **Actions secret `FIREBASE_SERVICE_ACCOUNT`:** the Firebase service-account JSON, so CI
  can deploy. (Repo → Settings → Secrets and variables → Actions → New secret.)
