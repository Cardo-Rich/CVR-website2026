/* Section visibility switches, managed in the admin CMS (Site content →
   Sections). Any element with data-section="<key>" is hidden when the CMS map
   has that key set to false. A `data-section-hidden` attribute makes a section
   hidden by DEFAULT (until the CMS explicitly turns it on) — used to park a
   section out of public view without a CMS write. Unknown/missing keys with no
   default stay visible, and if the content API is unreachable the last-known
   (or default) state stands.

   A sessionStorage copy of the last-known hidden set is applied immediately on
   load so repeat views don't flash a hidden section before the fetch lands. */
(function () {
  var els = document.querySelectorAll('[data-section]');
  if (!els.length) return;

  var CACHE_KEY = 'cardoHiddenSections';

  // Given the CMS sections map, return the list of keys that should be hidden —
  // explicit `false` wins; otherwise fall back to each element's default.
  function computeHidden(sectionsMap) {
    var map = sectionsMap && typeof sectionsMap === 'object' ? sectionsMap : {};
    var hidden = [];
    els.forEach(function (el) {
      var key = el.getAttribute('data-section');
      var off = Object.prototype.hasOwnProperty.call(map, key)
        ? map[key] === false
        : el.hasAttribute('data-section-hidden');
      if (off && hidden.indexOf(key) === -1) hidden.push(key);
    });
    return hidden;
  }

  function apply(hidden) {
    els.forEach(function (el) {
      var off = hidden.indexOf(el.getAttribute('data-section')) !== -1;
      el.style.display = off ? 'none' : '';
      if (off) el.setAttribute('aria-hidden', 'true');
      else el.removeAttribute('aria-hidden');
    });
  }

  // Immediate paint: last-known hidden set, or the built-in defaults.
  var initial;
  try { initial = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null'); } catch (e) {}
  if (!Array.isArray(initial)) initial = computeHidden(null);
  apply(initial);

  fetch('/api/content', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d) return; // offline/unconfigured — keep the current (default) state
      var hidden = computeHidden(d.sections);
      apply(hidden);
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(hidden)); } catch (e) {}
    })
    .catch(function () { /* keep current state */ });
})();
