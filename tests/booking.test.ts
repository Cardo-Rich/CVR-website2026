import { describe, it, expect } from 'vitest';
// @ts-expect-error — plain-JS browser module, no types
import {
  bookingUrlFrom, AREAS, GUEST_OPTIONS, boxFor, addDays, isoDate, today,
  CATEGORIES, categoryUrl, initDateFields,
} from '../src/scripts/booking.js';

/* A stand-in for the widget form: bookingUrlFrom only ever calls querySelector,
   so a map of selector → value is enough to exercise the URL builder in node. */
function form(fields: Record<string, string>) {
  return {
    querySelector(sel: string) {
      for (const [key, value] of Object.entries(fields)) if (sel.includes(key)) return { value };
      return null;
    },
  };
}

const params = (url: string) => new URLSearchParams(url.split('?')[1] ?? '');

describe('bookingUrlFrom', () => {
  it('sends the date range under the names the booking site reads', () => {
    const p = params(bookingUrlFrom(form({
      'Check in': '2026-08-04',
      'Check out': '2026-08-07',
    })));
    expect(p.get('checkin')).toBe('2026-08-04');
    expect(p.get('checkout')).toBe('2026-08-07');
    expect(p.has('checkIn')).toBe(false);
    expect(p.has('checkOut')).toBe(false);
  });

  it('drops a half-filled or inverted date range', () => {
    expect(params(bookingUrlFrom(form({ 'Check in': '2026-08-04' }))).has('checkin')).toBe(false);
    expect(params(bookingUrlFrom(form({ 'Check out': '2026-08-07' }))).has('checkout')).toBe(false);
    const inverted = params(bookingUrlFrom(form({ 'Check in': '2026-08-07', 'Check out': '2026-08-04' })));
    expect(inverted.has('checkin')).toBe(false);
  });

  it('searches the whole portfolio for Anywhere instead of clipping it to a box', () => {
    expect(params(bookingUrlFrom(form({ Neighborhood: 'Anywhere' }))).has('boundaries')).toBe(false);
  });

  it('sends a west,south,east,north box for a named area', () => {
    const box = params(bookingUrlFrom(form({ Neighborhood: 'Ocean Beach' }))).get('boundaries');
    const [w, s, e, n] = String(box).split(',').map(Number);
    expect([w, s, e, n].every(Number.isFinite)).toBe(true);
    expect(w).toBeLessThan(e);
    expect(s).toBeLessThan(n);
  });

  it('reads the party size out of the Guests option', () => {
    expect(params(bookingUrlFrom(form({ Guests: '16+ guests' }))).get('guests')).toBe('16');
    expect(params(bookingUrlFrom(form({ Guests: '7' }))).get('guests')).toBe('7');
  });
});

describe('search widget options', () => {
  it('offers every party size from 1 through 16+', () => {
    expect(GUEST_OPTIONS.map((g: { value: number }) => g.value)).toEqual([...Array(16)].map((_, i) => i + 1));
    expect(GUEST_OPTIONS[15].label).toBe('16+ guests');
  });

  it('gives every area but Anywhere a four-number box', () => {
    for (const area of AREAS) {
      if (area.label === 'Anywhere') { expect(area.box).toBe(''); continue; }
      expect(boxFor(area.label).split(',')).toHaveLength(4);
    }
  });
});

describe('date helpers', () => {
  it('formats and offsets local calendar dates, crossing month ends', () => {
    expect(isoDate(new Date(2026, 7, 4))).toBe('2026-08-04');
    expect(addDays('2026-08-30', 3)).toBe('2026-09-02');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
});

/* Stand-ins for the widget's two date inputs: initDateFields reads and writes
   value/min, toggles a class, and listens for events. pick() is the visitor
   choosing a date, which is the only thing that fires change. */
function dateInput(value = '') {
  const handlers: Record<string, Array<() => void>> = {};
  const classes = new Set<string>();
  return {
    value, min: '',
    classList: { toggle: (c: string, on: boolean) => (on ? classes.add(c) : classes.delete(c)) },
    addEventListener: (type: string, fn: () => void) => { (handlers[type] ??= []).push(fn); },
    pick(v: string) { this.value = v; for (const fn of handlers.change ?? []) fn(); },
    empty: () => classes.has('is-empty'),
  };
}

function widget(ciValue = '', coValue = '') {
  const ci = dateInput(ciValue), co = dateInput(coValue);
  initDateFields({ querySelector: (sel: string) => (sel.includes('Check in') ? ci : sel.includes('Check out') ? co : null) });
  return { ci, co };
}

describe('initDateFields', () => {
  const inDays = (n: number) => addDays(today(), n);

  it('opens with no dates, so the search covers every home', () => {
    const { ci, co } = widget();
    expect(ci.value).toBe('');
    expect(co.value).toBe('');
    expect(ci.min).toBe(today());
    expect(co.min).toBe(inDays(1));
    expect(ci.empty() && co.empty()).toBe(true);
    expect(params(bookingUrlFrom(form({ 'Check in': ci.value, 'Check out': co.value }))).has('checkin')).toBe(false);
  });

  it('leaves the check-out for the visitor to pick after a check-in', () => {
    const { ci, co } = widget();
    ci.pick(inDays(20));
    expect(co.value).toBe('');
    expect(co.min).toBe(inDays(21));
    expect(ci.empty()).toBe(false);
    expect(co.empty()).toBe(true);
  });

  it('clears a check-out the check-in moves onto or past, and keeps any other', () => {
    const { ci, co } = widget();
    co.pick(inDays(18));
    ci.pick(inDays(12));
    expect(co.value).toBe(inDays(18));
    ci.pick(inDays(18));
    expect(co.value).toBe('');
    expect(co.empty()).toBe(true);
    co.pick(inDays(30));
    ci.pick(inDays(25));
    expect(co.value).toBe(inDays(30));
  });

  it('keeps the check-out when the check-in is cleared', () => {
    const { ci, co } = widget();
    ci.pick(inDays(20));
    co.pick(inDays(23));
    ci.pick('');
    expect(co.value).toBe(inDays(23));
    expect(co.min).toBe(inDays(1));
    expect(ci.empty()).toBe(true);
  });

  it('keeps dates the browser restored, unless they have stopped making sense', () => {
    expect(widget(inDays(5), inDays(9))).toMatchObject({ ci: { value: inDays(5) }, co: { value: inDays(9) } });
    const stale = widget(inDays(-3), inDays(-1));
    expect(stale.ci.value).toBe('');
    expect(stale.co.value).toBe('');
    expect(widget(inDays(5), inDays(5)).co.value).toBe('');
  });
});

describe('browse-by-category links', () => {
  it('points every category at a real filtered search on the booking site', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0);
    for (const c of CATEGORIES) {
      const url = new URL(categoryUrl(c));
      expect(url.origin).toBe('https://booking.cardorentals.com');
      expect(url.pathname).toBe('/s');
      // A filter that carries no criteria would just be an unfiltered search.
      expect([...url.searchParams.keys()].length).toBeGreaterThan(0);
    }
  });

  it('only uses filter params the booking engine reads', () => {
    const allowed = new Set(['petAllowed', 'amenities', 'boundaries', 'guests', 'minBedrooms', 'minBathrooms', 'priceMin', 'priceMax']);
    for (const c of CATEGORIES) {
      for (const key of new URL(categoryUrl(c)).searchParams.keys()) {
        expect(allowed.has(key)).toBe(true);
      }
    }
  });

  it('never points a category at the old scroll-to-anchor', () => {
    for (const c of CATEGORIES) expect(categoryUrl(c)).not.toContain('#results');
  });
});
