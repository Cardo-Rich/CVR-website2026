/* Owners-page content hydration, shared by the public path (owners.js, reads
   published /api/content) and the inline admin layer (reads draft, re-renders
   after each edit). Pure DOM functions — same output either way. */

function num(n) { return (typeof n === 'number' && isFinite(n) && n > 0) ? n : null; }
function fmtCount(n) { return n.toLocaleString('en-US') + '+'; }
function setText(sel, text) { document.querySelectorAll(sel).forEach(function (el) { el.textContent = text; }); }

export function hydrateReviews(rv) {
  var g = (rv && rv.google) || {}, a = (rv && rv.airbnb) || {};
  if (num(g.rating)) setText('[data-ct="g-rating"]', String(g.rating));
  if (num(g.count)) setText('[data-ct="g-count"]', fmtCount(num(g.count)) + ' reviews');
  if (num(a.rating)) setText('[data-ct="a-rating"]', String(a.rating));
  if (num(a.count)) {
    setText('[data-ct="a-count"]', 'Guest-favorite · ' + fmtCount(num(a.count)) + ' reviews');
    setText('[data-ct="a-chip"]', fmtCount(num(a.count)) + ' five-star reviews on Airbnb alone');
    document.querySelectorAll('.bnum__cell').forEach(function (cell) {
      var k = cell.querySelector('.bnum__k');
      if (k && /5-star reviews/i.test(k.textContent)) {
        var v = cell.querySelector('.bnum__val'); if (v) v.textContent = fmtCount(num(a.count));
      }
    });
  }
  (g.reviews || []).slice(0, 8).forEach(function (card, i) {
    var el = document.querySelectorAll('.greview')[i];
    if (!el || !card.text) return;
    var name = el.querySelector('.greview__name'); if (name && name.childNodes[0]) name.childNodes[0].nodeValue = card.name + ' ';
    var time = el.querySelector('.greview__time'); if (time) time.textContent = card.meta || 'Guest';
    var text = el.querySelector('.greview__text'); if (text) text.textContent = card.text;
    var stars = el.querySelector('.greview__stars'); if (stars) stars.textContent = '★★★★★'.slice(0, card.stars || 5);
  });
  (a.reviews || []).slice(0, 8).forEach(function (card, i) {
    var el = document.querySelectorAll('.abnb__card')[i];
    if (!el || !card.text) return;
    var name = el.querySelector('.abnb__name'); if (name) name.textContent = card.name;
    var meta = el.querySelector('.abnb__meta'); if (meta) meta.textContent = card.meta || '';
    var text = el.querySelector('.abnb__text'); if (text) text.textContent = card.text;
    var stars = el.querySelector('.abnb__stars'); if (stars) stars.textContent = '★★★★★'.slice(0, card.stars || 5);
  });
}

// Rebuild the home-page "Homes we love" carousel from CMS featured homes.
// Each card links to its booking-site URL. Static seed cards remain the
// fallback when the endpoint is unavailable or empty.
const PREMIER_SVG = 'M12 1.6l2.1 6.4 6.7.2-5.3 4.1 1.9 6.5L12 15.6l-5.4 3.8 1.9-6.5-5.3-4.1 6.7-.2z';
export function hydrateFeaturedHomes(items) {
  var track = document.querySelector('[data-fh-track]');
  if (!track || !Array.isArray(items)) return;
  var shown = items.filter(function (h) { return h && h.name && h.featured !== false; });
  if (!shown.length) return;
  track.innerHTML = '';
  shown.forEach(function (h) {
    var a = document.createElement('a');
    a.className = 'scard';
    a.href = h.bookingUrl || '#';
    a.setAttribute('data-fh-id', h.id || '');
    if (/^https?:/i.test(h.bookingUrl || '')) { a.target = '_blank'; a.rel = 'noopener'; }
    var img = document.createElement('img');
    img.src = h.photo || ''; img.alt = h.name + (h.neighborhood ? ' in ' + h.neighborhood : ''); img.loading = 'lazy';
    a.appendChild(img);
    if (h.premier) {
      var pr = document.createElement('span'); pr.className = 'scard__premier';
      pr.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + PREMIER_SVG + '"/></svg>Premier';
      a.appendChild(pr);
    }
    var scrim = document.createElement('div'); scrim.className = 'scard__scrim'; a.appendChild(scrim);
    var body = document.createElement('div'); body.className = 'scard__body';
    var nm = document.createElement('h3'); nm.className = 'scard__name'; nm.textContent = h.name; body.appendChild(nm);
    var loc = document.createElement('p'); loc.className = 'scard__loc'; loc.textContent = h.neighborhood || ''; body.appendChild(loc);
    var specs = document.createElement('div'); specs.className = 'scard__specs';
    [h.beds, h.baths, h.guests].filter(Boolean).forEach(function (s, i) {
      if (i) specs.appendChild(document.createElement('i'));
      var sp = document.createElement('span'); sp.textContent = s; specs.appendChild(sp);
    });
    body.appendChild(specs);
    a.appendChild(body);
    track.appendChild(a);
  });
}

