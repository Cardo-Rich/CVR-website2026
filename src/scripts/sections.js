/* Section visibility switches, managed in the admin CMS (Site content →
   Sections). Any element with data-section="<key>" is hidden when the CMS map
   has that key set to false. Unknown/missing keys stay visible, and if the
   content API is unreachable the static page stands untouched.

   A sessionStorage copy of the last-known hidden set is applied immediately on
   load so repeat views don't flash a hidden section before the fetch lands. */
(function () {
  var els = document.querySelectorAll('[data-section]');
  if (!els.length) return;

  var CACHE_KEY = 'cardoHiddenSections';

  function apply(hidden) {
    els.forEach(function (el) {
      var off = hidden.indexOf(el.getAttribute('data-section')) !== -1;
      el.style.display = off ? 'none' : '';
      if (off) el.setAttribute('aria-hidden', 'true');
      else el.removeAttribute('aria-hidden');
    });
  }

  try {
    var cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || '[]');
    if (Array.isArray(cached) && cached.length) apply(cached);
  } catch (e) {}

  fetch('/api/content', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || typeof d.sections !== 'object' || d.sections === null) return;
      var hidden = Object.keys(d.sections).filter(function (k) { return d.sections[k] === false; });
      apply(hidden);
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(hidden)); } catch (e) {}
    })
    .catch(function () { /* offline or unconfigured — everything stays visible */ });
})();
