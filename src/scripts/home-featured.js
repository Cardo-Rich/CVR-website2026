/* Public hydration for the home page's "Homes we love" carousel. Pulls the
   published featured homes from /api/content and rebuilds the cards. The baked
   static markup is the fallback when the endpoint is missing or empty. Admins
   get a draft-aware re-render from the inline layer, so we skip here for them. */
import('./content-hydrate.js').then(function (H) {
  if (document.documentElement.classList.contains('cadm-admin')) return;
  fetch('/api/content', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d) return;
      try { H.hydrateFeaturedHomes(d.featuredHomes || []); } catch (e) {}
      try { H.hydrateGuestPhotos(d.guestPhotos || []); } catch (e) {}
      try { H.hydrateExplore(d.blog || []); } catch (e) {}
    })
    .catch(function () { /* offline or unconfigured — static fallback stands */ });
});
