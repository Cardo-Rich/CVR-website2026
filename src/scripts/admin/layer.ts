/* Inline admin layer for the public marketing site. Activates ONLY for a
   signed-in admin (verified by the `admin` custom claim). For everyone else it
   costs a single idle-time auth check and then does nothing.

   What it does for an admin:
   - shows a purple top toolbar with draft status + Publish / Discard / Sign out
   - puts a purple on/off switch on every [data-section] (OFF = hidden to the
     public, shown-but-marked to admins)
   - puts Edit / Add / Delete controls on database-backed content ([data-cms])
   - edits save as DRAFT; Publish promotes drafts and (optionally) rebuilds

   Layout is never editable — only content. */
import { watchAdmin, login, logout, getContent, saveContent, publishDrafts, discardDrafts, syncGoogle, uploadPhoto } from './cms';
import type { SiteContent, CaseStudyItem, ReviewsDoc, ReviewCard, FeaturedHomeItem, GuestPhotoItem, TeamMemberItem, OwnerTestimonialItem, NeighborhoodItem, BlogArticleItem } from './cms';
import '../../styles/admin.css';
// Shared renderers (the published path uses the same module).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import * as Hydrate from '../content-hydrate.js';

const H = Hydrate as {
  hydrateReviews: (r: unknown) => void;
  hydrateOwnerCases: (i: unknown[]) => void;
  hydrateExplore: (i: unknown[]) => void;
  hydrateFeaturedHomes: (i: unknown[]) => void;
  hydrateGuestPhotos: (i: unknown[]) => void;
  hydrateTeam: (i: unknown[]) => void;
  hydrateOwnerTestimonials: (i: unknown[]) => void;
  hydrateNeighborhoodIndex: (i: unknown[]) => void;
  hydrateNeighborhoodDetail: (i: unknown[]) => void;
  hydrateBlogIndex: (i: unknown[]) => void;
  hydrateBlogArticle: (i: unknown[]) => void;
};

// ---------- tiny DOM helper ----------
type Attrs = Record<string, string | number | boolean | ((e: Event) => void)>;
function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, kids: (Node | string)[] = []): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = String(v);
    else if (k === 'html') n.innerHTML = String(v);
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v as EventListener);
    else if (v === true) n.setAttribute(k, '');
    else if (v !== false) n.setAttribute(k, String(v));
  }
  for (const c of kids) n.append(c);
  return n;
}
const PENCIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
const DOTS = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
const PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>';

// ---------- state ----------
let content: SiteContent | null = null;
let dirty = false;

function toast(msg: string, isErr = false) {
  const t = el('div', { class: 'cadm-toast' + (isErr ? ' is-err' : '') }, [msg]);
  document.body.append(t);
  requestAnimationFrame(() => t.classList.add('is-in'));
  setTimeout(() => { t.classList.remove('is-in'); setTimeout(() => t.remove(), 300); }, isErr ? 5000 : 2600);
}

