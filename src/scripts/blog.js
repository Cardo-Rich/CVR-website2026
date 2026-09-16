/* Public hydration for the /blog index and /blog/[slug] article pages. Rewrites
   the cards / article regions from the published CMS (/api/content), with the
   baked seed as the fallback. Skipped for admins — the inline layer owns the
   draft-aware render there. */

/* The page ships the build's own article list in [data-blog-seed]. The CMS doc
   is a snapshot taken whenever someone last published from the admin app, so on
   its own it silently drops posts added in code since. Merging CMS entries over
   the baked list by slug keeps the CMS authoritative for the posts it knows and
   still shows the newer ones. Mirrors mergeWithSeed() in lib/content/articles. */
function mergeWithSeed(cmsItems) {
  var el = document.querySelector('[data-blog-seed]');
  var seed = [];
  if (el) { try { seed = JSON.parse(el.textContent) || []; } catch (e) { seed = []; } }
  if (!seed.length) return cmsItems;

  var byCms = {};
  cmsItems.forEach(function (a) { if (a && a.slug) byCms[a.slug] = a; });
  var merged = seed.map(function (a) {
    var edit = byCms[a.slug];
    if (!edit) return a;
    delete byCms[a.slug];
    return Object.assign({}, a, edit);
  });
  // A post authored entirely in the admin app has no seed entry; keep it.
  Object.keys(byCms).forEach(function (slug) { merged.push(byCms[slug]); });
  return merged;
}

import('./content-hydrate.js').then(function (H) {
  if (document.documentElement.classList.contains('cadm-admin')) return;
  fetch('/api/content', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !Array.isArray(d.blog)) return;
      var list = mergeWithSeed(d.blog);
      try { H.hydrateBlogIndex(list); } catch (e) {}
      try { H.hydrateBlogArticle(list); } catch (e) {}
    })
    .catch(function () { /* offline or unconfigured — static fallback stands */ });
});