// Rebuild the home-page guest-photo gallery from CMS items. Static seed tiles
// remain the fallback when the endpoint is unavailable or empty.
export function hydrateGuestPhotos(items) {
  var grid = document.querySelector('[data-guest-grid]');
  if (!grid || !Array.isArray(items)) return;
  var shown = items.filter(function (g) { return g && g.photo; });
  if (!shown.length) return;
  grid.innerHTML = '';
  shown.forEach(function (g) {
    var a = document.createElement('a');
    a.className = 'feed__item' + (g.big ? ' big' : '');
    a.href = '#results';
    a.setAttribute('data-gp-id', g.id || '');
    var img = document.createElement('img');
    img.src = g.photo; img.alt = g.location ? 'Guest stay in ' + g.location : 'Guest stay'; img.loading = 'lazy';
    a.appendChild(img);
    if (g.location) { var loc = document.createElement('span'); loc.className = 'feed__loc'; loc.textContent = g.location; a.appendChild(loc); }
    grid.appendChild(a);
  });
}

// Rebuild the owners-page team grid from CMS members. Static seed cards remain
// the fallback when the endpoint is unavailable or empty.
export function hydrateTeam(items) {
  var grid = document.querySelector('[data-team-grid]');
  if (!grid || !Array.isArray(items)) return;
  var shown = items.filter(function (m) { return m && m.name; });
  if (!shown.length) return;
  grid.innerHTML = '';
  shown.forEach(function (m) {
    var card = document.createElement('div');
    card.className = 'team__card';
    card.setAttribute('data-team-id', m.id || '');
    var img = document.createElement('img');
    img.className = 'team__photo'; img.src = m.photo || ''; img.alt = m.name + (m.role ? ', ' + m.role : ''); img.loading = 'lazy';
    var h3 = document.createElement('h3'); h3.textContent = m.name;
    var role = document.createElement('div'); role.className = 'team__role'; role.textContent = m.role || '';
    card.appendChild(img); card.appendChild(h3); card.appendChild(role);
    grid.appendChild(card);
  });
}

// Rebuild the owners-page owner-testimonial quote cards from CMS items. Static
// seed cards remain the fallback when the endpoint is unavailable or empty.
export function hydrateOwnerTestimonials(items) {
  var grid = document.querySelector('[data-otest-grid]');
  if (!grid || !Array.isArray(items)) return;
  var shown = items.filter(function (t) { return t && t.quote; });
  if (!shown.length) return;
  grid.innerHTML = '';
  shown.forEach(function (t) {
    var fig = document.createElement('figure');
    fig.className = 'otest__card reveal is-in';
    fig.setAttribute('data-ot-id', t.id || '');
    var stars = document.createElement('div'); stars.className = 'otest__cardstars'; stars.textContent = '★★★★★';
    var q = document.createElement('blockquote'); q.className = 'otest__quote'; q.textContent = '“' + t.quote + '”';
    var cap = document.createElement('figcaption'); cap.className = 'otest__who';
    var nm = document.createElement('span'); nm.className = 'otest__name'; nm.textContent = t.name || '';
    var home = document.createElement('span'); home.className = 'otest__home'; home.textContent = t.home || '';
    cap.appendChild(nm); cap.appendChild(home);
    fig.appendChild(stars); fig.appendChild(q); fig.appendChild(cap);
    grid.appendChild(fig);
  });
}