// ============================================================ bootstrap
function boot() {
  const start = () => watchAdmin((isAdmin) => {
    if (isAdmin) activate();
    // Signed out or not an admin: clear the boot flag so future public visits
    // don't reload Firebase (they can always re-enter via #admin).
    else if (!activated) { try { localStorage.removeItem(ADMIN_FLAG); } catch { /* */ } }
  });
  if ('requestIdleCallback' in window) (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(start);
  else setTimeout(start, 1200);
  // First-time sign-in from a public page: visit ...#admin
  if (location.hash === '#admin') promptLogin();
}

function promptLogin() {
  if (document.querySelector('.cadm-login-scrim')) return;
  const scrim = el('div', { class: 'cadm-login-scrim' }, [
    el('div', { class: 'cadm-login' }, [
      el('h3', {}, ['Cardo admin']),
      el('p', {}, ['Sign in with your Cardo Google account to edit this page.']),
      el('button', { class: 'cadm-mbtn cadm-mbtn--primary', onclick: async () => {
        try { await login(); scrim.remove(); } catch (e) { toast((e as Error).message, true); }
      } }, ['Sign in with Google']),
      el('div', {}, [el('button', { class: 'cadm-mbtn cadm-mbtn--ghost', style: 'margin-top:10px', onclick: () => scrim.remove() }, ['Cancel'])]),
    ]),
  ]);
  document.body.append(scrim);
}

export const ADMIN_FLAG = 'cardoAdmin';

// Public entry for the hidden "triple-click the nav bar" gesture. If a valid
// admin session already exists the auth watcher activates on its own; otherwise
// set the boot flag (so a refresh keeps admin loaded) and show the sign-in
// prompt. Safe to call repeatedly.
export function enterAdminMode(): void {
  if (activated) { toast('Admin mode is already on.'); return; }
  try { localStorage.setItem(ADMIN_FLAG, '1'); } catch { /* private mode */ }
  promptLogin();
}

let activated = false;
async function activate() {
  if (activated) return; activated = true;
  try { localStorage.setItem(ADMIN_FLAG, '1'); } catch { /* private mode */ }
  document.documentElement.classList.add('cadm-admin');
  try {
    content = await getContent();
  } catch (e) { toast('Could not load admin content: ' + (e as Error).message, true); }
  dirty = !!content?.hasDraft;
  buildToolbar();
  applyDraftToPage();
  buildSectionControls();
  buildEditors();
}

// re-render owners content from the (draft) state we hold
function applyDraftToPage() {
  if (!content) return;
  try { H.hydrateReviews(content.reviews || {}); } catch { /* not on this page */ }
  try { H.hydrateOwnerCases(content.blog || []); } catch { /* not on this page */ }
  try { H.hydrateExplore(content.blog || []); } catch { /* not on this page */ }
  try { H.hydrateFeaturedHomes(content.featuredHomes || []); } catch { /* not on this page */ }
  try { H.hydrateGuestPhotos(content.guestPhotos || []); } catch { /* not on this page */ }
  try { H.hydrateTeam(content.teamMembers || []); } catch { /* not on this page */ }
  try { H.hydrateOwnerTestimonials(content.ownerTestimonials || []); } catch { /* not on this page */ }
  try { H.hydrateNeighborhoodIndex(content.neighborhoods || []); } catch { /* not on this page */ }
  try { H.hydrateNeighborhoodDetail(content.neighborhoods || []); } catch { /* not on this page */ }
  try { H.hydrateBlogIndex(content.blog || []); } catch { /* not on this page */ }
  try { H.hydrateBlogArticle(content.blog || []); } catch { /* not on this page */ }
  // re-attach per-card controls after grids are rebuilt
  decorateCaseCards();
  decorateExploreCards();
  decorateFeaturedCards();
  decorateGuestCards();
  decorateTeamCards();
  decorateOwnerTestCards();
  decorateHoodCards();
  decorateBlogCards();
}

// ============================================================ toolbar
let barStatus: HTMLElement;
function buildToolbar() {
  if (document.querySelector('.cadm-bar')) return;
  document.body.classList.add('cadm-has-bar');
  barStatus = el('span', { class: 'cadm-bar__status' });
  const bar = el('div', { class: 'cadm-bar' }, [
    el('span', { class: 'cadm-bar__dot', title: 'Cardo admin' }),
    barStatus,
    el('button', { class: 'cadm-btn cadm-btn--solid', id: 'cadm-publish', onclick: onPublish }, ['Publish']),
    buildOverflowMenu(),
  ]);
  document.body.append(bar);
  requestAnimationFrame(() => bar.classList.add('is-in'));
  // Push the page down by the bar's real height so it never covers the header,
  // and keep it correct across rotation / resize / font reflow.
  const sync = () => {
    const h = bar.offsetHeight;
    document.body.style.paddingTop = h + 'px';
    // expose height so the site's sticky header can stick BELOW the bar
    document.documentElement.style.setProperty('--cadm-bar-h', h + 'px');
  };
  sync();
  requestAnimationFrame(sync);
  window.addEventListener('resize', sync);
  if ('ResizeObserver' in window) new ResizeObserver(sync).observe(bar);
  refreshStatus();
}

// ⋮ menu for the less-frequent actions, keeping the bar uncluttered on mobile.
function buildOverflowMenu(): HTMLElement {
  const wrap = el('div', { class: 'cadm-menu' });
  const close = () => wrap.classList.remove('is-open');
  const btn = el('button', {
    class: 'cadm-btn cadm-menu__btn', 'aria-label': 'More actions', 'aria-haspopup': 'true', html: DOTS,
    onclick: (e: Event) => { e.stopPropagation(); wrap.classList.toggle('is-open'); },
  });
  const list = el('div', { class: 'cadm-menu__list' }, [
    el('button', { class: 'cadm-menu__item', onclick: () => { close(); onDiscard(); } }, ['Discard changes']),
    el('button', { class: 'cadm-menu__item cadm-menu__item--danger', onclick: async () => {
      close();
      try { localStorage.removeItem(ADMIN_FLAG); } catch { /* */ }
      await logout(); location.href = location.pathname;
    } }, ['Sign out']),
  ]);
  document.addEventListener('click', close);
  wrap.append(btn, list);
  return wrap;
}

function setDirty(v: boolean) { dirty = v; refreshStatus(); }
function refreshStatus() {
  if (!barStatus) return;
  barStatus.textContent = dirty ? 'Draft changes pending' : 'All changes published';
  barStatus.classList.toggle('is-draft', dirty);
  const pub = document.getElementById('cadm-publish') as HTMLButtonElement | null;
  if (pub) pub.disabled = !dirty;
}

async function onPublish() {
  const pub = document.getElementById('cadm-publish') as HTMLButtonElement | null;
  if (pub) { pub.disabled = true; pub.textContent = 'Publishing…'; }
  try {
    const r = await publishDrafts();
    toast(r.rebuild === 'triggered' ? 'Published — site is rebuilding.' : 'Published live.');
    setDirty(false);
  } catch (e) { toast((e as Error).message, true); }
  finally { if (pub) pub.textContent = 'Publish'; refreshStatus(); }
}
async function onDiscard() {
  if (!dirty) return toast('Nothing to discard.');
  if (!confirm('Discard all unpublished changes and revert to the live version?')) return;
  try { await discardDrafts(); toast('Draft discarded — reloading.'); setTimeout(() => location.reload(), 700); }
  catch (e) { toast((e as Error).message, true); }
}

// persist current `content` as a draft patch
async function persist(patch: { caseStudies?: CaseStudyItem[]; reviews?: Partial<ReviewsDoc>; sections?: Record<string, boolean>; featuredHomes?: FeaturedHomeItem[]; guestPhotos?: GuestPhotoItem[]; teamMembers?: TeamMemberItem[]; ownerTestimonials?: OwnerTestimonialItem[]; neighborhoods?: NeighborhoodItem[]; blog?: BlogArticleItem[] }) {
  await saveContent(patch);
  setDirty(true);
}

// ============================================================ section on/off
function buildSectionControls() {
  const sections = (content?.sections) || {};
  document.querySelectorAll<HTMLElement>('[data-section]').forEach((sec) => {
    const key = sec.getAttribute('data-section')!;
    sec.classList.add('cadm-editable');
    const on = sections[key] !== false;
    const secbar = sec.querySelector('.cadm-secbar') || makeSecbar(sec, key);
    // toggle
    const input = el('input', { type: 'checkbox' }) as HTMLInputElement;
    input.checked = on;
    input.addEventListener('change', () => setSectionOn(sec, key, input.checked));
    secbar.prepend(el('label', { class: 'cadm-switch', title: 'Show this section to the public' }, [
      input, el('span', { class: 'cadm-switch__track' }),
    ]));
    applySectionVisual(sec, on);
  });
}
function makeSecbar(sec: HTMLElement, key: string): HTMLElement {
  if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
  const bar = el('div', { class: 'cadm-secbar' }, [el('span', { class: 'cadm-secbar__label' }, [key.replace(/-/g, ' ')])]);
  sec.prepend(bar);
  return bar;
}
function applySectionVisual(sec: HTMLElement, on: boolean) {
  sec.style.display = ''; // admins always see it
  sec.classList.toggle('cadm-off', !on);
  let flag = sec.querySelector('.cadm-off-flag') as HTMLElement | null;
  if (!on && !flag) { flag = el('span', { class: 'cadm-off-flag' }, ['Hidden']); sec.prepend(flag); }
  if (on && flag) flag.remove();
}
async function setSectionOn(sec: HTMLElement, key: string, on: boolean) {
  const map = { ...(content!.sections || {}) };
  map[key] = on;
  content!.sections = map;
  applySectionVisual(sec, on);
  try { await persist({ sections: map }); } catch (e) { toast((e as Error).message, true); }
}

// ============================================================ editors
function buildEditors() {
  // Reviews section → Edit chip
  document.querySelectorAll<HTMLElement>('[data-cms="reviews"]').forEach((sec) => {
    sec.classList.add('cadm-editable');
    const bar = (sec.querySelector('.cadm-secbar') as HTMLElement) || makeSecbar(sec, 'reviews');
    bar.append(editChip('Edit reviews', openReviewsModal));
  });
  // Owners case-studies grid → Add chip creates a "Case studies" blog post
  // pre-flagged to show on the owners page; per-card Edit/Delete open that post.
  document.querySelectorAll<HTMLElement>('[data-cms="owner-cases"]').forEach((sec) => {
    const bar = (sec.querySelector('.cadm-secbar') as HTMLElement) || makeSecbar(sec, 'case-studies');
    bar.append(editChip('Add case study', () => openBlogModal(null, { category: 'Case studies', showOnOwners: true })));
  });
  // Home "Explore like a local" cards → Add chip creates a post flagged to show
  // on the home page; per-card Edit/Delete open that post.
  document.querySelectorAll<HTMLElement>('[data-cms="explore"]').forEach((sec) => {
    const bar = (sec.querySelector('.cadm-secbar') as HTMLElement) || makeSecbar(sec, 'explore');
    bar.append(editChip('Add explore card', () => openBlogModal(null, { category: 'Explore like a local', showOnHome: true })));
  });
  // Featured homes carousel → Add chip + Edit/Delete on each card
  document.querySelectorAll<HTMLElement>('[data-cms="featured-homes"]').forEach((sec) => {
    const bar = (sec.querySelector('.cadm-secbar') as HTMLElement) || makeSecbar(sec, 'featured-homes');
    bar.append(editChip('Add home', () => openFeaturedModal(null)));
  });
  // Guest photos gallery → Add chip + Edit/Delete on each tile
  document.querySelectorAll<HTMLElement>('[data-cms="guest-photos"]').forEach((sec) => {
    const bar = (sec.querySelector('.cadm-secbar') as HTMLElement) || makeSecbar(sec, 'guest-photos');
    bar.append(editChip('Add photo', () => openGuestModal(null)));
  });
  // Team grid → Add chip + Edit/Delete on each card
  document.querySelectorAll<HTMLElement>('[data-cms="team"]').forEach((sec) => {
    const bar = (sec.querySelector('.cadm-secbar') as HTMLElement) || makeSecbar(sec, 'team');
    bar.append(editChip('Add member', () => openTeamModal(null)));
  });
  // Owner testimonials → Add chip + Edit/Delete on each quote card
  document.querySelectorAll<HTMLElement>('[data-cms="owner-testimonials"]').forEach((sec) => {
    const bar = (sec.querySelector('.cadm-secbar') as HTMLElement) || makeSecbar(sec, 'owner-testimonials');
    bar.append(editChip('Add quote', () => openOwnerTestModal(null)));
  });
  // Neighborhood index → Add chip + Edit/Delete on each card
  document.querySelectorAll<HTMLElement>('[data-cms="neighborhoods"]').forEach((sec) => {
    const bar = (sec.querySelector('.cadm-secbar') as HTMLElement) || makeSecbar(sec, 'neighborhoods');
    bar.append(editChip('Add area', () => openHoodModal(null)));
  });
  // Neighborhood detail page → Edit-this-area chip
  document.querySelectorAll<HTMLElement>('[data-cms="neighborhood-detail"]').forEach((sec) => {
    const bar = (sec.querySelector('.cadm-secbar') as HTMLElement) || makeSecbar(sec, 'neighborhood');
    bar.append(editChip('Edit this area', () => openHoodModal(sec.getAttribute('data-nh-detail'))));
  });
  // Blog index → Add chip + Edit/Delete on each post card
  document.querySelectorAll<HTMLElement>('[data-cms="blog"]').forEach((sec) => {
    const bar = (sec.querySelector('.cadm-secbar') as HTMLElement) || makeSecbar(sec, 'blog');
    bar.append(editChip('Add article', () => openBlogModal(null)));
  });
  // Blog article page → Edit-this-article chip
  document.querySelectorAll<HTMLElement>('[data-cms="blog-article"]').forEach((sec) => {
    const bar = (sec.querySelector('.cadm-secbar') as HTMLElement) || makeSecbar(sec, 'article');
    bar.append(editChip('Edit this article', () => openBlogModal(sec.getAttribute('data-blog-detail'))));
  });
  decorateCaseCards();
  decorateExploreCards();
  decorateFeaturedCards();
  decorateGuestCards();
  decorateTeamCards();
  decorateOwnerTestCards();
  decorateHoodCards();
  decorateBlogCards();
}
function editChip(label: string, onClick: () => void): HTMLElement {
  return el('button', { class: 'cadm-chip', onclick: onClick, html: PENCIL + '<span>' + label + '</span>' });
}

// Owners case cards + home explore cards are both blog posts now, so their
// per-card controls open the blog editor for the card's slug (data-case /
// data-explore-slug both hold the post slug).
function decorateCaseCards() {
  const grid = document.querySelector('[data-cases]');
  if (!grid || !content) return;
  grid.querySelectorAll<HTMLElement>('.gcase[data-case]').forEach((card) => {
    if (card.querySelector('.cadm-edit-fab')) return;
    card.classList.add('cadm-hoverable');
    const slug = card.getAttribute('data-case')!;
    const editBtn = el('button', { class: 'cadm-edit-fab', title: 'Edit this case study', html: PENCIL, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); openBlogModal(slug); } });
    const delBtn = el('button', { class: 'cadm-edit-fab cadm-edit-fab--del', style: 'right:56px', title: 'Delete this case study', html: TRASH, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); deleteBlog(slug); } });
    card.append(delBtn, editBtn);
  });
}

