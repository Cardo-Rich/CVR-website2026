import { describe, it, expect } from 'vitest';
import { cleanArticle, deriveDate, sortArticles, slugify, previewKey, revisionExpiry, REVISION_TTL_DAYS } from '../src/article.js';

const base = {
  title: 'The 7-day rule: when short-term rental losses offset W-2 income',
  category: 'Tax',
  dateFull: 'September 15, 2026',
  bodyHtml: '<p>Body</p>',
};

describe('cleanArticle', () => {
  it('derives the slug from the title when none is given', () => {
    expect(cleanArticle(base).slug).toBe('the-7-day-rule-when-short-term-rental-losses-offset-w-2-income');
  });
  it('keeps an explicit slug, sanitised', () => {
    expect(cleanArticle({ ...base, slug: 'Cost Segregation!' }).slug).toBe('cost-segregation');
  });
  it('derives the ISO date from the display date', () => {
    expect(cleanArticle(base).date).toBe('2026-09-15');
  });
  it('rejects a missing title', () => {
    expect(() => cleanArticle({ ...base, title: '  ' })).toThrow(/Title is required/);
  });
  it('drops an empty case-study block and keeps a filled one', () => {
    expect(cleanArticle({ ...base, caseStudy: { name: '', hood: '' } }).caseStudy).toBeUndefined();
    const withCase = cleanArticle({ ...base, caseStudy: { name: 'Falcon', hood: 'La Jolla', gallery: ['/a.jpg', 42] } });
    expect(withCase.caseStudy?.name).toBe('Falcon');
    expect(withCase.caseStudy?.gallery).toEqual(['/a.jpg', '42']);
  });
  it('coerces booleans strictly', () => {
    const a = cleanArticle({ ...base, featured: 'yes', showOnHome: true });
    expect(a.featured).toBe(false);
    expect(a.showOnHome).toBe(true);
  });
});

describe('deriveDate', () => {
  it('falls back to the given date when the display date is unparseable', () => {
    expect(deriveDate('sometime soon', new Date('2026-01-02T12:00:00Z'))).toBe('2026-01-02');
  });
});

describe('sortArticles', () => {
  it('orders newest first, then by title', () => {
    const out = sortArticles([
      { date: '2026-05-01', title: 'B' },
      { date: '2026-09-01', title: 'Z' },
      { date: '2026-05-01', title: 'A' },
    ]);
    expect(out.map((a) => a.title)).toEqual(['Z', 'A', 'B']);
  });
});

describe('helpers', () => {
  it('slugify strips punctuation and caps length', () => {
    expect(slugify('  Hello, World!  ')).toBe('hello-world');
    expect(slugify('x'.repeat(200)).length).toBe(100);
  });
  it('previewKey is url-safe and unique', () => {
    const a = previewKey(), b = previewKey();
    expect(a).toMatch(/^[A-Za-z0-9_-]{20,}$/);
    expect(a).not.toBe(b);
  });
  it('revisionExpiry is REVISION_TTL_DAYS out', () => {
    const from = new Date('2026-09-17T00:00:00Z');
    expect(revisionExpiry(from)).toBe(new Date(from.getTime() + REVISION_TTL_DAYS * 86400000).toISOString());
  });
});
