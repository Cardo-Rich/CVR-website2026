// =============================================================
// Cardo V3 home — content + image map.
// Local `assets/photos/designs-*.jpg` were not shipped in the handoff;
// these Unsplash placeholders stand in. Swap for Cardo photography in
// production by replacing the URLs here (or dropping files in
// public/assets/photos and pointing these keys at them).
// =============================================================

const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// keyed by the reference's designs-*.jpg basename (without extension)
export const homePhotos = {
  'living-craftsman': U('1618221195710-dd6b41faaea6'),
  'living-bright': U('1616486338812-3dadae4b4ace'),
  'dining': U('1617806118233-18e1de247200'),
  'bedroom-floral': U('1522708323590-d24dbb6b0267'),
  'gameroom': U('1598928506311-c55ded91a20c'),
  'pool': U('1613490493576-7fde63acd811'),
  'amenities': U('1600585154340-be6161a56a0c'),
  'living-fireplace': U('1600607687939-ce8a6c25118c', 1600),
} as const;

export type HomePhotoKey = keyof typeof homePhotos;

// Hero video: no source shipped. Leave the poster as the visible hero;
// drop a file at public/assets/video/san-diego-hero.mp4 to enable video.
export const heroPoster = U('1613490493576-7fde63acd811', 2000);
