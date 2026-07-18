/* Public hydration for the neighborhoods index and detail pages. Rewrites the
   cards / detail regions from the published CMS (/api/content), with the baked
   seed as the fallback. Skipped for admins — the inline layer owns the
   draft-aware render there. */
import('./content-hydrate.js').then(function (H) {
  if (document.documentElement.classList.contains('cadm-admin')) return;
  fetch('/api/content', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !Array.isArray(d.neighborhoods)) return;
      try { H.hydrateNeighborhoodIndex(d.neighborhoods); } catch (e) {}
      try { H.hydrateNeighborhoodDetail(d.neighborhoods); } catch (e) {}
    })
    .catch(function () { /* offline or unconfigured — static fallback stands */ });
});
