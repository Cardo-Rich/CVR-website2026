# Brand V3 — Phase 4 (Blog / The Cardo Journal) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Ship the blog index at `/blog` and article pages at `/blog/<slug>` from a **CMS-ready, decoupled data model** (`src/data/blog.ts` → `articles[]`), so a future CMS can populate/replace article content without touching the templates.

**Architecture:** All article content lives in `src/data/blog.ts` as a typed `articles[]` (card metadata + a rich `bodyHtml` string per article). `src/pages/blog/[slug].astro` renders one article (body via `set:html`); `src/pages/blog.astro` renders the index (featured + grid) from the same data. Both reuse `MarketingHeader` + `Footer` + `reveal.js`, the global `site.css`, and carry page-specific styles in a scoped `<style>`.

**Tech Stack:** Astro 7 (`getStaticPaths`, `set:html` for CMS-authored HTML bodies), global CSS + scoped `<style>`, `reveal.js`. No test runner — verify via `npm run build` + visual review.

## Global Constraints

- **Fidelity:** high — pixel-for-pixel from the token layer.
- **Reference:** `design_handoff_v3_site/design-reference/blog.html` (index) and `blog-article.html` (article).
- **CMS-ready:** the article body is a single `bodyHtml` string (rendered `set:html`) and all article fields are data, not markup — a CMS can later supply `articles[]`. Do NOT hardwire article content into the `.astro` templates.
- **Links (extensionless):** `owners.html`→`/owners`, `owners.html#estimate`→`/owners#estimate`, `home-designs.html`→`/home-designs`, `home-designs.html#case-studies`→`/home-designs#case-studies`, `blog.html`→`/blog`, `blog-article.html`→`/blog/<slug>`. `tel:` unchanged. In-article inline links (e.g. `home-designs.html`→`/home-designs`) rewritten inside `bodyHtml` too. No `.html` may remain.
- **Images:** blog images are `images.unsplash.com` (editorial stock) — keep as-is.
- **Motion:** `.reveal` via shared `reveal.js`.
- **Branch:** continue on `feat/brand-v3-site` (extends PR #10). Commit after each task. Do NOT push to `main`.
- **Shared chrome:** `Base`, `MarketingHeader` (nav: For Owners→/owners, Design→/home-designs, Case studies→/home-designs#case-studies, Blog→/blog [active on both blog pages]; cta Free estimate→/owners#estimate), `Footer`.

## Data model (`src/data/blog.ts`)

```ts
export interface Article {
  slug: string;
  title: string;
  category: string;          // Revenue | Design | Compliance | Neighborhoods | Accounting | Operations
  excerpt: string;           // card summary
  readTime: string;          // e.g. '8 min read' (article) — index cards show the short form too
  dateFull: string;          // 'June 18, 2026' (byline)
  dateShort: string;         // 'Jun 2026' (featured card meta)
  img: string;               // Unsplash hero/card URL
  featured?: boolean;        // exactly one true → the index featured slot
  seo: { title: string; description: string };
  author: { name: string; initials: string };
  heroCaption: string;
  bodyHtml: string;          // rich HTML: <p class="lede">…</p><h2>…</h2><ul>…</ul><blockquote>…</blockquote><div class="callout">…</div> etc.
}
export const categories: string[];   // ['All','Revenue','Design','Compliance','Neighborhoods','Operations']
export const articles: Article[];    // 7 entries (1 featured + 6)
```

---

## Task 1: Blog data (CMS-ready `articles[]`)

**Files:** Create `src/data/blog.ts`

- [ ] **Step 1:** Create the interface + `categories` (from blog.html:80–85: All, Revenue, Design, Compliance, Neighborhoods, Operations) + `articles` with 7 entries. Slugs from the titles (kebab-case), e.g. featured → `what-your-san-diego-home-could-earn-2026`.
  - **Featured article** (`featured: true`): all card fields from blog.html:93–101, plus the FULL `bodyHtml` copied VERBATIM from `blog-article.html:92–124` (the `.prose` inner HTML: lede, sections, blockquote, list, callout, inline link) — rewrite the inline `home-designs.html`→`/home-designs` inside it. `author {name:'Cardo Revenue Team', initials:'CV'}`, `heroCaption` from blog-article.html:88, `dateFull:'June 18, 2026'`, `readTime:'8 min read'`, `seo` from blog-article.html title/description.
  - **The other 6** (from blog.html:109–132 card data — title, category, excerpt, readTime, img): give each a real but concise authored `bodyHtml` (a `<p class="lede">` + 2–3 `<p>`/`<h2>` consistent with its title/excerpt — clearly generic marketing placeholder to be replaced by the CMS). `author` may default to `{name:'The Cardo Team', initials:'CV'}`; `dateFull`/`dateShort` plausible 2026 dates; `heroCaption` a short caption; `seo` derived from title/excerpt.
- [ ] **Step 2:** `npm run build` (compiles). `grep -c "slug:" src/data/blog.ts` → 8 (7 articles + the interface field — confirm 7 array entries by eye or a stricter grep). Exactly one `featured: true`.
- [ ] **Step 3:** Commit: `git commit -m "feat(v3): blog data — CMS-ready articles[]"`

---

## Task 2: Article template

**Files:** Create `src/pages/blog/[slug].astro`

Port `blog-article.html` (57–148), data-driven. `getStaticPaths` from `articles`; `related` = the next 3 articles (wrapping), like neighborhoods.

- [ ] **Step 1: Frontmatter**
```astro
---
import Base from '../../layouts/Base.astro';
import MarketingHeader from '../../components/sections/MarketingHeader.astro';
import Footer from '../../components/sections/Footer.astro';
import { articles } from '../../data/blog';

export function getStaticPaths() {
  return articles.map((a, i) => ({
    params: { slug: a.slug },
    props: { a, related: [articles[(i+1)%articles.length], articles[(i+2)%articles.length], articles[(i+3)%articles.length]] },
  }));
}
const { a, related } = Astro.props;
const nav = [
  { label: 'For Owners', href: '/owners' },
  { label: 'Design', href: '/home-designs' },
  { label: 'Case studies', href: '/home-designs#case-studies' },
  { label: 'Blog', href: '/blog', active: true },
];
const cta = { label: 'Free estimate', href: '/owners#estimate' };
---
```
- [ ] **Step 2: Body** — `<Base title={a.seo.title} description={a.seo.description}>` > `<MarketingHeader {nav} {cta} />` > `<main>`:
  - `<article>` with `.art-head` (back link → `/blog`, `.post-cat` = `a.category`, `<h1>{a.title}</h1>`, `.art-byline` with `.art-avatar` = `a.author.initials`, `.who` = `a.author.name`, `.meta` = `{a.dateFull} · {a.readTime}`).
  - `.art-hero` figure: `<img src={a.img} alt={a.title} />` + `<figcaption>{a.heroCaption}</figcaption>`.
  - `<div class="prose" set:html={a.bodyHtml} />`.
  - `.art-cta` box (verbatim: "See your home's number." + estimate button → `/owners#estimate`).
  - `.related` section: `.related__grid` from `related.map(r => <a class="rpost" href={`/blog/${r.slug}`}>…{r.img}…{r.category}…{r.title}…</a>)`.
- [ ] **Step 3: Scoped `<style>`** — copy blog-article.html:11–54 (`.art-*`, `.prose`, `.callout`, `.related`, `.rpost`) verbatim. Bottom `<script>import '../../scripts/reveal.js';</script>`.
- [ ] **Step 4: Build + verify** — `npm run build`; all 7 `dist/blog/<slug>/index.html` exist; `grep -rl '\.html"' dist/blog/*/index.html` → none.
- [ ] **Step 5:** Commit: `git commit -m "feat(v3): blog article template (/blog/[slug])"`

---

## Task 3: Blog index

**Files:** Create `src/pages/blog.astro`

Port `blog.html` (70–162), data-driven.

- [ ] **Step 1:** Frontmatter imports + `articles`/`categories` + same `nav`(Blog active)/`cta`. Split data: `const featured = articles.find(a => a.featured); const rest = articles.filter(a => !a.featured);`
- [ ] **Step 2: Body** — `<Base title="The Cardo Journal — Owner insights for San Diego STR" description="Revenue, design, compliance, and neighborhood insight for San Diego vacation rental owners — from the Cardo team.">` > MarketingHeader > `<main>`:
  - `.blog-top`: eyebrow "The Cardo Journal", `<h1>Insight for San Diego owners.</h1>`, the intro `<p>`, and `.cats` chips from `categories.map((c,i) => <span class={i===0 ? 'cat is-active' : 'cat'}>{c}</span>)`.
  - Featured section: `<a class="feat reveal" href={`/blog/${featured.slug}`}>` with `.feat__media` img + `.feat__body` (post-meta: category / readTime / dateShort, `<h2>{featured.title}</h2>`, excerpt, "Read the analysis →").
  - Posts section: `.posts` grid from `rest.map(p => <a class="post reveal" href={`/blog/${p.slug}`}>…media…body(category/readTime, h3 title, excerpt, "Read →")…</a>)`.
  - Design-case-studies teaser (blog.html:138–147 verbatim, link → `/home-designs#case-studies`).
  - Newsletter section (blog.html:150–162 verbatim, the mock `onsubmit`).
  - `<Footer />`.
- [ ] **Step 3: Scoped `<style>`** — copy blog.html:11–53 (`.blog-top`, `.cats`, `.cat`, `.feat*`, `.post-meta`, `.post-cat`, `.posts`, `.post*`, `.news*`) verbatim. Bottom `<script>`: the category-chip toggle (blog.html:177–178) + `import '../scripts/reveal.js';`. (The chip toggle is cosmetic in the reference — faithful port; real filtering can come with the CMS.)
- [ ] **Step 4: Build + verify** — `dist/blog/index.html` exists; 1 `.feat` + 6 `.post`; `grep -c '\.html"' dist/blog/index.html` → 0.
- [ ] **Step 5:** Commit: `git commit -m "feat(v3): blog index (/blog)"`

---

## Task 4: Phase 4 verification + push

- [ ] **Step 1:** Clean `npm run build` — succeeds; `dist/blog/index.html` + 7 `dist/blog/<slug>/index.html`.
- [ ] **Step 2:** Visual smoke (dev server): `/blog` (featured + 6 cards, category chips toggle active, newsletter mock, cards link to `/blog/<slug>`); the featured article `/blog/<featured-slug>` (byline, hero, full prose with h2/blockquote/list/callout, CTA, 3 related linking correctly); one other article renders its authored body. Reveals fire; no console errors. Later-phase links (none new here) fine.
- [ ] **Step 3:** `git push` (updates PR #10 preview).
- [ ] **Step 4:** Report the Phase 4 checkpoint to the user, noting the 6 non-featured article bodies are generic placeholders to be replaced by the CMS.

---

## Self-Review

**Spec coverage:** `/blog` index ✓ (Task 3); `/blog/<slug>` article pages from ONE template + data ✓ (Tasks 1–2); CMS-ready `articles[]` with `bodyHtml` ✓; reused chrome + reveal ✓; extensionless links (incl. inside `bodyHtml`) ✓; scoped styles ✓.

**Deviations, noted:** (1) The reference ships one full article body + 6 teaser cards; to make all 7 routes real, the 6 non-featured articles get concise authored placeholder bodies (clearly generic, to be replaced by the CMS). (2) "Related" posts are derived (next 3, wrapping) rather than the reference's hand-picked 3. (3) The category chips toggle active-state only (cosmetic), faithful to the reference — real filtering deferred to the CMS. (4) Blog images stay Unsplash (editorial stock).

**Placeholder scan:** the 6 authored bodies are intentional placeholders per the CMS plan — not incomplete steps.

**Type consistency:** `Article` interface (Task 1) consumed by both pages (Tasks 2–3). `getStaticPaths` props `{ a, related }` defined/consumed in Task 2. `featured`/`rest` split in Task 3. `set:html` used only for the trusted `bodyHtml` data field.