// Neighborhood cheat-sheet icons (mirror of [slug].astro cheatIcons).
var NH_CHEAT_ICONS = [
  '<path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4z"/><path d="M6 1v3M10 1v3M14 1v3"/>',
  '<path d="M3 2v7a3 3 0 003 3v10M6 2v6M9 2v6M9 2v0"/><path d="M17 2c-1.5 0-3 2-3 6s1.5 4 3 4v8"/>',
  '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  '<path d="M17 18a5 5 0 00-10 0"/><path d="M12 2v7M4.2 10.2l1.4 1.4M1 18h2M21 18h2M18.4 11.6l1.4-1.4M23 22H1M16 5l-4 4-4-4"/>',
];

// Rebuild the /neighborhoods index cards from CMS items (seed fallback).
export function hydrateNeighborhoodIndex(items) {
  var grid = document.querySelector('[data-nh-grid]');
  if (!grid || !Array.isArray(items)) return;
  var shown = items.filter(function (n) { return n && n.slug && n.name; });
  if (!shown.length) return;
  grid.innerHTML = '';
  shown.forEach(function (n) {
    var a = document.createElement('a');
    a.className = 'nh-card reveal is-in';
    a.href = '/neighborhoods/' + n.slug;
    a.setAttribute('data-nh-id', n.slug);
    var img = document.createElement('img'); img.src = n.img || ''; img.alt = n.name; img.loading = 'lazy';
    var scrim = document.createElement('div'); scrim.className = 'nh-card__scrim';
    var label = document.createElement('div'); label.className = 'nh-card__label';
    var nm = document.createElement('div'); nm.className = 'nh-card__name'; nm.textContent = n.name;
    var note = document.createElement('div'); note.className = 'nh-card__note'; note.textContent = n.note || '';
    label.appendChild(nm); label.appendChild(note);
    a.appendChild(img); a.appendChild(scrim); a.appendChild(label);
    grid.appendChild(a);
  });
}

// Rewrite the /neighborhoods/[slug] detail page from the matching CMS item.
export function hydrateNeighborhoodDetail(items) {
  var main = document.querySelector('[data-nh-detail]');
  if (!main || !Array.isArray(items)) return;
  var slug = main.getAttribute('data-nh-detail');
  var n = items.filter(Boolean).filter(function (x) { return x.slug === slug; })[0];
  if (!n) return;
  main.querySelectorAll('[data-nh-name]').forEach(function (el) { el.textContent = n.name || ''; });
  var img = main.querySelector('[data-nh-img]'); if (img && n.img) img.src = n.img;
  var intro = main.querySelector('[data-nh-intro]'); if (intro) intro.textContent = n.intro || '';
  var aside = main.querySelector('[data-nh-aside]'); if (aside) aside.textContent = n.asideText || '';
  var lede = main.querySelector('[data-nh-guide-lede]'); if (lede) lede.textContent = (n.guide && n.guide.lede) || '';
  var cta = main.querySelector('[data-nh-cta]'); if (cta) cta.textContent = n.ctaText || '';
  var stats = main.querySelector('[data-nh-stats]');
  if (stats && Array.isArray(n.stats)) {
    stats.innerHTML = '';
    n.stats.forEach(function (s) {
      var d = document.createElement('div'); d.className = 'nh-stat';
      var v = document.createElement('div'); v.className = 'v'; v.textContent = s.v || '';
      var l = document.createElement('div'); l.className = 'l'; l.textContent = s.l || '';
      d.appendChild(v); d.appendChild(l); stats.appendChild(d);
    });
  }
  var body = main.querySelector('[data-nh-body]');
  if (body && Array.isArray(n.body)) {
    body.innerHTML = '';
    n.body.forEach(function (p) { var el = document.createElement('p'); el.textContent = p; body.appendChild(el); });
  }
  var hl = main.querySelector('[data-nh-highlights]');
  if (hl && Array.isArray(n.highlights)) {
    hl.innerHTML = '';
    n.highlights.forEach(function (h) {
      var li = document.createElement('li');
      li.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg> ';
      li.appendChild(document.createTextNode(h));
      hl.appendChild(li);
    });
  }
  var guide = main.querySelector('[data-nh-guide]');
  if (guide && n.guide && Array.isArray(n.guide.items)) {
    guide.innerHTML = '';
    n.guide.items.forEach(function (it, i) {
      var item = document.createElement('div'); item.className = 'cheat__item reveal is-in';
      var ic = document.createElement('div'); ic.className = 'cheat__ic';
      ic.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + NH_CHEAT_ICONS[i % NH_CHEAT_ICONS.length] + '</svg>';
      var txt = document.createElement('div');
      var k = document.createElement('div'); k.className = 'cheat__k'; k.textContent = it.k || '';
      var v = document.createElement('div'); v.className = 'cheat__v'; v.textContent = it.v || '';
      var d = document.createElement('div'); d.className = 'cheat__d'; d.textContent = it.d || '';
      txt.appendChild(k); txt.appendChild(v); txt.appendChild(d);
      item.appendChild(ic); item.appendChild(txt);
      guide.appendChild(item);
    });
  }
}

