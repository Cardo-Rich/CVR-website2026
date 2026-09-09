// Shared handler for the referral / vendor / cost-seg lead forms. POSTs the
// lead to /api/lead so the site records it in HighLevel and emails the right
// inbox server-side. If that endpoint is unavailable (e.g. offline, or before
// functions deploy), it falls back to opening the visitor's email client.
export function wireLeadForm(opts) {
  const form = typeof opts.form === 'string' ? document.querySelector(opts.form) : opts.form;
  if (!form) return;
  const status = opts.status ? form.querySelector(opts.status) : null;
  const btn = form.querySelector('button[type="submit"]');
  const btnLabel = btn ? btn.textContent : '';
  const val = (n) => { const el = form.querySelector('[name="' + n + '"]'); return el ? String(el.value || '').trim() : ''; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const fields = {};
    form.querySelectorAll('input, textarea, select').forEach((el) => {
      if (el.name && String(el.value || '').trim()) fields[el.name] = String(el.value).trim();
    });
    const payload = {
      type: opts.type,
      name: val(opts.nameField),
      email: val(opts.emailField),
      phone: val(opts.phoneField),
      fields,
    };

    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = res.ok ? await res.json() : null;
      if (!data || !data.ok) throw new Error('bad response');
      form.reset();
      // Conversion signal for GTM (GA4 generate_lead + Meta Lead fire on this).
      try { (window.dataLayer = window.dataLayer || []).push({ event: 'lead_submit', leadForm: opts.type || 'lead' }); } catch (e2) {}
      if (status) {
        status.textContent = opts.successText || 'Thanks! We’ve got your details and will be in touch shortly.';
        status.classList.add('is-sent');
      }
      if (btn) { btn.textContent = 'Sent ✓'; }
    } catch (err) {
      // Fallback: open the visitor's mail client with the details pre-filled.
      const lines = Object.keys(fields).map((k) => k + ': ' + fields[k]);
      const subject = (opts.subject || 'Website lead') + (payload.name ? ' — ' + payload.name : '');
      const body = 'Submitted from cardorentals.com\n\n' + lines.join('\n');
      window.location.href = 'mailto:' + opts.fallbackTo + '?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      if (status) { status.textContent = 'Opening your email app to send us the details…'; }
      if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
    }
  });
}
