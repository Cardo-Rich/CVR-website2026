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

// Photo library imported from the previous cardorentals.com site (owner-
// provided, July 2026). Not all are placed yet — pull from here when a
// section needs imagery. Recompressed to ≤2400px / q80 on import.
export const photoLibrary = {
  // Real Cardo oceanfront property shots
  'oceanfront-living-dining': '/assets/photos/oceanfront-living-dining.jpg',   // beachfront great room, dining + ocean view
  'oceanfront-patio-hot-tub': '/assets/photos/oceanfront-patio-hot-tub.jpg',   // bifold doors open to hot-tub patio on the sand
  'oceanfront-living-view': '/assets/photos/oceanfront-living-view.jpg',       // living room looking over turf deck + surf
  // San Diego aerials
  'aerial-mission-bay': '/assets/photos/aerial-mission-bay.jpg',
  'aerial-pacific-beach': '/assets/photos/aerial-pacific-beach.jpg',
  // Estates & exteriors
  'estate-hacienda-pool': '/assets/photos/estate-hacienda-pool.jpg',           // Spanish hacienda rock pool courtyard
  'estate-mediterranean-pool-dusk': '/assets/photos/estate-mediterranean-pool-dusk.jpg',
  'estate-spanish-exterior': '/assets/photos/estate-spanish-exterior.jpg',     // La Cuesta estate exterior
  'home-modern-exterior-dusk': '/assets/photos/home-modern-exterior-dusk.jpg', // contemporary two-story at dusk (render)
  // Villas & pools
  'villa-modern-pool-sunset': '/assets/photos/villa-modern-pool-sunset.jpg',
  'villa-tropical-courtyard-pool': '/assets/photos/villa-tropical-courtyard-pool.jpg',
  'villa-hillside-infinity-pool': '/assets/photos/villa-hillside-infinity-pool.jpg',
  // Interiors
  'interior-white-kitchen-living': '/assets/photos/interior-white-kitchen-living.jpg',
  'interior-loft-great-room': '/assets/photos/interior-loft-great-room.jpg',   // double-height lounge, arched window
  'interior-contemporary-living': '/assets/photos/interior-contemporary-living.jpg',
  'interior-parisian-living': '/assets/photos/interior-parisian-living.jpg',   // white panelled walls, brass chandelier
  'interior-great-room-piano': '/assets/photos/interior-great-room-piano.jpg', // two-story great room, grand piano + fireplace
  'interior-coastal-condo-living': '/assets/photos/interior-coastal-condo-living.jpg',
  'kitchen-classic-white': '/assets/photos/kitchen-classic-white.jpg',         // farmhouse-sink classic kitchen
  'bedroom-water-view': '/assets/photos/bedroom-water-view.jpg',
  'condo-balcony-ocean': '/assets/photos/condo-balcony-ocean.jpg',             // high-rise balcony over the water
  // People
  'guests-family-poolside': '/assets/photos/guests-family-poolside.jpg',       // multigenerational family at the pool
} as const;

export type PhotoLibraryKey = keyof typeof photoLibrary;

// Hero video now lives at /assets/video/san-diego-hero.mp4 and plays as the
// hero background; this poster is the pre-load frame shown before it starts.
export const heroPoster =
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80';
