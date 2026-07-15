import { useEffect, useState } from 'react';
import { getContent, saveContent, syncGoogle } from './api';
import type { CaseStudyItem, ReviewCard, ReviewsDoc } from './api';
import './content.css';

// Defaults mirror the static owners page, so the CMS starts pre-filled and
// the site looks identical before the first edit.
const DEFAULT_CASES: CaseStudyItem[] = [
  { id: 'falcon', name: 'Falcon', hood: 'La Jolla', beds: '4 BR', hook: 'An inherited bluff home, fully reimagined and launched in five weeks.', revenue: '$214,800', nightly: '$589 / night', lift: '+57% over market' },
  { id: 'nute', name: 'Nute', hood: 'Pacific Beach', beds: '3 BR', hook: 'A tired walk-street rental turned light, bright, and fully booked.', revenue: '$158,300', nightly: '$412 / night', lift: '+44% over market' },
  { id: 'twain', name: 'Twain', hood: 'Del Mar', beds: '4 BR', hook: "A craftsman classic styled to own Del Mar's racing season.", revenue: '$192,500', nightly: '$512 / night', lift: '+48% over market' },
  { id: 'sixth', name: 'Sixth', hood: 'Mission Beach', beds: '2 BR', hook: 'A compact two-bedroom that punches well above its size.', revenue: '$128,400', nightly: '$356 / night', lift: '+39% over market' },
  { id: 'kane', name: 'Kane', hood: 'Encinitas', beds: '3 BR', hook: 'A surf-town home with a game room guests book it for.', revenue: '$168,300', nightly: '$447 / night', lift: '+41% over market' },
  { id: 'mt-ainsworth', name: 'Mt Ainsworth', hood: 'Coronado', beds: '5 BR', hook: 'A five-bedroom estate with a resort backyard, top of its market.', revenue: '$268,900', nightly: '$694 / night', lift: '+61% over market' },
];
const DEFAULT_REVIEWS: ReviewsDoc = {
  google: { placeId: '', rating: 4.9, count: 100, reviews: [] },
  airbnb: { rating: 4.95, count: 2500, reviews: [] },
};

const CASE_FIELDS: { key: keyof CaseStudyItem; label: string; wide?: boolean }[] = [
  { key: 'name', label: 'Name' },
  { key: 'hood', label: 'Neighborhood' },
  { key: 'beds', label: 'Beds' },
  { key: 'revenue', label: 'Annual revenue' },
  { key: 'nightly', label: 'Nightly' },
  { key: 'lift', label: 'Lift vs market' },
  { key: 'hook', label: 'Hook', wide: true },
  { key: 'img', label: 'Image URL (optional)', wide: true },
];

