/* Booking search → the Cardo booking site. Both the home hero "bookbar" and the
   sticky nav search submit here instead of the old mock scroll.

   The booking site (booking.cardorentals.com) is Wander-powered and keeps its
   search state in the URL, so the query string we build has to match the names
   it reads — anything else is silently ignored and the visitor lands on an
   unfiltered search:

     checkin, checkout   yyyy-MM-dd  (lowercase — checkIn/checkOut are ignored)
     guests, pets        integers
     boundaries          west,south,east,north as four comma-separated floats

   e.g. /s?boundaries=-117.265,32.786,-117.215,32.812&guests=4&checkin=2026-08-04&checkout=2026-08-07

   Leaving a param off means "no filter", which is what we want for Anywhere and
   for empty dates. */
export var BOOKING_BASE = 'https://booking.cardorentals.com';
var SEARCH_PATH = '/s';

// Pre-filled stay: check-in a week out, three nights. The lead time matters —
// in peak season the next few days are booked solid, so opening the search on
// today's date lands the visitor on "no homes available".
export var LEAD_DAYS = 7;
export var STAY_NIGHTS = 3;

// Default party size for the hero widget's Guests select.
export var GUESTS_DEFAULT = 2;

/* Map boxes (west,south,east,north as lng,lat,lng,lat) for the "Where" select.
   Each box is drawn around homes we actually manage, so every option returns
   results — an option whose box is empty ("Anywhere") sends no boundaries at
   all, which searches the whole portfolio instead of clipping it to a box.
   Revisit these when the portfolio moves into a new area. */
export var AREAS = [
  { label: 'Anywhere', box: '' },
  { label: 'La Jolla', box: '-117.290,32.805,-117.235,32.875' },
  { label: 'Pacific Beach', box: '-117.265,32.786,-117.215,32.812' },
  { label: 'Mission Beach', box: '-117.262,32.755,-117.238,32.786' },
  { label: 'Ocean Beach', box: '-117.258,32.735,-117.235,32.752' },
  { label: 'Point Loma', box: '-117.262,32.700,-117.225,32.735' },
  { label: 'Clairemont', box: '-117.215,32.775,-117.155,32.845' },
  { label: 'University Heights', box: '-117.160,32.750,-117.135,32.772' },
  { label: 'North Park', box: '-117.155,32.735,-117.125,32.752' },
  { label: 'South Park', box: '-117.140,32.710,-117.100,32.740' },
  { label: 'Bankers Hill', box: '-117.180,32.705,-117.145,32.745' },
  { label: 'Del Mar', box: '-117.290,32.920,-117.180,32.985' },
  { label: 'La Mesa', box: '-117.070,32.735,-117.010,32.795' },
  { label: 'Carlsbad', box: '-117.380,33.070,-117.180,33.200' }
];

// Every party size from 1, then a final "16+" — the largest home sleeps 16.
export var GUEST_OPTIONS = (function () {
  var out = [];
  for (var n = 1; n <= 15; n++) out.push({ value: n, label: n === 1 ? '1 guest' : n + ' guests' });
  out.push({ value: 16, label: '16+ guests' });
  return out;
})();

export function boxFor(label) {
  for (var i = 0; i < AREAS.length; i++) if (AREAS[i].label === label) return AREAS[i].box;
  return '';
}

/* ---- Browse-by-category links (menu drawer + footer) ---------------------
   These used to be dead links that scrolled to the featured-homes strip. Each
   now runs a real filtered search. The engine's amenity vocabulary is a fixed
   enum — an unknown code is a 400, and a valid-but-unused one returns nothing
   — so every filter here was checked against the live search before shipping,
   with the count it returned today in the comment. Multiple amenities are OR'd.

   Note on pools: no home in the portfolio carries a pool amenity
   (OUTDOOR_POOL / INDOOR_POOL / HEATED_POOL all return zero), so a "Pools"
   link could only ever land on an empty result page. It's a hot tub link
   instead until pool homes are tagged upstream. */
export var CATEGORIES = [
  { label: 'Pet Friendly', params: 'petAllowed=true' },                                  // 13 homes
  { label: 'Hot Tub', params: 'amenities=HOT_TUB' },                                     //  9 homes
  { label: 'Beachside', params: 'boundaries=-117.290,32.700,-117.230,32.880' },          // 16 homes — the coastal strip, OB up through La Jolla
  { label: 'Has a View', params: 'amenities=OCEAN_VIEW,MOUNTAIN_VIEW,CITY_VIEW' },       // 18 homes
  { label: 'Large Groups', params: 'guests=10' }                                         //  5 homes
];

export function categoryUrl(category) {
  return BOOKING_BASE + SEARCH_PATH + '?' + category.params;
}

function guestsNum(v) {
  var m = String(v || '').match(/\d+/);
  return m ? m[0] : '';
}

/* ---- Dates ---------------------------------------------------------------
   Local-calendar dates, not UTC: a visitor in San Diego should see their own
   "today" pre-filled, not tomorrow's date because the browser is west of UTC. */
export function isoDate(d) {
  var m = String(d.getMonth() + 1), day = String(d.getDate());
  return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (day.length < 2 ? '0' + day : day);
}

export function today() {
  return isoDate(new Date());
}

export function addDays(iso, n) {
  var p = String(iso).split('-');
  return isoDate(new Date(+p[0], +p[1] - 1, +p[2] + n));
}

// The stay the widgets open on: a week out, three nights.
export function defaultCheckIn() { return addDays(today(), LEAD_DAYS); }
export function defaultCheckOut() { return addDays(defaultCheckIn(), STAY_NIGHTS); }

/* Pre-fill a widget's dates with the default stay and keep the pair sane
   afterwards. The markup carries build-time dates so the fields are never blank
   on first paint; this re-stamps them so a build that's been live for a while
   still opens on a stay in the visitor's future, not the build's. */
export function initDateFields(form) {
  var ci = form.querySelector('input[aria-label="Check in"]');
  var co = form.querySelector('input[aria-label="Check out"]');
  if (!ci || !co) return;
  var now = today();

  // Re-stamp only a field the visitor hasn't touched: the markup records what
  // the build put there, so a value that still matches is ours to move forward,
  // and anything else (a real choice, or one the browser restored) is left be.
  function untouched(el) { return !el.value || el.value === el.getAttribute('data-default'); }
  var ciFresh = untouched(ci), coFresh = untouched(co);

  // Visitors can still pick anything from today onward; only the pre-filled
  // value leads by a week.
  ci.min = now;
  if (ciFresh || ci.value < now) ci.value = defaultCheckIn();
  co.min = addDays(ci.value, 1);
  if (coFresh || co.value <= ci.value) co.value = addDays(ci.value, STAY_NIGHTS);

  ci.addEventListener('change', function () {
    if (!ci.value) return; // visitor cleared it — leave the pair alone
    if (ci.value < now) ci.value = now;
    co.min = addDays(ci.value, 1);
    if (co.value && co.value <= ci.value) co.value = addDays(ci.value, STAY_NIGHTS);
  });
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
  var box = boxFor(where);
  if (box) params.push('boundaries=' + box);
  if (guests) params.push('guests=' + encodeURIComponent(guests));
  // Only send a range the engine can use; a half-filled or inverted pair would
  // be thrown away on the other end anyway.
  if (checkin && checkout && checkout > checkin) {
    params.push('checkin=' + encodeURIComponent(checkin));
    params.push('checkout=' + encodeURIComponent(checkout));
  }
  return BOOKING_BASE + SEARCH_PATH + (params.length ? '?' + params.join('&') : '');
}
