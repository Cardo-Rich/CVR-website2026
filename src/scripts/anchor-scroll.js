/* Global in-page anchor scrolling.
   Native hash jumps land targets under the sticky site header, and on pages
   that reflow after load (the owners page draws its performance chart with JS,
   hydrates case studies / reviews / sections from /api/content, and lazy-loads
   images) the target ends up mid-screen. This lands every #hash target at the
   top of the viewport just below the header, then re-corrects across a few
   frames so late layout shifts can't leave it off-position. User scroll input
   cancels the pending corrections so we never yank the page back. */
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

  var timers = [];
  function cancel() {
    timers.forEach(clearTimeout);
    timers = [];
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchmove', cancel);
    window.removeEventListener('keydown', onKey);
  }
  function onKey(e) {
    // Ignore modifier-only keys; any real navigation key means "leave me be".
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;
    cancel();
  }

  // Land on the target, then re-apply as late layout shifts settle. Delays are
  // aligned with the chart draw / CMS hydration / reveal safety net (~1.2s).
  function settleTo(el, smooth) {
    cancel();
    scrollToEl(el, smooth);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { scrollToEl(el, smooth); });
    });
    [120, 400, 900, 1500].forEach(function (ms) {
      timers.push(setTimeout(function () { scrollToEl(el, false); }, ms));
    });
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchmove', cancel, { passive: true });
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
