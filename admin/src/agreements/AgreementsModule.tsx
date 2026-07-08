import { useEffect, useState, type FormEvent } from 'react';
import { TERMS_META } from '@shared/agreement-content';
import { createAgreement, listAgreements, getSettings, setSettings as saveSettingsApi } from './api';
import type { AgreementRow, Settings } from './types';
import './agreements.css';

// Deployed HTTP function that serves the signed PDF (separate from the callables above).
const AGREEMENTS_FN_BASE = 'https://us-central1-cardo-website-2026.cloudfunctions.net/agreements';

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AgreementsModule() {
  // ----- Create form -----
  const [terms, setTerms] = useState<Record<string, string>>(() =>
    Object.fromEntries(TERMS_META.map((m) => [m.key, m.default])),
  );
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [addendum, setAddendum] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendResult, setSendResult] = useState<{ url: string; emailed: boolean; clientEmail: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // ----- Recent agreements -----
  const [agreements, setAgreements] = useState<AgreementRow[]>([]);
  const [listError, setListError] = useState('');
  const [listLoading, setListLoading] = useState(true);

  // ----- Email settings -----
  const [settings, setSettingsState] = useState<Settings | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  async function refreshList() {
    setListLoading(true);
    setListError('');
    try {
      const rows = await listAgreements();
      setAgreements(rows);
    } catch (err) {
      setListError((err as Error).message);
    } finally {
      setListLoading(false);
    }
  }

  async function loadSettings() {
    try {
      const s = await getSettings();
      setSettingsState(s);
      setNotifyEmail(s.notifyEmail || '');
      setFromEmail(s.fromEmail || '');
    } catch (err) {
      setSettingsError((err as Error).message);
    }
  }

  useEffect(() => {
    refreshList();
    loadSettings();
  }, []);

  function handleTermChange(key: string, value: string) {
    setTerms((t) => ({ ...t, [key]: value }));
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    setSendError('');
    setSendResult(null);
    const trimmedEmail = clientEmail.trim();
    if (!trimmedEmail) {
      setSendError('Client email is required.');
      return;
    }
    setSending(true);
    try {
      const res = await createAgreement({
        clientName: clientName.trim(),
        clientEmail: trimmedEmail,
        terms,
        addendum,
        siteOrigin: window.location.origin,
      });
      setSendResult({ url: res.url, emailed: res.emailed, clientEmail: trimmedEmail });
      setClientName('');
      setClientEmail('');
      setAddendum('');
      await refreshList();
    } catch (err) {
      setSendError((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  async function handleCopy() {
    if (!sendResult) return;
    try {
      await navigator.clipboard.writeText(sendResult.url);
    } catch {
      // Clipboard API can fail (permissions, insecure context) — the link is still visible/selectable.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function handleSaveSettings(e: FormEvent) {
    e.preventDefault();
    setSettingsError('');
    setSettingsSaving(true);
    try {
      await saveSettingsApi({ notifyEmail: notifyEmail.trim(), fromEmail: fromEmail.trim() });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2400);
    } catch (err) {
      setSettingsError((err as Error).message);
    } finally {
      setSettingsSaving(false);
    }
  }

  return (
    <div className="agreements">
      {/* ----- Create & send ----- */}
      <section className="ag-card">
        <div className="ag-kicker">New Agreement</div>
        <h1>Send a Rental Management Agreement</h1>
        <p className="ag-hint">
          Set the commercial terms for this deal, then send. The client gets an email with a private
          signing link — no account needed. When they sign, the executed PDF is emailed to both of you.
        </p>

        <form onSubmit={handleSend}>
          <div className="ag-grid-2 ag-form-grid">
            <div>
              <div className="ag-ms-label">Key Commercial Terms</div>
              {TERMS_META.map((m) => (
                <div className="ag-term-row" key={m.key}>
                  <div className="ag-term-copy">
                    <div className="ag-term-name">{m.label}</div>
                    <div className="ag-term-sub">{m.sub}</div>
                  </div>
                  <div className="ag-unit-wrap">
                    {m.prefix && <span className="ag-unit-in ag-unit-left">{m.prefix}</span>}
                    <input
                      inputMode="decimal"
                      className={`ag-input ag-term-input${m.prefix ? ' ag-pl' : ''}${m.suffix ? ' ag-pr' : ''}`}
                      value={terms[m.key]}
                      onChange={(ev) => handleTermChange(m.key, ev.target.value)}
                    />
                    {m.suffix && <span className="ag-unit-in ag-unit-right">{m.suffix}</span>}
                  </div>
                </div>
              ))}
              <p className="ag-hint ag-hint-tight">
                Engagement fees show as &ldquo;$0 due at signing&rdquo; on the contract — they roll into
                the first payout.
              </p>
            </div>

            <div>
              <div className="ag-ms-label">Client</div>
              <div className="ag-field-stack">
                <label className="ag-field">
                  <span className="ag-field-label">Client Full Name</span>
                  <input
                    className="ag-input"
                    placeholder="Jane A. Owner"
                    value={clientName}
                    onChange={(ev) => setClientName(ev.target.value)}
                  />
                </label>
                <label className="ag-field">
                  <span className="ag-field-label">Client Email</span>
                  <input
                    className="ag-input"
                    inputMode="email"
                    placeholder="jane@email.com"
                    value={clientEmail}
                    onChange={(ev) => setClientEmail(ev.target.value)}
                  />
                </label>
                <label className="ag-field">
                  <span className="ag-field-label">Addendum (optional — shown on the contract)</span>
                  <textarea
                    rows={4}
                    className="ag-input ag-textarea"
                    placeholder="Optional additional terms agreed between Owner and Cardo…"
                    value={addendum}
                    onChange={(ev) => setAddendum(ev.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>

          {sendError && <div className="ag-error-box">{sendError}</div>}
          <button className="ag-submit-btn" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Create & Send Signing Link'}
          </button>
        </form>

        {sendResult && (
          <div className="ag-result-box">
            <div className="ag-ms-label ag-result-label">Link created</div>
            <p className="ag-hint ag-hint-tight">
              {sendResult.emailed
                ? `Signing link emailed to ${sendResult.clientEmail}. You can also share it directly:`
                : `Email isn't configured yet, so send this link to ${sendResult.clientEmail} yourself:`}
            </p>
            <div className="ag-link-row">
              <input className="ag-input ag-link-input" readOnly value={sendResult.url} />
              <button className="ag-ghost-btn" type="button" onClick={handleCopy}>
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ----- Recent agreements ----- */}
      <section className="ag-card">
        <div className="ag-list-header">
          <div className="ag-ms-label">Recent Agreements</div>
          <button className="ag-text-btn" type="button" onClick={() => refreshList()}>
            Refresh
          </button>
        </div>
        {listError && <div className="ag-error-box">{listError}</div>}
        <div className="ag-table-wrap">
          {!listLoading && !listError && agreements.length === 0 && (
            <p className="ag-hint">No agreements yet.</p>
          )}
          {agreements.length > 0 && (
            <table className="ag-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Commission</th>
                  <th>Created</th>
                  <th>Signed</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {agreements.map((a) => {
                  const link = `${window.location.origin}/agreement/?t=${a.token}`;
                  const pdf = `${AGREEMENTS_FN_BASE}?action=pdf&t=${a.token}`;
                  return (
                    <tr key={a.token}>
                      <td>
                        <strong>{a.clientName || a.sigName || '—'}</strong>
                        <br />
                        <span className="ag-hint ag-hint-inline">{a.clientEmail}</span>
                      </td>
                      <td>
                        <span className={`ag-status ag-status-${a.status}`}>{a.status}</span>
                      </td>
                      <td>{a.terms?.commissionPct ?? '—'}%</td>
                      <td>{fmtDate(a.createdAt)}</td>
                      <td>{fmtDate(a.signedAt)}</td>
                      <td className="ag-row-actions">
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          Open
                        </a>
                        {a.status === 'signed' && (
                          <>
                            {' · '}
                            <a href={pdf} target="_blank" rel="noopener noreferrer">
                              PDF
                            </a>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ----- Email settings ----- */}
      <section className="ag-card">
        <details>
          <summary className="ag-ms-label ag-summary">Email Settings</summary>
          <p className="ag-hint ag-hint-tight">
            Emails are sent through{' '}
            <a href="https://resend.com" target="_blank" rel="noopener noreferrer">
              Resend
            </a>
            . The API key lives in Secret Manager now — set it there if it isn&rsquo;t on file yet.
            Until a key is on file, links are still created — just copy and send them yourself.
          </p>
          <form onSubmit={handleSaveSettings}>
            <div className="ag-grid-2 ag-settings-grid">
              <div className="ag-field">
                <span className="ag-field-label">Resend API Key</span>
                <span className={`ag-key-status ${settings?.hasResendKey ? 'ag-key-on' : 'ag-key-off'}`}>
                  {settings ? (settings.hasResendKey ? 'Key on file' : 'Not set — emails disabled') : 'Loading…'}
                </span>
              </div>
              <label className="ag-field">
                <span className="ag-field-label">From Address</span>
                <input
                  className="ag-input"
                  placeholder="Cardo Vacation Rentals <owners@cardorentals.com>"
                  value={fromEmail}
                  onChange={(ev) => setFromEmail(ev.target.value)}
                />
              </label>
              <label className="ag-field">
                <span className="ag-field-label">Notify Email (gets the signed PDF)</span>
                <input
                  className="ag-input"
                  placeholder="rich@cardorentals.com"
                  value={notifyEmail}
                  onChange={(ev) => setNotifyEmail(ev.target.value)}
                />
              </label>
            </div>
            {settingsError && <div className="ag-error-box">{settingsError}</div>}
            <div className="ag-settings-actions">
              <button className="ag-ghost-btn" type="submit" disabled={settingsSaving}>
                {settingsSaving ? 'Saving…' : 'Save Settings'}
              </button>
              {settingsSaved && <span className="ag-hint ag-saved">Saved ✓</span>}
            </div>
          </form>
        </details>
      </section>
    </div>
  );
}