function decorateExploreCards() {
  if (!content) return;
  document.querySelectorAll<HTMLElement>('[data-explore] .todo__card[data-explore-slug]').forEach((card) => {
    if (card.querySelector('.cadm-edit-fab')) return;
    card.classList.add('cadm-hoverable');
    const slug = card.getAttribute('data-explore-slug')!;
    const editBtn = el('button', { class: 'cadm-edit-fab', title: 'Edit this card', html: PENCIL, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); openBlogModal(slug); } });
    const delBtn = el('button', { class: 'cadm-edit-fab cadm-edit-fab--del', style: 'right:52px', title: 'Delete this card', html: TRASH, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); deleteBlog(slug); } });
    card.append(delBtn, editBtn);
  });
}

// ---------- featured homes ----------
function decorateFeaturedCards() {
  const track = document.querySelector('[data-fh-track]');
  if (!track || !content) return;
  track.querySelectorAll<HTMLElement>('.scard[data-fh-id]').forEach((card) => {
    if (card.querySelector('.cadm-edit-fab')) return;
    card.classList.add('cadm-hoverable');
    const id = card.getAttribute('data-fh-id')!;
    const editBtn = el('button', { class: 'cadm-edit-fab', title: 'Edit this home', html: PENCIL, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); openFeaturedModal(id); } });
    const delBtn = el('button', { class: 'cadm-edit-fab cadm-edit-fab--del', style: 'right:56px', title: 'Delete this home', html: TRASH, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); deleteFeatured(id); } });
    card.append(delBtn, editBtn);
  });
}

async function deleteFeatured(id: string) {
  if (!content) return;
  ensureFeaturedSeeded();
  const h = content.featuredHomes.find((x) => x.id === id);
  if (!confirm(`Remove “${h?.name || id}” from Homes we love? Applies on publish.`)) return;
  content.featuredHomes = content.featuredHomes.filter((x) => x.id !== id);
  try { await persist({ featuredHomes: content.featuredHomes }); applyDraftToPage(); toast('Home removed (draft).'); }
  catch (e) { toast((e as Error).message, true); }
}

// The first edit/add/delete on the still-static carousel captures every shown
// card into the CMS list, so mutating one never drops the others.
function ensureFeaturedSeeded() {
  if (!content) return;
  const list = content.featuredHomes || (content.featuredHomes = []);
  if (list.length) return;
  seedFeaturedFromDom();
}

// Read a statically-rendered featured card from the DOM.
function featuredFromCard(id: string): FeaturedHomeItem | null {
  const card = document.querySelector(`.scard[data-fh-id="${cssSel(id)}"]`);
  if (!card) return null;
  const specs = Array.from(card.querySelectorAll('.scard__specs span')).map((s) => (s.textContent || '').trim());
  return {
    id,
    name: (card.querySelector('.scard__name')?.textContent || '').trim(),
    neighborhood: (card.querySelector('.scard__loc')?.textContent || '').trim(),
    beds: specs[0] || '', baths: specs[1] || '', guests: specs[2] || '',
    photo: card.querySelector('img')?.getAttribute('src') || '',
    bookingUrl: card.getAttribute('href') || '',
    premier: !!card.querySelector('.scard__premier'),
    featured: true,
  };
}
// Capture every currently-shown card into the CMS list (used before a delete so
// the other seed cards survive the transition to CMS-managed).
function seedFeaturedFromDom() {
  if (!content) return;
  const ids = Array.from(document.querySelectorAll('.scard[data-fh-id]')).map((c) => c.getAttribute('data-fh-id') || '');
  const seeded = ids.map((id) => featuredFromCard(id)).filter(Boolean) as FeaturedHomeItem[];
  if (seeded.length) content.featuredHomes = seeded;
}

