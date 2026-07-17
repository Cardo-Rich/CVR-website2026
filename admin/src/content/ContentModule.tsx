import { useEffect, useState } from 'react';
import { getContent, saveContent, syncGoogle, publish, discardDraft } from './api';
import type { CaseStudyItem, ReviewCard, ReviewsDoc, SectionsMap } from './api';
import './content.css';

// Site sections that can be switched off while their content is still being
// finalized. Keys match the data-section attributes in the site markup.
const SECTION_SWITCHES: { key: string; page: string; label: string; note?: string }[] = [
  { key: 'featured-homes', page: 'Home', label: '“Homes that we love” carousel' },
  { key: 'guest-photos', page: 'Home', label: 'Guest photos grid' },
  { key: 'case-studies', page: 'Owners + Blog', label: 'Case studies', note: 'Hides the owners-page grid and the blog case-study library.' },
  { key: 'airbnb-proof', page: 'Owners', label: 'Airbnb review phone mockups' },
  { key: 'by-the-numbers', page: 'Owners', label: '“By the numbers” stats' },
  { key: 'partners', page: 'Owners', label: 'Partner logo strip' },
  { key: 'team', page: 'Owners', label: 'Meet the team' },
  { key: 'founder', page: 'Owners', label: 'Founder note' },
];

