// Lead capture API (Supabase Edge Function).
//
// POST JSON { name, email, phone?, neighborhood?, address?, bedrooms?, notes?,
//             source?, page?, company? } -> { ok: true }
//
// Public endpoint for the marketing site's "free property analysis" forms.
// No auth: validated + honeypot-protected here. Writes via the service role
// (RLS denies all direct anon/authenticated access to public.leads).
// On success, emails a notification to the sales inbox via Resend, reusing
// the resend_api_key / from_email already stored in portal_settings.

import { createClient } from 'npm:@supabase/supabase-js@2';

// Where new-lead notifications go for now (GHL hand-off to follow).
const LEAD_NOTIFY_EMAIL = 'sales@cardorentals.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const db = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function escHtml(s: string): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

const isEmail = (s: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);

async function getSettings() {
  const { data } = await db.from('portal_settings').select('resend_api_key, from_email').eq('id', 1).single();
  return data ?? {};
}

async function notify(lead: Record<string, string>) {
  const settings = await getSettings();
  const key = (settings as Record<string, string>).resend_api_key;
  if (!key) return false; // No Resend key configured yet — lead is still saved.

  const rows = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Neighborhood', lead.neighborhood],
    ['Property address', lead.address],
    ['Bedrooms', lead.bedrooms],
    ['Notes', lead.notes],
    ['Source', `${lead.source || 'website'}${lead.page ? ' · ' + lead.page : ''}`],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#6B6D78;font-size:13px;white-space:nowrap;vertical-align:top;">${k}</td><td style="padding:6px 0;color:#0E1528;font-size:14px;">${escHtml(v)}</td></tr>`,
    )
    .join('');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: (settings as Record<string, string>).from_email || 'Cardo Vacation Rentals <onboarding@resend.dev>',
      to: [LEAD_NOTIFY_EMAIL],
      reply_to: isEmail(lead.email) ? lead.email : undefined,
      subject: `New estimate request — ${lead.name}${lead.neighborhood ? ' · ' + lead.neighborhood : ''}`,
      html: `<div style="background:#EDEAE2;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;border:1px solid #e2dfd6;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#ED3C78;font-weight:bold;">New website lead</p>
          <h2 style="margin:0 0 18px;font-size:20px;color:#0E1528;">Free property analysis request</h2>
          <table style="border-collapse:collapse;width:100%;">${rows}</table>
        </div>
      </div>`,
    }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return false;
  }
  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body = await req.json().catch(() => ({}));

    // Honeypot: real users never fill "company". Silently accept to fool bots.
    if (typeof body.company === 'string' && body.company.trim()) return json({ ok: true });

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    if (!name) return json({ error: 'Name is required' }, 400);
    if (!isEmail(email)) return json({ error: 'A valid email is required' }, 400);

    const lead = {
      name,
      email,
      phone: String(body.phone || '').trim() || null,
      neighborhood: String(body.neighborhood || '').trim() || null,
      address: String(body.address || '').trim() || null,
      bedrooms: String(body.bedrooms || '').trim() || null,
      notes: String(body.notes || '').trim() || null,
      source: String(body.source || 'website').trim().slice(0, 80) || null,
      page: String(body.page || '').trim().slice(0, 200) || null,
    };

    const { error } = await db.from('leads').insert(lead);
    if (error) throw new Error(error.message);

    let emailed = false;
    try {
      emailed = await notify(lead as Record<string, string>);
    } catch (e) {
      console.error('lead notify failed', e);
    }

    return json({ ok: true, emailed });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message || 'Server error' }, 500);
  }
});