function openFeaturedModal(id: string | null) {
  if (!content) return;
  ensureFeaturedSeeded();
  const list = content.featuredHomes;
  const existing = id ? list.find((x) => x.id === id) : null;
  const h: FeaturedHomeItem = existing ? { ...existing }
    : (id && featuredFromCard(id)) || { id: id || '', name: '', neighborhood: '', beds: '', baths: '', guests: '', photo: '', bookingUrl: '', premier: false, featured: true };
  const f = {
    name: field('Name', h.name), hood: field('Neighborhood', h.neighborhood),
    beds: field('Beds (e.g. 4 bedrooms)', h.beds), baths: field('Baths (e.g. 3 bathrooms)', h.baths), guests: field('Guests (e.g. 8 guests)', h.guests),
    photo: photoField('Photo', h.photo),
    booking: field('Booking page URL (where the card links)', h.bookingUrl, { wide: true }),
  };
  const prem = el('input', { type: 'checkbox' }) as HTMLInputElement; prem.checked = h.premier === true;
  const premWrap = el('label', { class: 'cadm-field' }, [el('span', {}, ['“Premier” ribbon']), prem]);
  const feat = el('input', { type: 'checkbox' }) as HTMLInputElement; feat.checked = h.featured !== false;
  const featWrap = el('label', { class: 'cadm-field' }, [el('span', {}, ['Show on home page']), feat]);
  modal(existing ? `Edit home — ${h.name}` : 'New featured home', [
    el('div', { class: 'cadm-grid2' }, [f.name.wrap, f.hood.wrap, f.beds.wrap, f.baths.wrap, f.guests.wrap]),
    f.photo.wrap, f.booking.wrap,
    el('div', { class: 'cadm-grid2' }, [premWrap, featWrap]),
  ], async () => {
    h.name = f.name.get(); h.neighborhood = f.hood.get(); h.beds = f.beds.get(); h.baths = f.baths.get(); h.guests = f.guests.get();
    h.photo = f.photo.get(); h.bookingUrl = f.booking.get(); h.premier = prem.checked; h.featured = feat.checked;
    if (!h.name.trim()) throw new Error('Name is required.');
    if (!h.id) h.id = slugify(h.name);
    const list = content!.featuredHomes.slice();
    const idx = list.findIndex((x) => x.id === h.id);
    if (idx >= 0) list[idx] = h; else list.push(h);
    content!.featuredHomes = list;
    await persist({ featuredHomes: list });
    applyDraftToPage();
  });
}

// ---------- guest photos ----------
function decorateGuestCards() {
  const grid = document.querySelector('[data-guest-grid]');
  if (!grid || !content) return;
  grid.querySelectorAll<HTMLElement>('.feed__item[data-gp-id]').forEach((card) => {
    if (card.querySelector('.cadm-edit-fab')) return;
    card.classList.add('cadm-hoverable');
    const id = card.getAttribute('data-gp-id')!;
    const editBtn = el('button', { class: 'cadm-edit-fab', title: 'Edit this photo', html: PENCIL, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); openGuestModal(id); } });
    const delBtn = el('button', { class: 'cadm-edit-fab cadm-edit-fab--del', style: 'right:52px', title: 'Delete this photo', html: TRASH, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); deleteGuest(id); } });
    card.append(delBtn, editBtn);
  });
}
function guestFromCard(id: string): GuestPhotoItem | null {
  const card = document.querySelector(`.feed__item[data-gp-id="${cssSel(id)}"]`);
  if (!card) return null;
  return {
    id,
    photo: card.querySelector('img')?.getAttribute('src') || '',
    location: (card.querySelector('.feed__loc')?.textContent || '').trim(),
    big: card.classList.contains('big'),
  };
}
function ensureGuestSeeded() {
  if (!content) return;
  const list = content.guestPhotos || (content.guestPhotos = []);
  if (list.length) return;
  const ids = Array.from(document.querySelectorAll('.feed__item[data-gp-id]')).map((c) => c.getAttribute('data-gp-id') || '');
  const seeded = ids.map((id) => guestFromCard(id)).filter(Boolean) as GuestPhotoItem[];
  if (seeded.length) content.guestPhotos = seeded;
}
async function deleteGuest(id: string) {
  if (!content) return;
  ensureGuestSeeded();
  if (!confirm('Remove this photo? Applies on publish.')) return;
  content.guestPhotos = content.guestPhotos.filter((x) => x.id !== id);
  try { await persist({ guestPhotos: content.guestPhotos }); applyDraftToPage(); toast('Photo removed (draft).'); }
  catch (e) { toast((e as Error).message, true); }
}
function openGuestModal(id: string | null) {
  if (!content) return;
  ensureGuestSeeded();
  const list = content.guestPhotos;
  const existing = id ? list.find((x) => x.id === id) : null;
  const g: GuestPhotoItem = existing ? { ...existing }
    : (id && guestFromCard(id)) || { id: id || '', photo: '', location: '', big: false };
  const photo = photoField('Photo', g.photo);
  const loc = field('Location label (e.g. La Jolla)', g.location);
  const big = el('input', { type: 'checkbox' }) as HTMLInputElement; big.checked = g.big === true;
  const bigWrap = el('label', { class: 'cadm-field' }, [el('span', {}, ['Large lead tile']), big]);
  modal(existing ? 'Edit guest photo' : 'New guest photo', [
    photo.wrap, loc.wrap, bigWrap,
  ], async () => {
    g.photo = photo.get(); g.location = loc.get(); g.big = big.checked;
    if (!g.photo.trim()) throw new Error('A photo is required.');
    if (!g.id) g.id = 'gp-' + (list.length + 1) + '-' + slugify(g.location || 'photo');
    const next = list.slice();
    const idx = next.findIndex((x) => x.id === g.id);
    if (idx >= 0) next[idx] = g; else next.push(g);
    content!.guestPhotos = next;
    await persist({ guestPhotos: next });
    applyDraftToPage();
  });
}

