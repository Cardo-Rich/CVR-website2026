import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDb } from '../src/lib/content/firestore';
import { getPublishedArticles, getArticleBySlug } from '../src/lib/content/articles';
import { getPublishedCaseStudies, getCaseStudyBySlug } from '../src/lib/content/case-studies';
import { getFeaturedProperties } from '../src/lib/content/properties';

describe('getDb', () => {
  beforeEach(() => { delete process.env.FIREBASE_SERVICE_ACCOUNT; delete process.env.GOOGLE_APPLICATION_CREDENTIALS; delete process.env.FIRESTORE_EMULATOR_HOST; });
  it('returns null when no credentials/emulator are configured', () => {
    expect(getDb()).toBeNull();
  });
  it('returns null (degrades) instead of throwing when FIREBASE_SERVICE_ACCOUNT is malformed JSON', async () => {
    vi.resetModules();
    process.env.FIREBASE_SERVICE_ACCOUNT = 'not-valid-json{';
    const fresh = await import('../src/lib/content/firestore');
    expect(() => fresh.getDb()).not.toThrow();
    expect(fresh.getDb()).toBeNull();
    delete process.env.FIREBASE_SERVICE_ACCOUNT;
  });
});

describe('articles (seed fallback)', () => {
  beforeEach(() => { delete process.env.FIREBASE_SERVICE_ACCOUNT; delete process.env.GOOGLE_APPLICATION_CREDENTIALS; delete process.env.FIRESTORE_EMULATOR_HOST; });
  it('returns the seed articles when no db', async () => {
    const arts = await getPublishedArticles();
    expect(arts.length).toBeGreaterThan(0);
    expect(arts.every(a => a.slug)).toBe(true);
  });
  it('finds one by slug', async () => {
    const arts = await getPublishedArticles();
    const one = await getArticleBySlug(arts[0].slug);
    expect(one?.slug).toBe(arts[0].slug);
  });
});

describe('case studies + featured (seed fallback)', () => {
  beforeEach(() => { delete process.env.FIREBASE_SERVICE_ACCOUNT; delete process.env.GOOGLE_APPLICATION_CREDENTIALS; delete process.env.FIRESTORE_EMULATOR_HOST; });
  it('returns seed case studies', async () => { expect((await getPublishedCaseStudies()).length).toBe(6); });
  it('finds a case study by slug', async () => {
    const all = await getPublishedCaseStudies();
    const one = await getCaseStudyBySlug(all[0].slug);
    expect(one?.slug).toBe(all[0].slug);
  });
  it('returns featured cards with hrefs', async () => {
    const f = await getFeaturedProperties();
    expect(f.length).toBeGreaterThan(0);
    expect(f.every(c => c.href && c.name)).toBe(true);
  });
});
