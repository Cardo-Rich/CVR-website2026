/* Booking search → the Cardo booking site. Both the home hero "bookbar" and the
   sticky nav search submit here instead of the old mock scroll.

   The booking site is moving to booking.cardorentals.com (not live yet) — flip
   BOOKING_BASE below when the DNS is ready and nothing else needs to change.

   URL format mirrors the booking engine's search page, e.g.
     /s?boundaries=<lng,lat,lng,lat>&guests=2&checkIn=2026-07-10&checkOut=2026-07-15
   "boundaries" is a west,south,east,north map box; when the visitor leaves the
   dates empty we send dateFlexibility=1 like the engine's own share links. */
export var BOOKING_BASE = 'https://booking.cardorentals.com';
var SEARCH_PATH = '/s';

// Approximate map bounding boxes (west,south,east,north as lng,lat,lng,lat) per
// neighborhood option. "Anywhere" is greater San Diego (the engine's own box).
// These are close enough to bias the search to the right area; refine as needed.
var AREAS = {
  'Anywhere': '-117.30733860536475,32.710388006961196,-117.06020939463525,32.95643600696121',
  'La Jolla': '-117.2820,32.8230,-117.2350,32.8720',
  'Pacific Beach': '-117.2620,32.7870,-117.2190,32.8110',
  'Mission Beach': '-117.2560,32.7680,-117.2380,32.7930',
  'Del Mar': '-117.2800,32.9340,-117.2400,32.9720',
  'Encinitas': '-117.3160,33.0300,-117.2500,33.0850',
  'Carlsbad': '-117.3720,33.0980,-117.2600,33.1800',
  'Coronado': '-117.1980,32.6650,-117.1600,32.7020'
};

function guestsNum(v) {
  var m = String(v || '').match(/\d+/);
  return m ? m[0] : '';
}

// Read a widget form (hero bookbar or nav search) and build the booking URL.
// Fields are found by aria-label so the same reader works for both layouts.
export function bookingUrlFrom(form) {
  function val(sel) { var el = form.querySelector(sel); return el ? el.value : ''; }
  var where = val('select[aria-label="Where"], select[aria-label="Neighborhood"]');
  var checkin = val('input[aria-label="Check in"]');
  var checkout = val('input[aria-label="Check out"]');
  var guests = guestsNum(val('select[aria-label="Guests"]'));

  var params = [];
  var box = AREAS[where];
  if (box) params.push('boundaries=' + encodeURIComponent(box));
  if (guests) params.push('guests=' + encodeURIComponent(guests));
  if (checkin && checkout) {
    params.push('checkIn=' + encodeURIComponent(checkin));
    params.push('checkOut=' + encodeURIComponent(checkout));
  } else {
    params.push('dateFlexibility=1');
  }
  return BOOKING_BASE + SEARCH_PATH + (params.length ? '?' + params.join('&') : '');
}