// Rebuild the /blog index (featured card + posts grid) from CMS articles.
export function hydrateBlogIndex(items) {
  var grid = document.querySelector('[data-blog-grid]');
  if (!grid || !Array.isArray(items) || !items.length) return;
  var list = items.filter(function (a) { return a && a.slug && a.title; });
  if (!list.length) return;
  var featured = list.filter(function (a) { return a.featured; })[0] || list[0];
  var rest = list.filter(function (a) { return a.slug !== featured.slug; });
  var feat = document.querySelector('[data-blog-featured]');
  if (feat && featured) {
    feat.setAttribute('href', '/blog/' + featured.slug);
    feat.setAttribute('data-blog-slug', featured.slug);
    var fImg = feat.querySelector('img'); if (fImg) { fImg.src = featured.img || ''; fImg.alt = featured.title; }
    var fMeta = feat.querySelectorAll('.post-meta span');
    if (fMeta[0]) fMeta[0].textContent = featured.category || '';
    if (fMeta[1]) fMeta[1].textContent = featured.readTime || '';
    if (fMeta[2]) fMeta[2].textContent = featured.dateShort || '';
    var fH = feat.querySelector('h2'); if (fH) fH.textContent = featured.title;
    var fP = feat.querySelector('.feat__body > p'); if (fP) fP.textContent = featured.excerpt || '';
  }
  grid.innerHTML = '';
  rest.forEach(function (p) {
    var a = document.createElement('a');
    a.className = 'post reveal is-in'; a.href = '/blog/' + p.slug; a.setAttribute('data-blog-slug', p.slug);
    var media = document.createElement('div'); media.className = 'post__media';
    var img = document.createElement('img'); img.src = p.img || ''; img.alt = p.title; img.loading = 'lazy'; media.appendChild(img);
    var body = document.createElement('div'); body.className = 'post__body';
    var meta = document.createElement('div'); meta.className = 'post-meta';
    var cat = document.createElement('span'); cat.className = 'post-cat'; cat.textContent = p.category || '';
    var rt = document.createElement('span'); rt.textContent = p.readTime || '';
    meta.appendChild(cat); meta.appendChild(rt);
    var h3 = document.createElement('h3'); h3.textContent = p.title;
    var ex = document.createElement('p'); ex.textContent = p.excerpt || '';
    var link = document.createElement('span'); link.className = 'link-arrow'; link.textContent = 'Read →';
    body.appendChild(meta); body.appendChild(h3); body.appendChild(ex); body.appendChild(link);
    a.appendChild(media); a.appendChild(body);
    grid.appendChild(a);
  });
}

// Rewrite the /blog/[slug] article page from the matching CMS article.
export function hydrateBlogArticle(items) {
  var art = document.querySelector('[data-blog-detail]');
  if (!art || !Array.isArray(items)) return;
  var slug = art.getAttribute('data-blog-detail');
  var a = items.filter(Boolean).filter(function (x) { return x.slug === slug; })[0];
  if (!a) return;
  function set(sel, text) { var el = art.querySelector(sel); if (el) el.textContent = text || ''; }
  set('[data-blog-cat]', a.category);
  set('[data-blog-title]', a.title);
  set('[data-blog-initials]', a.author && a.author.initials);
  set('[data-blog-author]', a.author && a.author.name);
  set('[data-blog-meta]', (a.dateFull || '') + ' · ' + (a.readTime || ''));
  set('[data-blog-caption]', a.heroCaption);
  var img = art.querySelector('[data-blog-img]'); if (img && a.img) { img.src = a.img; img.alt = a.title; }
  var body = art.querySelector('[data-blog-body]'); if (body && typeof a.bodyHtml === 'string') body.innerHTML = a.bodyHtml;
}

