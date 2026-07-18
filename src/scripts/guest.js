/* guest.js — booking search, rental filters, favorites, and reviews carousel
   for the Cardo "Book a Stay" page. Plain vanilla. */
import { bookingUrlFrom } from './booking.js';
(function () {
  'use strict';

  /* ---- Filter chips ---- */
  (function () {
    var chips = [].slice.call(document.querySelectorAll('[data-filter]'));
    var rentals = [].slice.call(document.querySelectorAll('.rental'));
    var countEl = document.querySelector('[data-rental-count]');
    function apply(tag) {
      var shown = 0;
      rentals.forEach(function (r) {
        var tags = (r.getAttribute('data-tags') || '').split(' ');
        var on = tag === 'all' || tags.indexOf(tag) > -1;
        r.classList.toggle('is-hidden', !on);
        if (on) shown++;
      });
      if (countEl) countEl.textContent = shown;
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.classList.remove('is-active'); });
        c.classList.add('is-active');
        apply(c.getAttribute('data-filter'));
      });
    });
  })();

  /* ---- Featured homes showcase ---- */
  (function () {
    var track = document.querySelector('[data-showcase-track]');
    if (!track) return;
    var prev = document.querySelector('[data-showcase-prev]');
    var next = document.querySelector('[data-showcase-next]');
    function step() {
      var card = track.querySelector('.scard');
      return card ? card.offsetWidth + 22 : 360;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---- Favorite hearts ---- */
  [].slice.call(document.querySelectorAll('.rental__fav')).forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      b.classList.toggle('is-on');
    });
  });

  /* ---- Booking bar → booking site ---- */
  (function () {
    var form = document.querySelector('[data-bookbar]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = bookingUrlFrom(form);
    });
  })();

  /* ---- Reviews carousel ---- */
  (function () {
    var root = document.querySelector('[data-greviews]');
    if (!root) return;
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
      page = Math.max(0, Math.min(p, pages() - 1));
      var vw = root.querySelector('.greviews__viewport').clientWidth;
      track.style.transform = 'translateX(' + (-(page * (vw + GAP))) + 'px)';
      [].slice.call(dotsWrap.children).forEach(function (d, k) { d.classList.toggle('is-active', k === page); });
    }
    prev && prev.addEventListener('click', function () { go(page - 1); });
    next && next.addEventListener('click', function () { go(page + 1); });
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { buildDots(); go(Math.min(page, pages() - 1)); }, 150); });
    buildDots(); go(0);
  })();

  /* ---- Review platform tabs (Google / Airbnb) ---- */
  (function () {
    var wrap = document.querySelector('[data-revtabs]');
    if (!wrap) return;
    var tabs = [].slice.call(wrap.querySelectorAll('.revtab'));
    var panels = [].slice.call(document.querySelectorAll('[data-revpanel]'));
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var key = t.getAttribute('data-revtab');
        tabs.forEach(function (x) { x.classList.toggle('is-active', x === t); });
        panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-revpanel') === key); });
        window.dispatchEvent(new Event('resize'));
      });
    });
  })();

  /* ---- Scroll reveal ---- */
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (('IntersectionObserver' in window) && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { threshold: .12 });
      els.forEach(function (el) { io.observe(el); });
      window.addEventListener('load', function () { setTimeout(function () { document.querySelectorAll('.reveal:not(.is-in)').forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in'); }); }, 1200); });
    } else { [].forEach.call(els, function (el) { el.classList.add('is-in'); }); }
  })();

  /* ---- Sticky nav search: show when the hero search bar scrolls out of view ---- */
  (function () {
    var navsearch = document.querySelector('[data-navsearch]');
    var heroBar = document.querySelector('.bookbar--hero');
    if (!navsearch || !heroBar) return;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { navsearch.classList.toggle('is-shown', !e.isIntersecting); });
      }, { threshold: 0, rootMargin: '-72px 0px 0px 0px' });
      io.observe(heroBar);
    } else {
      window.addEventListener('scroll', function () {
        navsearch.classList.toggle('is-shown', heroBar.getBoundingClientRect().bottom < 72);
      }, { passive: true });
    }
    navsearch.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = bookingUrlFrom(navsearch);
    });
  })();

  /* ---- Property Management reveal (hover desktop / tap-then-navigate mobile) ---- */
  (function () {
    var control = document.querySelector('[data-pm-control]');
    var link = document.querySelector('[data-pm-link]');
    var overlay = document.querySelector('[data-pm-overlay]');
    if (!control || !link || !overlay) return;
    var href = link.getAttribute('href');
    var hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var header = document.querySelector('.site-header');
    function open() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      control.classList.add('is-active'); // swaps serif label -> "Learn More" button in place
      if (header) header.classList.add('pm-elevated'); // lift header above the dim so the button is clickable
    }
    function close() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      control.classList.remove('is-active');
      if (header) header.classList.remove('pm-elevated');
    }

    if (hoverCapable) {
      // Desktop: hovering the control dims + reveals; the CTA button appears where the
      // label was, so the user just clicks in place (no cursor travel).
      control.addEventListener('mouseenter', open);
      control.addEventListener('mouseleave', close);
      link.addEventListener('focus', open);
      control.addEventListener('focusout', function (e) { if (!control.contains(e.relatedTarget)) close(); });
      overlay.addEventListener('mouseenter', open);
      overlay.addEventListener('mouseleave', close);
    } else {
      // Mobile: tap reveals, holds 2s, then follows the link.
      link.addEventListener('click', function (e) {
        if (overlay.classList.contains('is-open')) return; // a second tap passes through
        e.preventDefault();
        open();
        setTimeout(function () { window.location.href = href; }, 2000);
      });
    }
  })();
})();