// ---------- team members ----------
function decorateTeamCards() {
  const grid = document.querySelector('[data-team-grid]');
  if (!grid || !content) return;
  grid.querySelectorAll<HTMLElement>('.team__card[data-team-id]').forEach((card) => {
    if (card.querySelector('.cadm-edit-fab')) return;
    card.classList.add('cadm-hoverable');
    const id = card.getAttribute('data-team-id')!;
    const editBtn = el('button', { class: 'cadm-edit-fab', title: 'Edit this member', html: PENCIL, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); openTeamModal(id); } });
    const delBtn = el('button', { class: 'cadm-edit-fab cadm-edit-fab--del', style: 'right:52px', title: 'Remove this member', html: TRASH, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); deleteTeam(id); } });
    card.append(delBtn, editBtn);
  });
}
function teamFromCard(id: string): TeamMemberItem | null {
  const card = document.querySelector(`.team__card[data-team-id="${cssSel(id)}"]`);
  if (!card) return null;
  return {
    id,
    name: (card.querySelector('h3')?.textContent || '').trim(),
    role: (card.querySelector('.team__role')?.textContent || '').trim(),
    photo: card.querySelector('img')?.getAttribute('src') || '',
  };
}
function ensureTeamSeeded() {
  if (!content) return;
  const list = content.teamMembers || (content.teamMembers = []);
  if (list.length) return;
  const ids = Array.from(document.querySelectorAll('.team__card[data-team-id]')).map((c) => c.getAttribute('data-team-id') || '');
  const seeded = ids.map((id) => teamFromCard(id)).filter(Boolean) as TeamMemberItem[];
  if (seeded.length) content.teamMembers = seeded;
}
async function deleteTeam(id: string) {
  if (!content) return;
  ensureTeamSeeded();
  const m = content.teamMembers.find((x) => x.id === id);
  if (!confirm(`Remove ${m?.name || 'this member'} from the team? Applies on publish.`)) return;
  content.teamMembers = content.teamMembers.filter((x) => x.id !== id);
  try { await persist({ teamMembers: content.teamMembers }); applyDraftToPage(); toast('Member removed (draft).'); }
  catch (e) { toast((e as Error).message, true); }
}
function openTeamModal(id: string | null) {
  if (!content) return;
  ensureTeamSeeded();
  const list = content.teamMembers;
  const existing = id ? list.find((x) => x.id === id) : null;
  const m: TeamMemberItem = existing ? { ...existing }
    : (id && teamFromCard(id)) || { id: id || '', name: '', role: '', photo: '' };
  const name = field('Name', m.name);
  const role = field('Role', m.role);
  const photo = photoField('Photo', m.photo);
  modal(existing ? `Edit member — ${m.name}` : 'New team member', [
    el('div', { class: 'cadm-grid2' }, [name.wrap, role.wrap]),
    photo.wrap,
  ], async () => {
    m.name = name.get(); m.role = role.get(); m.photo = photo.get();
    if (!m.name.trim()) throw new Error('Name is required.');
    if (!m.id) m.id = slugify(m.name);
    const next = list.slice();
    const idx = next.findIndex((x) => x.id === m.id);
    if (idx >= 0) next[idx] = m; else next.push(m);
    content!.teamMembers = next;
    await persist({ teamMembers: next });
    applyDraftToPage();
  });
}

// ---------- owner testimonials ----------
function decorateOwnerTestCards() {
  const grid = document.querySelector('[data-otest-grid]');
  if (!grid || !content) return;
  grid.querySelectorAll<HTMLElement>('.otest__card[data-ot-id]').forEach((card) => {
    if (card.querySelector('.cadm-edit-fab')) return;
    card.classList.add('cadm-hoverable');
    const id = card.getAttribute('data-ot-id')!;
    const editBtn = el('button', { class: 'cadm-edit-fab', title: 'Edit this quote', html: PENCIL, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); openOwnerTestModal(id); } });
    const delBtn = el('button', { class: 'cadm-edit-fab cadm-edit-fab--del', style: 'right:52px', title: 'Remove this quote', html: TRASH, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); deleteOwnerTest(id); } });
    card.append(delBtn, editBtn);
  });
}
function ownerTestFromCard(id: string): OwnerTestimonialItem | null {
  const card = document.querySelector(`.otest__card[data-ot-id="${cssSel(id)}"]`);
  if (!card) return null;
  return {
    id,
    quote: (card.querySelector('.otest__quote')?.textContent || '').replace(/^[“"]|[”"]$/g, '').trim(),
    name: (card.querySelector('.otest__name')?.textContent || '').trim(),
    home: (card.querySelector('.otest__home')?.textContent || '').trim(),
  };
}
function ensureOwnerTestSeeded() {
  if (!content) return;
  const list = content.ownerTestimonials || (content.ownerTestimonials = []);
  if (list.length) return;
  const ids = Array.from(document.querySelectorAll('.otest__card[data-ot-id]')).map((c) => c.getAttribute('data-ot-id') || '');
  const seeded = ids.map((id) => ownerTestFromCard(id)).filter(Boolean) as OwnerTestimonialItem[];
  if (seeded.length) content.ownerTestimonials = seeded;
}
async function deleteOwnerTest(id: string) {
  if (!content) return;
  ensureOwnerTestSeeded();
  if (!confirm('Remove this testimonial? Applies on publish.')) return;
  content.ownerTestimonials = content.ownerTestimonials.filter((x) => x.id !== id);
  try { await persist({ ownerTestimonials: content.ownerTestimonials }); applyDraftToPage(); toast('Testimonial removed (draft).'); }
  catch (e) { toast((e as Error).message, true); }
}
function openOwnerTestModal(id: string | null) {
  if (!content) return;
  ensureOwnerTestSeeded();
  const list = content.ownerTestimonials;
  const existing = id ? list.find((x) => x.id === id) : null;
  const t: OwnerTestimonialItem = existing ? { ...existing }
    : (id && ownerTestFromCard(id)) || { id: id || '', quote: '', name: '', home: '' };
  const quote = field('Quote', t.quote, { wide: true, textarea: true });
  const name = field('Name', t.name);
  const home = field('Home (e.g. Oceanfront condo, Pacific Beach)', t.home);
  modal(existing ? `Edit testimonial — ${t.name}` : 'New owner testimonial', [
    quote.wrap,
    el('div', { class: 'cadm-grid2' }, [name.wrap, home.wrap]),
  ], async () => {
    t.quote = quote.get(); t.name = name.get(); t.home = home.get();
    if (!t.quote.trim()) throw new Error('A quote is required.');
    if (!t.id) t.id = slugify(t.name || 'owner');
    const next = list.slice();
    const idx = next.findIndex((x) => x.id === t.id);
    if (idx >= 0) next[idx] = t; else next.push(t);
    content!.ownerTestimonials = next;
    await persist({ ownerTestimonials: next });
    applyDraftToPage();
  });
}

// ---------- neighborhoods ----------
// A repeating list of rows, each with the given columns. Used for stats and
// local-guide items in the neighborhood editor.
function repeater(label: string, rows: Record<string, string>[], cols: { key: string; label: string; textarea?: boolean }[]): { wrap: HTMLElement; get: () => Record<string, string>[] } {
  const list = rows.map((r) => ({ ...r }));
  const body = el('div', {});
  function render() {
    body.innerHTML = '';
    list.forEach((row, i) => {
      const inputs = cols.map((c) => {
        const f = field(c.label, row[c.key] || '', { textarea: c.textarea });
        const input = f.wrap.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;
        input.addEventListener('input', () => { row[c.key] = input.value; });
        return f.wrap;
      });
      body.append(el('div', { class: 'cadm-card-row' }, [
        ...inputs,
        el('button', { class: 'cadm-mbtn cadm-mbtn--ghost', onclick: () => { list.splice(i, 1); render(); } }, ['Remove']),
      ]));
    });
  }
  render();
  const wrap = el('div', { class: 'cadm-field cadm-wide' }, [
    el('span', {}, [label]),
    body,
    el('button', { class: 'cadm-mbtn cadm-mbtn--ghost', onclick: () => { const blank: Record<string, string> = {}; cols.forEach((c) => (blank[c.key] = '')); list.push(blank); render(); } }, ['+ Add row']),
  ]);
  return { wrap, get: () => list.filter((r) => cols.some((c) => (r[c.key] || '').trim())) };
}

