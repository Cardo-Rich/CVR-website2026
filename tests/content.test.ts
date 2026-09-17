import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDb } from '../src/lib/content/firestore';
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

// The Journal reads Firestore only, so these tests hand the content layer a
// fake db: a map of collection name → documents.
type Doc = Record<string, unknown>;
function fakeDb(collections: Record<string, Doc[]>) {
  return {
    collection: (name: string) => ({
      get: async () => ({ docs: (collections[name] || []).map((data) => ({ data: () => data })) }),
    }),
  };
}
async function articlesWith(collections: Record<string, Doc[]> | null) {
  vi.resetModules();
  vi.doMock('../src/lib/content/firestore', () => ({ getDb: () => (collections ? fakeDb(collections) : null) }));
  return import('../src/lib/content/articles');
}
const post = (slug: string, date: string, extra: Doc = {}): Doc => ({ slug, title: slug, date, status: 'published', ...extra });

describe('articles (Firestore only)', () => {
  beforeEach(() => { delete process.env.ALLOW_EMPTY_BLOG; });

  it('fails the build when there is no Firestore', async () => {
    const m = await articlesWith(null);
    await expect(m.getPublishedArticles()).rejects.toThrow(/FIREBASE_SERVICE_ACCOUNT/);
  });

  it('refuses to build an empty Journal unless overridden', async () => {
    const m = await articlesWith({ articles: [] });
    await expect(m.getPublishedArticles()).rejects.toThrow(/zero published articles/);
    process.env.ALLOW_EMPTY_BLOG = '1';
    m.resetArticleCache();
    expect(await m.getPublishedArticles()).toEqual([]);
  });

  it('returns only published articles, newest first', async () => {
    const m = await articlesWith({ articles: [
      post('older', '2026-03-01'),
      post('newest', '2026-09-16'),
      { slug: 'not-live', title: 'x', date: '2026-12-01', status: 'draft' },
    ] });
    const list = await m.getPublishedArticles();
    expect(list.map((a) => a.slug)).toEqual(['newest', 'older']);
  });

  it('finds one by slug', async () => {
    const m = await articlesWith({ articles: [post('a', '2026-01-01'), post('b', '2026-02-01')] });
    expect((await m.getArticleBySlug('a'))?.slug).toBe('a');
    expect(await m.getArticleBySlug('zzz')).toBeNull();
  });

  it('returns drafts that carry a preview key, and an empty list when there are none', async () => {
    const m = await articlesWith({ articles: [post('a', '2026-01-01')], articleDrafts: [
      { slug: 'pending', title: 'Pending', date: '2026-09-17', previewKey: 'k1' },
      { slug: 'broken', title: 'No key', date: '2026-09-17' },
    ] });
    expect((await m.getDraftArticles()).map((d) => d.slug)).toEqual(['pending']);
    const none = await articlesWith({ articles: [post('a', '2026-01-01')] });
    expect(await none.getDraftArticles()).toEqual([]);
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