// Rebuild the owners-page "Case studies" grid from blog posts flagged
// showOnOwners (a post always carries a caseStudy block here). Each card holds
// the data the preview modal reads: data-full → the full article at
// /blog/[slug], data-gallery → the popup thumbnails, data-blurb → the story.
export function hydrateOwnerCases(blog) {
  var grid = document.querySelector('[data-cases]');
  if (!grid || !Array.isArray(blog)) return;
  var cases = blog.filter(function (p) { return p && p.slug && p.showOnOwners && p.caseStudy; });
  if (!cases.length) return;
  var arrow = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  grid.innerHTML = '';
  cases.forEach(function (p) {
    var cs = p.caseStudy || {};
    var gallery = (Array.isArray(cs.gallery) && cs.gallery.length) ? cs.gallery : (p.img ? [p.img] : []);
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'gcase reveal is-in';
    card.setAttribute('data-case', p.slug);
    card.setAttribute('data-full', '/blog/' + p.slug);
    if (p.excerpt) card.setAttribute('data-blurb', p.excerpt);
    card.setAttribute('data-gallery', JSON.stringify(gallery));
    var media = document.createElement('div'); media.className = 'gcase__media';
    var img = document.createElement('img');
    img.src = p.img || gallery[0] || '/assets/photos/designs-pool.jpg';
    img.alt = cs.name || p.title; img.loading = 'lazy';
    media.appendChild(img);
    if (cs.beds) { var beds = document.createElement('span'); beds.className = 'gcase__beds'; beds.textContent = cs.beds; media.appendChild(beds); }
    var body = document.createElement('div'); body.className = 'gcase__body';
    function div(cls, text, tag) { var el = document.createElement(tag || 'div'); el.className = cls; el.textContent = text || ''; return el; }
    body.appendChild(div('gcase__hood', cs.hood));
    body.appendChild(div('gcase__home', cs.name || p.title, 'h3'));
    body.appendChild(div('gcase__hook', p.excerpt, 'p'));
    var rev = document.createElement('div'); rev.className = 'gcase__rev';
    rev.appendChild(document.createTextNode((cs.revenue || '') + ' '));
    var small = document.createElement('small'); small.textContent = 'annual revenue'; rev.appendChild(small);
    body.appendChild(rev);
    var sub = document.createElement('div'); sub.className = 'gcase__sub';
    sub.appendChild(document.createTextNode((cs.nightly || '') + (cs.lift ? ' · ' : '')));
    if (cs.lift) { var lift = document.createElement('span'); lift.className = 'lift'; lift.textContent = cs.lift; sub.appendChild(lift); }
    body.appendChild(sub);
    var cta = document.createElement('span'); cta.className = 'gcase__cta';
    cta.innerHTML = 'Preview project ' + arrow;
    body.appendChild(cta);
    card.appendChild(media); card.appendChild(body);
    grid.appendChild(card);
  });
}

// Rebuild the home "Explore like a local" cards from blog posts flagged
// showOnHome. Each card links to the full article at /blog/[slug].
export function hydrateExplore(blog) {
  var wrap = document.querySelector('[data-explore]');
  if (!wrap || !Array.isArray(blog)) return;
  var cards = blog.filter(function (p) { return p && p.slug && p.showOnHome; });
  if (!cards.length) return;
  var tip = '<svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6-6.3 4.6L8 14 2 9.4h7.6z"/></svg>';
  wrap.innerHTML = '';
  cards.forEach(function (p) {
    var a = document.createElement('a');
    a.className = 'todo__card'; a.href = '/blog/' + p.slug; a.setAttribute('data-explore-slug', p.slug);
    var img = document.createElement('img'); img.src = p.img || ''; img.alt = p.title; img.loading = 'lazy';
    var body = document.createElement('div'); body.className = 'todo__body';
    var kicker = document.createElement('div'); kicker.className = 'todo__kicker'; kicker.textContent = p.category || '';
    var h3 = document.createElement('h3'); h3.textContent = p.title;
    var pEl = document.createElement('p'); pEl.textContent = p.excerpt || '';
    body.appendChild(kicker); body.appendChild(h3); body.appendChild(pEl);
    if (p.localTip) {
      var tipEl = document.createElement('span'); tipEl.className = 'todo__tip';
      tipEl.innerHTML = tip; tipEl.appendChild(document.createTextNode('Local tip: ' + p.localTip));
      body.appendChild(tipEl);
    }
    a.appendChild(img); a.appendChild(body);
    wrap.appendChild(a);
  });
}