// When the CMS is empty the page shows the baked seed; the full seed data is
// embedded as JSON on the page so the editor can load and re-save all fields.
function ensureNeighborhoodsSeeded() {
  if (!content) return;
  const list = content.neighborhoods || (content.neighborhoods = []);
  if (list.length) return;
  const embed = document.querySelector('[data-nh-seed]');
  if (embed) {
    try { const seed = JSON.parse(embed.textContent || '[]'); if (Array.isArray(seed) && seed.length) content.neighborhoods = seed; } catch { /* ignore */ }
  }
}
function decorateHoodCards() {
  const grid = document.querySelector('[data-nh-grid]');
  if (!grid || !content) return;
  grid.querySelectorAll<HTMLElement>('.nh-card[data-nh-id]').forEach((card) => {
    if (card.querySelector('.cadm-edit-fab')) return;
    card.classList.add('cadm-hoverable');
    const slug = card.getAttribute('data-nh-id')!;
    const editBtn = el('button', { class: 'cadm-edit-fab', title: 'Edit this area', html: PENCIL, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); openHoodModal(slug); } });
    const delBtn = el('button', { class: 'cadm-edit-fab cadm-edit-fab--del', style: 'right:52px', title: 'Delete this area', html: TRASH, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); deleteHood(slug); } });
    card.append(delBtn, editBtn);
  });
}
async function deleteHood(slug: string) {
  if (!content) return;
  ensureNeighborhoodsSeeded();
  const n = content.neighborhoods.find((x) => x.slug === slug);
  if (!confirm(`Delete ${n?.name || 'this area'}? Applies on publish (its page is removed at the next deploy).`)) return;
  content.neighborhoods = content.neighborhoods.filter((x) => x.slug !== slug);
  try { await persist({ neighborhoods: content.neighborhoods }); applyDraftToPage(); toast('Area removed (draft).'); }
  catch (e) { toast((e as Error).message, true); }
}
function openHoodModal(slug: string | null) {
  if (!content) return;
  ensureNeighborhoodsSeeded();
  const list = content.neighborhoods;
  const existing = slug ? list.find((x) => x.slug === slug) : null;
  const n: NeighborhoodItem = existing ? JSON.parse(JSON.stringify(existing))
    : { slug: '', name: '', note: '', img: '', seo: { title: '', description: '' }, intro: '', stats: [], body: [], highlights: [], asideText: '', guide: { lede: '', items: [] }, ctaText: '' };
  const name = field('Name', n.name);
  const note = field('Card subtitle', n.note);
  const img = photoField('Hero image', n.img);
  const intro = field('Intro (hero paragraph)', n.intro, { wide: true, textarea: true });
  const stats = repeater('Market stats', (n.stats || []).map((s) => ({ v: s.v, l: s.l })), [{ key: 'v', label: 'Value' }, { key: 'l', label: 'Label' }]);
  const body = field('Body paragraphs (leave a blank line between paragraphs)', (n.body || []).join('\n\n'), { wide: true, textarea: true });
  const highlights = field('“Why owners choose Cardo” highlights (one per line)', (n.highlights || []).join('\n'), { wide: true, textarea: true });
  const aside = field('Aside box text', n.asideText, { wide: true, textarea: true });
  const guideLede = field('Local guide lede', n.guide?.lede || '', { wide: true, textarea: true });
  const guide = repeater('Local guide items', (n.guide?.items || []).map((g) => ({ k: g.k, v: g.v, d: g.d })), [{ key: 'k', label: 'Kicker (e.g. Eat)' }, { key: 'v', label: 'Title' }, { key: 'd', label: 'Description', textarea: true }]);
  const cta = field('Closing CTA text', n.ctaText, { wide: true, textarea: true });
  const seoT = field('SEO title', n.seo?.title || '', { wide: true });
  const seoD = field('SEO description', n.seo?.description || '', { wide: true, textarea: true });
  modal(existing ? `Edit area — ${n.name}` : 'New neighborhood', [
    el('div', { class: 'cadm-grid2' }, [name.wrap, note.wrap]),
    img.wrap, intro.wrap,
    el('div', { class: 'cadm-subhead' }, ['Market']), stats.wrap, body.wrap, highlights.wrap, aside.wrap,
    el('div', { class: 'cadm-subhead' }, ['Local guide']), guideLede.wrap, guide.wrap,
    el('div', { class: 'cadm-subhead' }, ['Closing & SEO']), cta.wrap, seoT.wrap, seoD.wrap,
  ], async () => {
    n.name = name.get(); n.note = note.get(); n.img = img.get();
    n.intro = intro.get();
    n.stats = stats.get().map((r) => ({ v: r.v, l: r.l }));
    n.body = body.get().split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
    n.highlights = highlights.get().split('\n').map((s) => s.trim()).filter(Boolean);
    n.asideText = aside.get();
    n.guide = { lede: guideLede.get(), items: guide.get().map((r) => ({ k: r.k, v: r.v, d: r.d })) };
    n.ctaText = cta.get();
    n.seo = { title: seoT.get(), description: seoD.get() };
    if (!n.name.trim()) throw new Error('Name is required.');
    if (!n.slug) n.slug = slugify(n.name);
    const next = list.slice();
    const idx = next.findIndex((x) => x.slug === n.slug);
    if (idx >= 0) next[idx] = n; else next.push(n);
    content!.neighborhoods = next;
    await persist({ neighborhoods: next });
    applyDraftToPage();
  });
}

