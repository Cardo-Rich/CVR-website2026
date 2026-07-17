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

// Rebuild the owners-page grid from the CMS library (featured cases only). The
// static six remain the fallback when the endpoint is unavailable.
export function hydrateCases(items) {
  var grid = document.querySelector('[data-cases]');
  if (!grid || !Array.isArray(items) || !items.length) return;
  var knownImgs = {};
  grid.querySelectorAll('.gcase[data-case]').forEach(function (card) {
    var img = card.querySelector('.gcase__media img');
    if (img) knownImgs[card.getAttribute('data-case')] = img.getAttribute('src');
  });
  var featured = items.filter(function (cs) { return cs && cs.id && cs.featured !== false; });
  if (!featured.length) return;
  var arrow = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  grid.innerHTML = '';
  featured.forEach(function (cs) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'gcase reveal is-in';
    card.setAttribute('data-case', cs.id);
    if (cs.blurb) card.setAttribute('data-blurb', cs.blurb);
    var media = document.createElement('div'); media.className = 'gcase__media';
    var img = document.createElement('img');
    img.src = cs.img || knownImgs[cs.id] || '/assets/photos/designs-pool.jpg';
    img.alt = cs.name; img.loading = 'lazy';
    media.appendChild(img);
    if (cs.beds) { var beds = document.createElement('span'); beds.className = 'gcase__beds'; beds.textContent = cs.beds; media.appendChild(beds); }
    var body = document.createElement('div'); body.className = 'gcase__body';
    function div(cls, text, tag) { var el = document.createElement(tag || 'div'); el.className = cls; el.textContent = text || ''; return el; }
    body.appendChild(div('gcase__hood', cs.hood));
    body.appendChild(div('gcase__home', cs.name, 'h3'));
    body.appendChild(div('gcase__hook', cs.hook, 'p'));
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
