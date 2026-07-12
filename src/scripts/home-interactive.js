/* home-interactive.js — click-to-expand pickers, Google reviews carousel,
   case-study preview modal, "add more details" disclosure, amenity pills,
   and address autocomplete for the Cardo owners page. Plain vanilla, no
   dependencies. Ported (owners subset) from the design reference. */
(function () {
  'use strict';
  var reduce = !window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

  /* ---------------- Click-to-expand pickers (Why switch + Everything handled) ---------------- */
  [].slice.call(document.querySelectorAll('[data-picker]')).forEach(function (root) {
    var items = [].slice.call(root.querySelectorAll('.picker__item'));
    var slides = [].slice.call(root.querySelectorAll('.picker__slide'));

    function show(n) {
      items.forEach(function (it, k) {
        var on = k === n;
        it.classList.toggle('is-active', on);
        it.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === n); });
    }
    items.forEach(function (it, k) {
      it.setAttribute('aria-expanded', it.classList.contains('is-active') ? 'true' : 'false');
      it.addEventListener('click', function () { show(k); });
    });
    // ensure exactly one open on init
    var start = items.findIndex ? items.findIndex(function (it) { return it.classList.contains('is-active'); }) : -1;
    show(start > -1 ? start : 0);
  });

  /* ---------------- Google reviews carousel ---------------- */
  (function () {
    [].slice.call(document.querySelectorAll('[data-greviews]')).forEach(function (root) {
    var track = root.querySelector('.greviews__track');
    var cards = [].slice.call(track.children);
    var dotsWrap = root.querySelector('.greviews__dots');
    var prev = root.querySelector('[data-grev-prev]');
    var next = root.querySelector('[data-grev-next]');
    var GAP = 24, page = 0;

    function perView() { return window.innerWidth <= 620 ? 1 : (window.innerWidth <= 900 ? 2 : 3); }
    function pages() { return Math.max(1, Math.ceil(cards.length / perView())); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (var p = 0; p < pages(); p++) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'greviews__dot'; b.setAttribute('aria-label', 'Page ' + (p + 1));
        (function (pp) { b.addEventListener('click', function () { go(pp); }); })(p);
        dotsWrap.appendChild(b);
      }
    }
    function go(p) {
      var max = pages() - 1;
      page = Math.max(0, Math.min(p, max));
      var vw = root.querySelector('.greviews__viewport').clientWidth;
      track.style.transform = 'translateX(' + (-(page * (vw + GAP))) + 'px)';
      [].slice.call(dotsWrap.children).forEach(function (d, k) { d.classList.toggle('is-active', k === page); });
    }
    prev && prev.addEventListener('click', function () { go(page - 1); });
    next && next.addEventListener('click', function () { go(page + 1); });
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { buildDots(); go(Math.min(page, pages() - 1)); }, 150); });
    buildDots(); go(0);
    });
  })();

  /* ---------------- Case-study preview modal ---------------- */
  (function () {
    var modal = document.querySelector('[data-cmodal]');
    if (!modal) return;
    var LIVING_CRAFTSMAN = '/assets/photos/designs-living-craftsman.jpg';
    var LIVING_BRIGHT = '/assets/photos/designs-living-bright.jpg';
    var DINING = '/assets/photos/designs-dining.jpg';
    var BEDROOM_FLORAL = '/assets/photos/designs-bedroom-floral.jpg';
    var GAMEROOM = '/assets/photos/designs-gameroom.jpg';
    var POOL = '/assets/photos/designs-pool.jpg';
    var AMENITIES = '/assets/photos/designs-amenities.jpg';
    var LIVING_FIREPLACE = '/assets/photos/designs-living-fireplace.jpg';
    var BEDROOM_FAN = BEDROOM_FLORAL; // no dedicated homePhotos entry; reuse bedroom-floral
    var DATA = {
      'falcon': { hood: 'La Jolla', beds: '4 BR', rev: '$214,800', rate: '$589', lift: '+57%',
        blurb: 'An inherited bluff home, frozen in time, fully reimagined and launched in five weeks. Our team cleared, repainted, and furnished every room to make the most of the light and the view — sourced, shipped, installed, and photo-ready — and it settled into the top tier of its La Jolla market.',
        imgs: [LIVING_CRAFTSMAN, LIVING_FIREPLACE, DINING] },
      'nute': { hood: 'Pacific Beach', beds: '3 BR', rev: '$158,300', rate: '$412', lift: '+44%',
        blurb: 'A tired walk-street rental taken from drab to coastal-bright — a lighter palette, smarter furniture for the layout, and styling that made the small footprint feel generous. It photographed beautifully and booked solid in its first month.',
        imgs: [LIVING_BRIGHT, BEDROOM_FLORAL, AMENITIES] },
      'twain': { hood: 'Del Mar', beds: '4 BR', rev: '$192,500', rate: '$512', lift: '+48%',
        blurb: 'A true craftsman styled around its architecture, not over it — warm, layered furnishings that read editorial in photos and live comfortably for a full house. Twain now commands Del Mar’s racing-season premium and holds strong year-round.',
        imgs: [DINING, LIVING_CRAFTSMAN, BEDROOM_FAN] },
      'sixth': { hood: 'Mission Beach', beds: '2 BR', rev: '$128,400', rate: '$356', lift: '+39%',
        blurb: 'A compact two-bedroom a block from the sand, designed so every inch works twice as hard — dual-purpose furniture, a bright cohesive palette, and styling that photographs larger than the footprint. Guests book it for the location and rate it for the comfort.',
        imgs: [BEDROOM_FLORAL, LIVING_BRIGHT, BEDROOM_FAN] },
      'kane': { hood: 'Encinitas', beds: '3 BR', rev: '$168,300', rate: '$447', lift: '+41%',
        blurb: 'A surf-town home with an underused bonus room, turned into a moody navy game room that anchors the whole listing. We styled the rest of the home to match the energy — and it became the feature guests search for.',
        imgs: [GAMEROOM, LIVING_FIREPLACE, AMENITIES] },
      'mt-ainsworth': { hood: 'Coronado', beds: '5 BR', rev: '$268,900', rate: '$694', lift: '+61%',
        blurb: 'The largest home in the group — five bedrooms, a pool, and a backyard built for entertaining. We furnished it as a true estate that photographs like a luxury hotel, with a backyard styled into a destination of its own. It launched at the top of its comp set.',
        imgs: [POOL, LIVING_CRAFTSMAN, DINING] }
    };
    var heroImg = modal.querySelector('[data-cm-hero]');
    var els = {
      eyebrow: modal.querySelector('[data-cm-eyebrow]'), title: modal.querySelector('[data-cm-title]'),
      rev: modal.querySelector('[data-cm-rev]'), rate: modal.querySelector('[data-cm-rate]'),
      lift: modal.querySelector('[data-cm-lift]'), blurb: modal.querySelector('[data-cm-blurb]'),
      thumbs: modal.querySelector('[data-cm-thumbs]'), full: modal.querySelector('[data-cm-full]')
    };
    var lastFocus = null;

    function open(key, home) {
      var d = DATA[key]; if (!d) return;
      heroImg.src = d.imgs[0];
      heroImg.alt = home;
      els.eyebrow.textContent = d.hood + ' · ' + d.beds;
      els.title.textContent = home;
      els.rev.textContent = d.rev; els.rate.textContent = d.rate; els.lift.textContent = d.lift;
      els.blurb.textContent = d.blurb;
      els.thumbs.innerHTML = d.imgs.map(function (f, i) {
        return '<img src="' + f + '" alt="' + home + ' interior ' + (i + 1) + '" loading="lazy" />';
      }).join('');
      els.full.href = '/case-studies/' + key;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    [].slice.call(document.querySelectorAll('[data-case]')).forEach(function (card) {
      card.addEventListener('click', function () {
        lastFocus = card;
        open(card.getAttribute('data-case'), card.querySelector('.gcase__home').textContent);
      });
    });
    [].slice.call(modal.querySelectorAll('[data-cmodal-close]')).forEach(function (b) {
      b.addEventListener('click', close);
    });
    // "Contact us" / "View full case study" should close the modal first so the
    // form (or destination) is actually visible after the scroll.
    [].slice.call(modal.querySelectorAll('[data-cm-contact], [data-cm-full]')).forEach(function (a) {
      a.addEventListener('click', function () { close(); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('is-open')) close(); });
  })();

  /* ---------------- "Add more details" disclosure ---------------- */
  (function () {
    var toggle = document.querySelector('[data-more-toggle]');
    var fields = document.querySelector('[data-more-fields]');
    if (!toggle || !fields) return;
    toggle.addEventListener('click', function () {
      var open = fields.hasAttribute('hidden');
      if (open) { fields.removeAttribute('hidden'); toggle.setAttribute('aria-expanded', 'true'); toggle.querySelector('span').textContent = 'Fewer details'; }
      else { fields.setAttribute('hidden', ''); toggle.setAttribute('aria-expanded', 'false'); toggle.querySelector('span').textContent = 'Add more details'; }
    });
  })();

  /* ---------------- Amenity pills (multi-select) ---------------- */
  (function () {
    var wrap = document.querySelector('[data-amenities]');
    if (!wrap) return;
    var hidden = document.querySelector('[data-amenities-value]');
    var pills = [].slice.call(wrap.querySelectorAll('.amenpill'));
    function sync() {
      var on = pills.filter(function (p) { return p.classList.contains('is-on'); }).map(function (p) { return p.getAttribute('data-amenity'); });
      if (hidden) hidden.value = on.join(', ');
    }
    pills.forEach(function (p) {
      p.setAttribute('aria-pressed', 'false');
      p.addEventListener('click', function () {
        var on = p.classList.toggle('is-on');
        p.setAttribute('aria-pressed', on ? 'true' : 'false');
        sync();
      });
    });
  })();

  /* ---------------- Address autocomplete (live, US-wide) ----------------
     Primary: Google Places Autocomplete (New) — near-complete US address
     coverage. Enabled when a build-time key is present:
       PUBLIC_GOOGLE_MAPS_API_KEY  (Astro env var — exposed to the client, so
       restrict it by HTTP referrer + to the Places API in Google Cloud).
     Fallback: Photon (photon.komoot.io), a keyless OpenStreetMap geocoder
     biased toward San Diego — used when no key is set or Google fails. */
  (function () {
    var root = document.querySelector('[data-addr]');
    if (!root) return;
    var input = root.querySelector('input');
    var list = root.querySelector('[data-addr-list]');
    var pin = '<svg viewBox="0 0 24 24"><path d="M12 21s7-5.7 7-11a7 7 0 10-14 0c0 5.3 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>';
    var active = -1, timer = null, ctrl = null;

    /* ---- Photon fallback (keyless OSM, biased to San Diego) ---- */
    function photonLabel(p) {
      var line1 = [p.housenumber, p.street || p.name].filter(Boolean).join(' ');
      var line2 = [p.city || p.town || p.village || p.county, p.state, p.postcode].filter(Boolean).join(', ');
      return [line1, line2].filter(Boolean).join(', ');
    }
    function fetchPhoton(q) {
      if (window.AbortController) { if (ctrl) ctrl.abort(); ctrl = new AbortController(); }
      // lat/lon bias floats nearby (San Diego) matches to the top; still US-wide.
      var url = 'https://photon.komoot.io/api/?limit=8&lang=en&lat=32.7157&lon=-117.1611&q=' + encodeURIComponent(q);
      return fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          return (d.features || [])
            .map(function (f) { return f.properties || {}; })
            .filter(function (p) { return (p.countrycode === 'US' || !p.countrycode) && (p.street || p.name); })
            .map(photonLabel)
            .filter(function (v, i, a) { return v && a.indexOf(v) === i; })
            .slice(0, 6);
        });
    }

    /* ---- Google Places (New) — primary when a key is configured ---- */
    var GKEY = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;
    var gReady = null;   // Promise -> places library, once loaded
    var gToken = null;   // per-session token (Places session billing)
    function loadGoogle() {
      if (!GKEY) return Promise.reject();
      if (gReady) return gReady;
      gReady = new Promise(function (resolve, reject) {
        if (window.google && window.google.maps && window.google.maps.importLibrary) return resolve();
        var s = document.createElement('script');
        s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(GKEY) + '&libraries=places&loading=async&v=weekly';
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      }).then(function () { return window.google.maps.importLibrary('places'); });
      return gReady;
    }
    function fetchGoogle(q) {
      return loadGoogle().then(function (places) {
        if (!gToken) gToken = new places.AutocompleteSessionToken();
        return places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: q,
          includedRegionCodes: ['us'],
          sessionToken: gToken
        }).then(function (res) {
          return (res.suggestions || [])
            .map(function (s) { return s.placePrediction; })
            .filter(Boolean)
            .map(function (p) { return (p.text && p.text.text) || ''; })
            .filter(function (v, i, a) { return v && a.indexOf(v) === i; });
        });
      });
    }

    // Google when a key exists (Photon rescue on a failed keystroke); else Photon.
    function fetchSuggestions(q) {
      if (GKEY) return fetchGoogle(q).catch(function () { return fetchPhoton(q); });
      return fetchPhoton(q);
    }
    function draw(items) {
      if (!items.length) { list.hidden = true; return; }
      list.innerHTML = items.map(function (a, i) {
        return '<li data-i="' + i + '">' + pin + '<span>' + a.replace(/</g, '&lt;') + '</span></li>';
      }).join('');
      active = -1; list.hidden = false;
      [].slice.call(list.children).forEach(function (li) {
        li.addEventListener('mousedown', function (e) { e.preventDefault(); choose(li); });
      });
    }
    function render(q) {
      if (!q || q.trim().length < 3) { list.hidden = true; return; }
      clearTimeout(timer);
      timer = setTimeout(function () {
        fetchSuggestions(q.trim()).then(draw).catch(function () { /* offline / aborted — leave list as-is */ });
      }, 220);
    }
    function choose(li) { input.value = li.querySelector('span').textContent; list.hidden = true; gToken = null; /* selection ends the Places session */ }
    input.setAttribute('autocomplete', 'off');
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('focus', function () { if (input.value.trim().length >= 3) render(input.value); });
    input.addEventListener('blur', function () { setTimeout(function () { list.hidden = true; }, 150); });
    input.addEventListener('keydown', function (e) {
      if (list.hidden) return;
      var lis = [].slice.call(list.children);
      if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, lis.length - 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); }
      else if (e.key === 'Enter' && active > -1) { e.preventDefault(); choose(lis[active]); return; }
      else return;
      lis.forEach(function (li, i) { li.classList.toggle('is-active', i === active); });
    });
  })();
})();