// ---------- blog articles ----------
function ensureBlogSeeded() {
  if (!content) return;
  const list = content.blog || (content.blog = []);
  if (list.length) return;
  const embed = document.querySelector('[data-blog-seed]');
  if (embed) {
    try { const seed = JSON.parse(embed.textContent || '[]'); if (Array.isArray(seed) && seed.length) content.blog = seed; } catch { /* ignore */ }
  }
}
function decorateBlogCards() {
  if (!content) return;
  document.querySelectorAll<HTMLElement>('.feat[data-blog-slug], [data-blog-grid] .post[data-blog-slug]').forEach((card) => {
    if (card.querySelector('.cadm-edit-fab')) return;
    card.classList.add('cadm-hoverable');
    const slug = card.getAttribute('data-blog-slug')!;
    const editBtn = el('button', { class: 'cadm-edit-fab', title: 'Edit this article', html: PENCIL, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); openBlogModal(slug); } });
    const delBtn = el('button', { class: 'cadm-edit-fab cadm-edit-fab--del', style: 'right:52px', title: 'Delete this article', html: TRASH, onclick: (e: Event) => { e.preventDefault(); e.stopPropagation(); deleteBlog(slug); } });
    card.append(delBtn, editBtn);
  });
}
async function deleteBlog(slug: string) {
  if (!content) return;
  ensureBlogSeeded();
  const a = content.blog.find((x) => x.slug === slug);
  if (!confirm(`Delete “${a?.title || slug}”? Applies on publish (its page is removed at the next deploy).`)) return;
  content.blog = content.blog.filter((x) => x.slug !== slug);
  try { await persist({ blog: content.blog }); applyDraftToPage(); toast('Article removed (draft).'); }
  catch (e) { toast((e as Error).message, true); }
}
// Blog posts are the single source of truth: the same editor covers the blog
// index/detail pages, the home "Explore like a local" cards (showOnHome +
// localTip), and the owners "Case studies" grid + preview popup (showOnOwners +
// the caseStudy block). `preset` pre-fills a new post opened from one of those
// section "Add …" chips.
function openBlogModal(slug: string | null, preset?: Partial<BlogArticleItem>) {
  if (!content) return;
  ensureBlogSeeded();
  const list = content.blog;
  const existing = slug ? list.find((x) => x.slug === slug) : null;
  const a: BlogArticleItem = existing ? JSON.parse(JSON.stringify(existing))
    : { slug: '', title: '', category: '', excerpt: '', readTime: '', dateFull: '', dateShort: '', img: '', featured: false, seo: { title: '', description: '' }, author: { name: '', initials: '' }, heroCaption: '', bodyHtml: '', localTip: '', showOnHome: false, showOnOwners: false, ...(preset || {}) };
  const cs = a.caseStudy || { name: '', hood: '', beds: '', revenue: '', nightly: '', lift: '', gallery: [] };
  const title = field('Title', a.title);
  const category = field('Category', a.category);
  const excerpt = field('Excerpt / blurb (card summary)', a.excerpt, { wide: true, textarea: true });
  const img = photoField('Hero / card image', a.img);
  const heroCaption = field('Hero caption', a.heroCaption, { wide: true });
  const readTime = field('Read time (e.g. 8 min read)', a.readTime);
  const dateFull = field('Date (full, e.g. June 18, 2026)', a.dateFull);
  const dateShort = field('Date (short, e.g. Jun 2026)', a.dateShort);
  const authorName = field('Author name', a.author?.name || '');
  const authorInit = field('Author initials', a.author?.initials || '');
  const featured = el('input', { type: 'checkbox' }) as HTMLInputElement; featured.checked = a.featured === true;
  const featWrap = el('label', { class: 'cadm-field' }, [el('span', {}, ['Featured (top of blog)']), featured]);
  const bodyHtml = field('Body (HTML — use <p>, <h2>, <blockquote>, <ul><li>…)', a.bodyHtml, { wide: true, textarea: true });
  (bodyHtml.wrap.querySelector('textarea') as HTMLTextAreaElement).style.minHeight = '260px';
  const seoT = field('SEO title', a.seo?.title || '', { wide: true });
  const seoD = field('SEO description', a.seo?.description || '', { wide: true, textarea: true });

  // Placement toggles — surface the post as a card elsewhere.
  const showHome = el('input', { type: 'checkbox' }) as HTMLInputElement; showHome.checked = a.showOnHome === true;
  const showHomeWrap = el('label', { class: 'cadm-field' }, [el('span', {}, ['Show on home page (Explore like a local)']), showHome]);
  const localTip = field('Local tip (home card)', a.localTip || '');
  const showOwners = el('input', { type: 'checkbox' }) as HTMLInputElement; showOwners.checked = a.showOnOwners === true;
  const showOwnersWrap = el('label', { class: 'cadm-field' }, [el('span', {}, ['Show on owners page (Case studies)']), showOwners]);

  // Case-study details — feed the owners card + preview popup.
  const csName = field('Home name (e.g. Falcon)', cs.name || '');
  const csHood = field('Neighborhood', cs.hood || '');
  const csBeds = field('Beds (e.g. 4 BR)', cs.beds || '');
  const csRevenue = field('Annual revenue (e.g. $214,800)', cs.revenue || '');
  const csNightly = field('Nightly (e.g. $589 / night)', cs.nightly || '');
  const csLift = field('Lift vs market (e.g. +57% over market)', cs.lift || '');
  const csGallery = field('Popup gallery image URLs (one per line)', (cs.gallery || []).join('\n'), { wide: true, textarea: true });

  modal(existing ? `Edit post — ${a.title}` : 'New blog post', [
    el('div', { class: 'cadm-grid2' }, [title.wrap, category.wrap]),
    excerpt.wrap, img.wrap, heroCaption.wrap,
    el('div', { class: 'cadm-grid2' }, [readTime.wrap, dateFull.wrap, dateShort.wrap]),
    el('div', { class: 'cadm-grid2' }, [authorName.wrap, authorInit.wrap]),
    featWrap,
    el('div', { class: 'cadm-subhead' }, ['Placement']),
    showHomeWrap, localTip.wrap, showOwnersWrap,
    el('div', { class: 'cadm-subhead' }, ['Case study details (owners card + popup)']),
    el('div', { class: 'cadm-grid2' }, [csName.wrap, csHood.wrap, csBeds.wrap, csRevenue.wrap, csNightly.wrap, csLift.wrap]),
    csGallery.wrap,
    el('div', { class: 'cadm-subhead' }, ['Article body']), bodyHtml.wrap,
    el('div', { class: 'cadm-subhead' }, ['SEO']), seoT.wrap, seoD.wrap,
  ], async () => {
    a.title = title.get(); a.category = category.get(); a.excerpt = excerpt.get(); a.img = img.get();
    a.heroCaption = heroCaption.get(); a.readTime = readTime.get(); a.dateFull = dateFull.get(); a.dateShort = dateShort.get();
    a.author = { name: authorName.get(), initials: authorInit.get() };
    a.featured = featured.checked; a.bodyHtml = bodyHtml.get();
    a.seo = { title: seoT.get(), description: seoD.get() };
    a.localTip = localTip.get(); a.showOnHome = showHome.checked; a.showOnOwners = showOwners.checked;
    const gallery = csGallery.get().split('\n').map((s) => s.trim()).filter(Boolean);
    if (showOwners.checked || csName.get().trim() || csRevenue.get().trim()) {
      a.caseStudy = { name: csName.get(), hood: csHood.get(), beds: csBeds.get(), revenue: csRevenue.get(), nightly: csNightly.get(), lift: csLift.get(), gallery };
    } else {
      delete a.caseStudy;
    }
    if (!a.title.trim()) throw new Error('Title is required.');
    if (!a.slug) a.slug = slugify(a.title);
    const next = list.slice();
    const idx = next.findIndex((x) => x.slug === a.slug);
    if (idx >= 0) next[idx] = a; else next.push(a);
    content!.blog = next;
    await persist({ blog: next });
    applyDraftToPage();
  });
}