export default function ContentModule() {
  const [tab, setTab] = useState<'cases' | 'reviews'>('cases');
  const [cases, setCases] = useState<CaseStudyItem[]>([]);
  const [reviews, setReviews] = useState<ReviewsDoc>(DEFAULT_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  useEffect(() => {
    getContent()
      .then((c) => {
        setCases(c.caseStudies.length ? c.caseStudies : DEFAULT_CASES);
        setReviews({
          google: { ...DEFAULT_REVIEWS.google, ...(c.reviews?.google || {}) },
          airbnb: { ...DEFAULT_REVIEWS.airbnb, ...(c.reviews?.airbnb || {}) },
        });
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true); setError(''); setSaved(false);
    try {
      await saveContent({ caseStudies: cases, reviews });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  async function doSync() {
    setSyncing(true); setSyncMsg(''); setError('');
    try {
      const r = await syncGoogle(reviews.google.placeId || undefined);
      setSyncMsg(`Synced: ${r.rating} ★ · ${r.count} reviews · ${r.reviews} cards pulled`);
      const fresh = await getContent();
      setReviews((prev) => ({ ...prev, google: { ...prev.google, ...(fresh.reviews?.google || {}) } }));
    } catch (e) { setError((e as Error).message); }
    finally { setSyncing(false); }
  }

  function setCase(i: number, key: keyof CaseStudyItem, v: string) {
    setCases((prev) => prev.map((c, k) => (k === i ? { ...c, [key]: v } : c)));
  }
  function setAirbnbCard(i: number, key: keyof ReviewCard, v: string | number) {
    setReviews((prev) => ({
      ...prev,
      airbnb: { ...prev.airbnb, reviews: (prev.airbnb.reviews || []).map((c, k) => (k === i ? { ...c, [key]: v } : c)) },
    }));
  }

  if (loading) return <p className="ct-muted">Loading site content…</p>;

  return (
    <div className="ct">
      <div className="ct-tabs">
        <button className={tab === 'cases' ? 'is-on' : ''} onClick={() => setTab('cases')}>Case studies</button>
        <button className={tab === 'reviews' ? 'is-on' : ''} onClick={() => setTab('reviews')}>Reviews</button>
        <span className="spacer" />
        {saved && <span className="ct-saved">Saved ✓</span>}
        <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save & publish'}</button>
      </div>
      {error && <p className="ct-error">{error}</p>}

      {tab === 'cases' && (
        <div className="ct-cases">
          <p className="ct-muted">These drive the six cards in “Home design and project management” on the owners page. Changes go live within ~10 minutes of saving (CDN cache).</p>
          {cases.map((c, i) => (
            <fieldset className="ct-case" key={c.id || i}>
              <legend>{c.name || `Case ${i + 1}`} <span className="ct-id">({c.id})</span></legend>
              <div className="ct-grid">
                {CASE_FIELDS.map((f) => (
                  <label className={f.wide ? 'wide' : ''} key={f.key}>
                    <span>{f.label}</span>
                    <input value={(c[f.key] as string) || ''} onChange={(e) => setCase(i, f.key, e.target.value)} />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="ct-reviews">
          <fieldset className="ct-case">
            <legend>Google (live sync)</legend>
            <div className="ct-grid">
              <label className="wide">
                <span>Place ID <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noreferrer">(find yours)</a></span>
                <input value={reviews.google.placeId || ''} placeholder="ChIJ…" onChange={(e) => setReviews((p) => ({ ...p, google: { ...p.google, placeId: e.target.value } }))} />
              </label>
              <label><span>Rating</span><input value={reviews.google.rating ?? ''} readOnly /></label>
              <label><span>Review count</span><input value={reviews.google.count ?? ''} readOnly /></label>
            </div>
            <div className="ct-row">
              <button className="btn" onClick={doSync} disabled={syncing}>{syncing ? 'Syncing…' : 'Sync from Google now'}</button>
              <span className="ct-muted">{syncMsg || (reviews.google.syncedAt ? `Last synced ${new Date(reviews.google.syncedAt).toLocaleString()}` : 'Never synced — rating/count/cards pull straight from your Google listing.')}</span>
            </div>
            {(reviews.google.reviews || []).length > 0 && (
              <ul className="ct-preview">
                {(reviews.google.reviews || []).slice(0, 4).map((r, i) => (
                  <li key={i}><b>{r.name}</b> · {'★'.repeat(r.stars)} — {r.text.slice(0, 140)}{r.text.length > 140 ? '…' : ''}</li>
                ))}
              </ul>
            )}
          </fieldset>

          <fieldset className="ct-case">
            <legend>Airbnb (managed here — Airbnb has no public API)</legend>
            <div className="ct-grid">
              <label><span>Rating</span><input value={reviews.airbnb.rating ?? ''} onChange={(e) => setReviews((p) => ({ ...p, airbnb: { ...p.airbnb, rating: Number(e.target.value) || null } }))} /></label>
              <label><span>Review count</span><input value={reviews.airbnb.count ?? ''} onChange={(e) => setReviews((p) => ({ ...p, airbnb: { ...p.airbnb, count: Number(e.target.value) || null } }))} /></label>
            </div>
            {(reviews.airbnb.reviews || []).map((c, i) => (
              <div className="ct-grid ct-card" key={i}>
                <label><span>Name</span><input value={c.name} onChange={(e) => setAirbnbCard(i, 'name', e.target.value)} /></label>
                <label><span>Meta (e.g. “Stayed in La Jolla · April 2026”)</span><input value={c.meta} onChange={(e) => setAirbnbCard(i, 'meta', e.target.value)} /></label>
                <label><span>Stars (1–5)</span><input type="number" min={1} max={5} value={c.stars} onChange={(e) => setAirbnbCard(i, 'stars', Number(e.target.value) || 5)} /></label>
                <label className="wide"><span>Review text</span><input value={c.text} onChange={(e) => setAirbnbCard(i, 'text', e.target.value)} /></label>
                <button className="btn-ghost ct-remove" onClick={() => setReviews((p) => ({ ...p, airbnb: { ...p.airbnb, reviews: (p.airbnb.reviews || []).filter((_, k) => k !== i) } }))}>Remove</button>
              </div>
            ))}
            <button className="btn-ghost" onClick={() => setReviews((p) => ({ ...p, airbnb: { ...p.airbnb, reviews: [...(p.airbnb.reviews || []), { name: '', meta: '', stars: 5, text: '' }] } }))}>+ Add Airbnb review</button>
          </fieldset>
        </div>
      )}
    </div>
  );
}
