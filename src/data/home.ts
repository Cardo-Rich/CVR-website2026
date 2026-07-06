// =============================================================
// Cardo V3 — content + image map.
// Real Cardo photography now lives in public/assets/photos/ (provided by
// the owner). These keys point at those local files; to change a photo,
// replace the file in public/assets/photos/ or repoint the key here.
// =============================================================

// keyed by the reference's designs-*.jpg basename (without extension)
export const homePhotos = {
  'living-craftsman': '/assets/photos/designs-living-craftsman.jpg',
  'living-bright': '/assets/photos/designs-living-bright.jpg',
  'dining': '/assets/photos/designs-dining.jpg',
  'bedroom-floral': '/assets/photos/designs-bedroom-floral.jpg',
  'gameroom': '/assets/photos/designs-gameroom.jpg',
  'pool': '/assets/photos/designs-pool.jpg',
  'amenities': '/assets/photos/designs-amenities.jpg',
  'living-fireplace': '/assets/photos/designs-living-fireplace.jpg',
} as const;

export type HomePhotoKey = keyof typeof homePhotos;

// Hero video now lives at /assets/video/san-diego-hero.mp4 and plays as the
// hero background; this poster is the pre-load frame shown before it starts.
export const heroPoster =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80';