// Defaults mirror the static owners page, so the CMS starts pre-filled and
// the site looks identical before the first edit.
const DEFAULT_CASES: CaseStudyItem[] = [
  { id: 'falcon', name: 'Falcon', hood: 'La Jolla', beds: '4 BR', hook: 'An inherited bluff home, fully reimagined and launched in five weeks.', revenue: '$214,800', nightly: '$589 / night', lift: '+57% over market', featured: true, blurb: 'An inherited bluff home, frozen in time, fully reimagined and launched in five weeks. Our team cleared, repainted, and furnished every room to make the most of the light and the view — sourced, shipped, installed, and photo-ready — and it settled into the top tier of its La Jolla market.' },
  { id: 'nute', name: 'Nute', hood: 'Pacific Beach', beds: '3 BR', hook: 'A tired walk-street rental turned light, bright, and fully booked.', revenue: '$158,300', nightly: '$412 / night', lift: '+44% over market', featured: true, blurb: 'A tired walk-street rental taken from drab to coastal-bright — a lighter palette, smarter furniture for the layout, and styling that made the small footprint feel generous. It photographed beautifully and booked solid in its first month.' },
  { id: 'twain', name: 'Twain', hood: 'Del Mar', beds: '4 BR', hook: "A craftsman classic styled to own Del Mar's racing season.", revenue: '$192,500', nightly: '$512 / night', lift: '+48% over market', featured: true, blurb: "A true craftsman styled around its architecture, not over it — warm, layered furnishings that read editorial in photos and live comfortably for a full house. Twain now commands Del Mar's racing-season premium and holds strong year-round." },
  { id: 'sixth', name: 'Sixth', hood: 'Mission Beach', beds: '2 BR', hook: 'A compact two-bedroom that punches well above its size.', revenue: '$128,400', nightly: '$356 / night', lift: '+39% over market', featured: true, blurb: 'A compact two-bedroom a block from the sand, designed so every inch works twice as hard — dual-purpose furniture, a bright cohesive palette, and styling that photographs larger than the footprint. Guests book it for the location and rate it for the comfort.' },
  { id: 'kane', name: 'Kane', hood: 'Encinitas', beds: '3 BR', hook: 'A surf-town home with a game room guests book it for.', revenue: '$168,300', nightly: '$447 / night', lift: '+41% over market', featured: true, blurb: 'A surf-town home with an underused bonus room, turned into a moody navy game room that anchors the whole listing. We styled the rest of the home to match the energy — and it became the feature guests search for.' },
  { id: 'mt-ainsworth', name: 'Mt Ainsworth', hood: 'Coronado', beds: '5 BR', hook: 'A five-bedroom estate with a resort backyard, top of its market.', revenue: '$268,900', nightly: '$694 / night', lift: '+61% over market', featured: true, blurb: 'The largest home in the group — five bedrooms, a pool, and a backyard built for entertaining. We furnished it as a true estate that photographs like a luxury hotel, with a backyard styled into a destination of its own. It launched at the top of its comp set.' },
];
const DEFAULT_REVIEWS: ReviewsDoc = {
  google: { placeId: '', rating: 4.9, count: 100, minStars: 5, reviews: [] },
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
  const [tab, setTab] = useState<'cases' | 'reviews' | 'sections'>('cases');
  const [cases, setCases] = useState<CaseStudyItem[]>([]);
  const [reviews, setReviews] = useState<ReviewsDoc>(DEFAULT_REVIEWS);
  const [sections, setSections] = useState<SectionsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [hasDraft, setHasDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishMsg, setPublishMsg] = useState('');

  useEffect(() => {
    getContent()
      .then((c) => {
        setCases(c.caseStudies.length ? c.caseStudies : DEFAULT_CASES);
        setReviews({
          google: { ...DEFAULT_REVIEWS.google, ...(c.reviews?.google || {}) },
          airbnb: { ...DEFAULT_REVIEWS.airbnb, ...(c.reviews?.airbnb || {}) },
        });
        setSections(c.sections || {});
        setHasDraft(!!c.hasDraft);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true); setError(''); setSaved(false);
    try {
      const withIds = cases.map((c) => ({ ...c, id: c.id || slugify(c.name) }));
      setCases(withIds);
      await saveContent({ caseStudies: withIds, reviews, sections });
      setSaved(true);
      setHasDraft(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { setError((e as Error).message); }
    finally { setSaving(false); }
  }

  async function doPublish() {
    setPublishing(true); setError(''); setPublishMsg('');
    try {
      const r = await publish();
      setPublishMsg(r.rebuild === 'triggered' ? 'Published — site rebuilding.' : 'Published live.');
      setHasDraft(false);
      setTimeout(() => setPublishMsg(''), 4000);
    } catch (e) { setError((e as Error).message); }
    finally { setPublishing(false); }
  }

  async function doDiscard() {
    if (!window.confirm('Discard all unpublished draft changes and revert to the live version?')) return;
    setPublishing(true); setError(''); setPublishMsg('');
    try {
      await discardDraft();
      const fresh = await getContent();
      setCases(fresh.caseStudies.length ? fresh.caseStudies : DEFAULT_CASES);
      setReviews({
        google: { ...DEFAULT_REVIEWS.google, ...(fresh.reviews?.google || {}) },
        airbnb: { ...DEFAULT_REVIEWS.airbnb, ...(fresh.reviews?.airbnb || {}) },
      });
      setSections(fresh.sections || {});
      setHasDraft(false);
      setPublishMsg('Draft discarded.');
      setTimeout(() => setPublishMsg(''), 4000);
    } catch (e) { setError((e as Error).message); }
    finally { setPublishing(false); }
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

  function setCase(i: number, key: keyof CaseStudyItem, v: string | boolean) {
    setCases((prev) => prev.map((c, k) => (k === i ? { ...c, [key]: v } : c)));
  }
  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'case-' + (cases.length + 1);
  }
  function addCase() {
    setCases((prev) => [...prev, { id: '', name: '', hood: '', beds: '', hook: '', revenue: '', nightly: '', lift: '', img: '', featured: false, blurb: '' }]);
  }
  function removeCase(i: number) {
    if (!window.confirm('Remove this case study? This deletes it from the library (and the site) on save.')) return;
    setCases((prev) => prev.filter((_, k) => k !== i));
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
        <button className={tab === 'sections' ? 'is-on' : ''} onClick={() => setTab('sections')}>Sections</button>
        <span className="spacer" />
        {publishMsg && <span className="ct-saved">{publishMsg}</span>}
        {saved && <span className="ct-saved">Draft saved ✓</span>}
        {hasDraft && <span className="ct-draft-badge">Draft changes pending</span>}
        <button className="btn-ghost" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save draft'}</button>
        {hasDraft && <button className="btn-ghost ct-remove" onClick={doDiscard} disabled={publishing}>Discard</button>}
        <button className="btn" onClick={doPublish} disabled={publishing || !hasDraft}>{publishing ? 'Publishing…' : 'Publish'}</button>
      </div>
      {error && <p className="ct-error">{error}</p>}

      {tab === 'cases' && (
        <div className="ct-cases">
          <p className="ct-muted">The full case library. <b>“Show on owners page”</b> puts a case in the owners-page grid; every case (shown or not) appears in the blog’s case-study library. Changes go live within ~10 minutes of saving (CDN cache).</p>
          {cases.map((c, i) => (
            <fieldset className="ct-case" key={i}>
              <legend>
                {c.name || `Case ${i + 1}`} <span className="ct-id">({c.id || 'id auto-set on save'})</span>
              </legend>
              <div className="ct-row" style={{ marginTop: 0, marginBottom: 12 }}>
                <label className="ct-check">
                  <input type="checkbox" checked={c.featured !== false} onChange={(e) => setCase(i, 'featured', e.target.checked)} />
                  <span>Show on owners page</span>
                </label>
                <span className="spacer" />
                <button className="btn-ghost ct-remove" onClick={() => removeCase(i)}>Remove</button>
              </div>
              <div className="ct-grid">
                {CASE_FIELDS.map((f) => (
                  <label className={f.wide ? 'wide' : ''} key={f.key}>
                    <span>{f.label}</span>
                    <input value={(c[f.key] as string) || ''} onChange={(e) => setCase(i, f.key, e.target.value)} />
                  </label>
                ))}
                <label className="wide">
                  <span>Preview-modal story (optional — falls back to the hook)</span>
                  <input value={c.blurb || ''} onChange={(e) => setCase(i, 'blurb', e.target.value)} />
                </label>
              </div>
            </fieldset>
          ))}
          <button className="btn-ghost" onClick={addCase}>+ Add case study</button>
        </div>
      )}

      {tab === 'sections' && (
        <div className="ct-cases">
          <p className="ct-muted">Switch a section <b>off</b> to hide it on the live site while its content is still being finalized — flip it back on when the real data is in. Changes go live within ~10 minutes of saving (CDN cache).</p>
          {SECTION_SWITCHES.map((s) => (
            <fieldset className="ct-case" key={s.key}>
              <legend>{s.page}</legend>
              <div className="ct-row" style={{ marginTop: 0 }}>
                <label className="ct-check">
                  <input type="checkbox" checked={sections[s.key] !== false} onChange={(e) => setSections((p) => ({ ...p, [s.key]: e.target.checked }))} />
                  <span>{s.label}{sections[s.key] === false && <em style={{ color: '#b3261e', fontStyle: 'normal' }}> — hidden</em>}</span>
                </label>
              </div>
              {s.note && <p className="ct-muted" style={{ margin: '6px 0 0' }}>{s.note}</p>}
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
              <label>
                <span>Minimum stars to show on site</span>
                <select value={reviews.google.minStars ?? 5} onChange={(e) => setReviews((p) => ({ ...p, google: { ...p.google, minStars: Number(e.target.value) } }))}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n === 1 ? 'Show all reviews' : `${n} stars and up`}</option>)}
                </select>
              </label>
            </div>
            <div className="ct-row">
              <button className="btn" onClick={doSync} disabled={syncing}>{syncing ? 'Syncing…' : 'Sync from Google now'}</button>
              <span className="ct-muted">{syncMsg || (reviews.google.syncedAt ? `Last synced ${new Date(reviews.google.syncedAt).toLocaleString()}` : 'Never synced — rating/count/cards pull straight from your Google listing.')}</span>
            </div>
            {(reviews.google.reviews || []).length > 0 && (
              <ul className="ct-preview">
                {(reviews.google.reviews || []).slice(0, 8).map((r, i) => {
                  const hidden = r.stars < (reviews.google.minStars ?? 5);
                  return (
                    <li key={i} className={hidden ? 'ct-hidden' : ''}>
                      <b>{r.name}</b> · {'★'.repeat(r.stars)} — {r.text.slice(0, 140)}{r.text.length > 140 ? '…' : ''}
                      {hidden && <em> (hidden by star filter)</em>}
                    </li>
                  );
                })}
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