// ---------- modal framework ----------
function modal(title: string, bodyKids: (Node | string)[], onSave: () => Promise<void> | void): void {
  const err = el('p', { class: 'cadm-err', style: 'display:none' });
  const saveBtn = el('button', { class: 'cadm-mbtn cadm-mbtn--primary' }, ['Save draft']) as HTMLButtonElement;
  const scrim = el('div', { class: 'cadm-modal-scrim' });
  const close = () => scrim.remove();
  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; err.style.display = 'none';
    try { await onSave(); close(); toast('Saved to draft.'); }
    catch (e) { err.textContent = (e as Error).message; err.style.display = 'block'; saveBtn.disabled = false; saveBtn.textContent = 'Save draft'; }
  });
  scrim.append(el('div', { class: 'cadm-modal' }, [
    el('div', { class: 'cadm-modal__head' }, [el('h3', {}, [title])]),
    el('div', { class: 'cadm-modal__body' }, [...bodyKids, err]),
    el('div', { class: 'cadm-modal__foot' }, [
      el('span', { class: 'cadm-note' }, ['Saved as a draft — nothing goes live until you Publish.']),
      el('span', { class: 'cadm-spacer' }),
      el('button', { class: 'cadm-mbtn cadm-mbtn--ghost', onclick: close }, ['Cancel']),
      saveBtn,
    ]),
  ]));
  scrim.addEventListener('click', (e) => { if (e.target === scrim) close(); });
  document.body.append(scrim);
}
function field(label: string, value: string, opts: { wide?: boolean; textarea?: boolean } = {}): { wrap: HTMLElement; get: () => string } {
  const input = opts.textarea ? el('textarea', {}, [value]) : el('input', { value });
  const wrap = el('label', { class: 'cadm-field' + (opts.wide ? ' cadm-wide' : '') }, [el('span', {}, [label]), input]);
  return { wrap, get: () => (input as HTMLInputElement | HTMLTextAreaElement).value };
}

// A photo field: URL input + Upload button (Storage) + live preview. Editors
// can paste a URL or upload a file — upload fills the URL with the hosted image.
function photoField(label: string, value: string): { wrap: HTMLElement; get: () => string } {
  const input = el('input', { value, placeholder: 'https://…  or upload →' }) as HTMLInputElement;
  const preview = el('img', { class: 'cadm-photo-preview', style: value ? '' : 'display:none' }) as HTMLImageElement;
  if (value) preview.src = value;
  const set = (v: string) => { input.value = v; preview.src = v; preview.style.display = v ? '' : 'none'; };
  input.addEventListener('input', () => set(input.value));
  const file = el('input', { type: 'file', accept: 'image/*', style: 'display:none' }) as HTMLInputElement;
  const up = el('button', { class: 'cadm-mbtn cadm-mbtn--ghost', type: 'button', onclick: () => file.click() }, ['Upload']) as HTMLButtonElement;
  file.addEventListener('change', async () => {
    const f = file.files && file.files[0]; if (!f) return;
    up.disabled = true; up.textContent = 'Uploading…';
    try { set(await uploadPhoto(f)); toast('Photo uploaded.'); }
    catch (e) { toast((e as Error).message, true); }
    finally { up.disabled = false; up.textContent = 'Upload'; file.value = ''; }
  });
  const wrap = el('div', { class: 'cadm-field cadm-wide' }, [
    el('span', {}, [label]),
    el('div', { class: 'cadm-photo-row' }, [input, up, file]),
    preview,
  ]);
  return { wrap, get: () => input.value };
}

function cssSel(s: string): string {
  return (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(s) : s.replace(/["\\]/g, '\\$&');
}
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'case-' + Date.now();
}

// ---------- reviews modal ----------
function openReviewsModal() {
  if (!content) return;
  const rv: ReviewsDoc = JSON.parse(JSON.stringify(content.reviews || { google: {}, airbnb: {} }));
  rv.google = rv.google || {}; rv.airbnb = rv.airbnb || {};
  const placeId = field('Google Place ID', rv.google.placeId || '', { wide: true });
  const minSel = el('select', {}, [5, 4, 3, 2, 1].map((n) => el('option', { value: n }, [n === 1 ? 'Show all reviews' : `${n} stars and up`]))) as HTMLSelectElement;
  minSel.value = String(rv.google.minStars ?? 5);
  const gRating = el('span', { class: 'cadm-note' }, [`Current: ${rv.google.rating ?? '—'} ★ · ${rv.google.count ?? '—'} reviews`]);
  const syncBtn = el('button', { class: 'cadm-mbtn cadm-mbtn--ghost', type: 'button' }, ['Sync from Google now']) as HTMLButtonElement;
  syncBtn.addEventListener('click', async () => {
    syncBtn.disabled = true; syncBtn.textContent = 'Syncing…';
    try {
      const r = await syncGoogle(placeId.get() || undefined);
      gRating.textContent = `Synced: ${r.rating} ★ · ${r.count} reviews · ${r.reviews} cards`;
      setDirty(true);
      content = await getContent(); // pull the freshly-synced draft
    } catch (e) { toast((e as Error).message, true); }
    finally { syncBtn.disabled = false; syncBtn.textContent = 'Sync from Google now'; }
  });
  const aRating = field('Airbnb rating', String(rv.airbnb.rating ?? ''));
  const aCount = field('Airbnb review count', String(rv.airbnb.count ?? ''));

  // Airbnb cards editor
  const cardsWrap = el('div', {});
  const cards: ReviewCard[] = (rv.airbnb.reviews || []).map((c) => ({ ...c }));
  function renderCards() {
    cardsWrap.innerHTML = '';
    cards.forEach((card, i) => {
      const nm = field('Name', card.name); const mt = field('Meta', card.meta);
      const st = field('Stars (1–5)', String(card.stars || 5)); const tx = field('Text', card.text, { wide: true, textarea: true });
      nm.wrap.querySelector('input')!.addEventListener('input', (e) => card.name = (e.target as HTMLInputElement).value);
      mt.wrap.querySelector('input')!.addEventListener('input', (e) => card.meta = (e.target as HTMLInputElement).value);
      st.wrap.querySelector('input')!.addEventListener('input', (e) => card.stars = Math.min(5, Math.max(1, Number((e.target as HTMLInputElement).value) || 5)));
      tx.wrap.querySelector('textarea')!.addEventListener('input', (e) => card.text = (e.target as HTMLTextAreaElement).value);
      const row = el('div', { class: 'cadm-card-row' }, [
        el('div', { class: 'cadm-grid2' }, [nm.wrap, mt.wrap, st.wrap]), tx.wrap,
        el('button', { class: 'cadm-mbtn cadm-mbtn--ghost', onclick: () => { cards.splice(i, 1); renderCards(); } }, ['Remove']),
      ]);
      cardsWrap.append(row);
    });
  }
  renderCards();

  modal('Edit reviews', [
    el('div', { class: 'cadm-subhead' }, ['Google (live sync)']),
    placeId.wrap,
    el('label', { class: 'cadm-field' }, [el('span', {}, ['Minimum stars shown on site']), minSel]),
    el('div', { class: 'cadm-card-row' }, [gRating, el('div', { style: 'margin-top:8px' }, [syncBtn])]),
    el('div', { class: 'cadm-subhead' }, ['Airbnb (managed here)']),
    el('div', { class: 'cadm-grid2' }, [aRating.wrap, aCount.wrap]),
    cardsWrap,
    el('button', { class: 'cadm-mbtn cadm-mbtn--ghost', html: PLUS + ' Add Airbnb review', onclick: () => { cards.push({ name: '', meta: '', stars: 5, text: '' }); renderCards(); } }),
  ], async () => {
    const patch: Partial<ReviewsDoc> = {
      google: { ...rv.google, placeId: placeId.get(), minStars: Number(minSel.value) },
      airbnb: { rating: Number(aRating.get()) || null, count: Number(aCount.get()) || null, reviews: cards },
    };
    content!.reviews = { google: { ...content!.reviews.google, ...patch.google }, airbnb: patch.airbnb! };
    await persist({ reviews: patch });
    applyDraftToPage();
  });
}

boot();
