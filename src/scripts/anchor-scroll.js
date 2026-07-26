/* Global in-page anchor scrolling.
   Native hash jumps land targets under the sticky site header, and on pages
   that reflow after load the target ends up mid-screen. The owners page is the
   worst case: the booking widget grows once /api/ghl slots load, /api/content
   hydration re-renders sections, the performance chart is drawn with JS, and
   images lazy-load — all AFTER the initial jump, shifting every anchor below
   them. This lands each #hash target just below the header, then re-pins it as
   the layout settles (via ResizeObserver on the body, plus backstop timers)
   until the user scrolls or a short window elapses — so late growth can't
   leave the target off-position, and we never yank the page back once the
   reader takes over. */
(function () {
  'use strict';

  // #estimate has bespoke handling in owners.js (it targets the form panel,
  // not the section), so leave it alone here.
  var SKIP = { estimate: 1 };

  function headerOffset() {
    var h = document.querySelector('[data-header]');
    return (h ? h.getBoundingClientRect().height : 72) + 12;
  }

  function targetFor(hash) {
    if (!hash || hash.charAt(0) !== '#' || hash.length < 2) return null;
    var id;
    try { id = decodeURIComponent(hash.slice(1)); } catch (e) { id = hash.slice(1); }
    if (SKIP[id]) return null;
    return document.getElementById(id);
  }

  function scrollToEl(el, smooth) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - headerOffset();
    if (top < 0) top = 0;
    window.scrollTo({ top: top, behavior: smooth ? 'smooth' : 'auto' });
  }

  // At most one active "settle" at a time.
  var teardown = null;
  function settleTo(el, smooth) {
    if (teardown) teardown();
    var active = true;
    var timers = [];
    var ro = null;

    function repin(sm) { if (active && el.isConnected) scrollToEl(el, sm); }

    teardown = function () {
      active = false;
      timers.forEach(clearTimeout);
      timers = [];
      if (ro) { ro.disconnect(); ro = null; }
      window.removeEventListener('wheel', stop, { passive: true });
      window.removeEventListener('touchmove', stop, { passive: true });
      window.removeEventListener('keydown', onKey);
      teardown = null;
    };
    function stop() { if (teardown) teardown(); }
    function onKey(e) {
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;
      stop();
    }

    // Initial land (smooth for clicks), plus a next-frame correction.
    repin(smooth);
    requestAnimationFrame(function () { requestAnimationFrame(function () { repin(smooth); }); });

    // Re-pin whenever the document height changes (widget render, hydration,
    // images). ResizeObserver fires on any body size change.
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(function () { repin(false); });
      try { ro.observe(document.body); } catch (e) { ro = null; }
    }
    // Backstop passes for browsers without ResizeObserver / missed frames.
    [120, 400, 900, 1600, 2600, 3800].forEach(function (ms) {
      timers.push(setTimeout(function () { repin(false); }, ms));
    });
    // Hard stop so we never re-pin indefinitely (covers slow /api responses).
    timers.push(setTimeout(stop, 5000));

    // Any real user scroll/scrub hands control back to the reader.
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('keydown', onKey);
  }

  // Same-page anchor clicks (including cross-page links already on this page).
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var hi = href.indexOf('#');
    if (hi === -1) return;
    var path = href.slice(0, hi);
    var hash = href.slice(hi);
    var here = location.pathname.replace(/\/$/, '');
    var samePage = path === '' || path.replace(/\/$/, '') === here;
    if (!samePage) return; // cross-page: let the browser navigate; onArrival finishes it
    var el = targetFor(hash);
    if (!el) return;
    e.preventDefault();
    if (history.replaceState) history.replaceState(null, '', hash);
    settleTo(el, true);
  });

  // Arrived with a hash (cross-page nav, direct link, or reload).
  function onArrival() {
    var el = targetFor(location.hash);
    if (el) settleTo(el, false);
  }
  if (location.hash) {
    requestAnimationFrame(function () { requestAnimationFrame(onArrival); });
    window.addEventListener('load', onArrival);
  }
})();
