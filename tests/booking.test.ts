import { describe, it, expect } from 'vitest';
// @ts-expect-error — plain-JS browser module, no types
import { bookingUrlFrom, AREAS, GUEST_OPTIONS, boxFor, addDays, isoDate } from '../src/scripts/booking.js';

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
