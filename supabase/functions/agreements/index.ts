// Rental Management Agreement API (Supabase Edge Function).
//
// Actions (POST JSON { action, ... } unless noted):
//   create        { adminKey, clientName, clientEmail, terms, addendum, siteOrigin } -> { token, url, emailed }
//   list          { adminKey } -> { agreements: [...] }
//   get           { token } -> public view of one agreement
//   sign          { token, owner, acks, sigName, sigDate, sigData } -> { signedAt, emailed }
//   get_settings  { adminKey } -> { notifyEmail, fromEmail, hasResendKey }
//   set_settings  { adminKey, resendApiKey?, notifyEmail?, fromEmail? } -> { ok }
//   pdf (GET ?action=pdf&t=TOKEN) -> application/pdf
//
// Auth is intentionally simple for v1: a single admin key (portal_settings row)
// guards owner actions; an unguessable per-agreement token guards client actions.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'npm:pdf-lib@1.17.1';
import { SECTIONS, ACKS, TERMS_META, PREAMBLE, BACKOUT_CALLOUT, FOOTER_LINE, richToPlain } from './content.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

async function getSettings() {
  const { data, error } = await db.from('portal_settings').select('*').eq('id', 1).single();
  if (error || !data) throw new Error('portal_settings row missing');
  return data;
}

async function requireAdmin(adminKey: string | undefined) {
  const settings = await getSettings();
  if (!adminKey || adminKey !== settings.admin_key) {
    throw Object.assign(new Error('Invalid admin key'), { status: 401 });
  }
  return settings;
}

function newToken(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------------
// Email (Resend)
// ---------------------------------------------------------------------------

interface Attachment {
  filename: string;
  content: string; // base64
}

async function sendEmail(
  settings: Record<string, string>,
  to: string[],
  subject: string,
  html: string,
  attachments: Attachment[] = [],
): Promise<boolean> {
  const key = settings.resend_api_key;
  if (!key) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: settings.from_email || 'Cardo Vacation Rentals <onboarding@resend.dev>',
      to,
      subject,
      html,
      attachments: attachments.length ? attachments : undefined,
    }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return false;
  }
  return true;
}

function escHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function emailShell(inner: string): string {
  return `<div style="background:#EDEAE2;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#0E1528;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;border:1px solid #e2dfd6;">
      ${inner}
      <p style="margin:28px 0 0;font-size:12px;color:#9A9CA6;">${FOOTER_LINE}</p>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// PDF generation
// ---------------------------------------------------------------------------

const INK = rgb(0.055, 0.082, 0.157); // #0E1528
const BODY = rgb(0.24, 0.244, 0.278); // #3D3E47
const MUTED = rgb(0.42, 0.427, 0.47);
const PINK = rgb(0.93, 0.235, 0.47); // #ED3C78
const GREEN = rgb(0.184, 0.43, 0.333); // #2F6E55

// Replace characters Helvetica/WinAnsi can't encode.
function sanitize(text: string): string {
  return text
    .replace(/−/g, '-')
    .replace(/ /g, ' ');
}

class PdfWriter {
  doc!: PDFDocument;
  page!: PDFPage;
  font!: PDFFont;
  bold!: PDFFont;
  y = 0;
  readonly margin = 54;
  readonly width = 612;
  readonly height = 792;

  static async create(): Promise<PdfWriter> {
    const w = new PdfWriter();
    w.doc = await PDFDocument.create();
    w.font = await w.doc.embedFont(StandardFonts.Helvetica);
    w.bold = await w.doc.embedFont(StandardFonts.HelveticaBold);
    w.addPage();
    return w;
  }

  addPage() {
    this.page = this.doc.addPage([this.width, this.height]);
    this.y = this.height - this.margin;
  }

  ensure(space: number) {
    if (this.y - space < this.margin) this.addPage();
  }

  wrapLines(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
    const words = sanitize(text).split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? line + ' ' + word : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
      } else {
        if (line) lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  text(
    text: string,
    opts: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; indent?: number; lineGap?: number; after?: number } = {},
  ) {
    const size = opts.size ?? 10;
    const font = opts.font ?? this.font;
    const color = opts.color ?? BODY;
    const indent = opts.indent ?? 0;
    const lineHeight = size * (opts.lineGap ?? 1.45);
    const maxWidth = this.width - this.margin * 2 - indent;
    for (const line of this.wrapLines(text, font, size, maxWidth)) {
      this.ensure(lineHeight);
      this.y -= lineHeight;
      this.page.drawText(line, { x: this.margin + indent, y: this.y, size, font, color });
    }
    this.y -= opts.after ?? 0;
  }

  bullet(text: string, opts: { size?: number } = {}) {
    const size = opts.size ?? 10;
    const lineHeight = size * 1.45;
    this.ensure(lineHeight);
    const startY = this.y;
    this.text(text, { size, indent: 14, after: 3 });
    this.page.drawText('•', { x: this.margin + 2, y: startY - lineHeight, size, font: this.font, color: BODY });
  }

  rule(after = 14) {
    this.ensure(after + 4);
    this.y -= 8;
    this.page.drawLine({
      start: { x: this.margin, y: this.y },
      end: { x: this.width - this.margin, y: this.y },
      thickness: 0.7,
      color: rgb(0.85, 0.84, 0.81),
    });
    this.y -= after - 8;
  }

  space(amount: number) {
    this.y -= amount;
  }
}

interface AgreementRow {
  token: string;
  status: string;
  client_name: string | null;
  client_email: string;
  terms: Record<string, string>;
  addendum: string | null;
  owner: Record<string, string> | null;
  acks: Record<string, boolean> | null;
  sig_name: string | null;
  sig_date: string | null;
  sig_data: string | null;
  signed_at: string | null;
  created_at: string;
}

async function buildPdf(row: AgreementRow): Promise<Uint8Array> {
  const w = await PdfWriter.create();
  const terms = row.terms || {};
  const owner = row.owner || {};
  const acks = row.acks || {};

  w.text('RENTAL PROPERTY MANAGEMENT AGREEMENT', { size: 9, font: w.bold, color: PINK, after: 6 });
  w.text('Rental Management Agreement', { size: 22, font: w.bold, color: INK, after: 4 });
  w.text('Scherf Property Management, LLC · doing business as Cardo Vacation Rentals · one agreement per property', {
    size: 9,
    color: MUTED,
    after: 10,
  });
  w.text(PREAMBLE, { size: 9.5, after: 4 });
  w.rule();

  // Key commercial terms
  w.text('KEY COMMERCIAL TERMS', { size: 10, font: w.bold, color: INK, after: 6 });
  const fmt = (m: (typeof TERMS_META)[number]) =>
    `${m.prefix ?? ''}${terms[m.key] ?? m.default}${m.suffix ? (m.suffix === '%' ? '%' : ' ' + m.suffix) : ''}`;
  for (const m of TERMS_META) {
    w.text(`${m.label}:  ${fmt(m)}   (${richToPlain(m.sub)})`, { size: 9.5, after: 2 });
  }
  const total = (parseFloat(terms.startupFee || '0') || 0) + (parseFloat(terms.lockSyncFee || '0') || 0);
  w.text(`Total due at signing: $0 — the $${total.toLocaleString('en-US')} in startup and lock-sync fees roll into the first monthly payout.`, {
    size: 9.5,
    font: w.bold,
    color: GREEN,
    after: 4,
  });
  w.rule();

  // Owner & property details
  w.text('OWNER & PROPERTY DETAILS', { size: 10, font: w.bold, color: INK, after: 6 });
  const ownerLines: [string, string][] = [
    ['Full Name ("Owner")', owner.fullName || ''],
    ['Address of Managed Property ("Home")', owner.homeAddress || ''],
    ['Personal Mailing Address', owner.mailingAddress || ''],
    ['Phone Number', owner.phone || ''],
    ['Email Address', owner.email || row.client_email],
  ];
  for (const [label, value] of ownerLines) {
    w.text(`${label}:  ${value}`, { size: 9.5, after: 2 });
  }
  w.rule();

  // Risk-free commitment callout
  w.text(BACKOUT_CALLOUT.kicker.toUpperCase() + ' — ' + BACKOUT_CALLOUT.title, { size: 10, font: w.bold, color: INK, after: 4 });
  w.text(BACKOUT_CALLOUT.body, { size: 9.5, after: 4 });
  w.rule();

  // Acknowledgments
  w.text('BY SIGNING, I ACKNOWLEDGE', { size: 10, font: w.bold, color: INK, after: 6 });
  for (const ack of ACKS) {
    const checked = acks[ack.key] ? '[X]' : '[  ]';
    w.text(`${checked}  ${richToPlain(ack.text)}`, { size: 9.5, after: 3 });
  }
  w.rule();

  // Addendum
  w.text('ADDENDUM', { size: 10, font: w.bold, color: INK, after: 5 });
  w.text(row.addendum?.trim() ? row.addendum : 'None.', { size: 9.5, after: 4 });
  w.rule();

  // Signature
  w.text('OWNER SIGNATURE', { size: 10, font: w.bold, color: INK, after: 6 });
  if (row.sig_data?.startsWith('data:image/png;base64,')) {
    try {
      const png = await w.doc.embedPng(row.sig_data);
      const sigW = 180;
      const sigH = (png.height / png.width) * sigW;
      w.ensure(sigH + 8);
      w.y -= sigH;
      w.page.drawImage(png, { x: w.margin, y: w.y, width: sigW, height: sigH });
      w.space(6);
    } catch (e) {
      console.error('signature embed failed', e);
    }
  }
  w.text(`Signed by: ${row.sig_name || ''}`, { size: 9.5, color: INK, after: 2 });
  w.text(`Date: ${row.sig_date || ''}${row.signed_at ? `   ·   Executed electronically ${new Date(row.signed_at).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT` : ''}`, {
    size: 9.5,
    color: INK,
    after: 2,
  });
  w.text('Electronic signatures are as valid as originals. The Owner may cancel within 14 days of signing with no termination fee — see Section 15.', {
    size: 8.5,
    color: MUTED,
    after: 4,
  });
  w.rule();

  // Full agreement
  w.text('FULL AGREEMENT', { size: 12, font: w.bold, color: INK, after: 4 });
  w.text('The following numbered terms govern the relationship between Cardo and the Owner.', { size: 9, color: MUTED, after: 8 });
  for (const section of SECTIONS) {
    w.ensure(40);
    w.text(`${section.n}.  ${section.title}`, { size: 10.5, font: w.bold, color: INK, after: 3 });
    for (const block of section.blocks) {
      if (block.p) w.text(richToPlain(block.p), { size: 9.5, after: 4 });
      if (block.ul) {
        for (const item of block.ul) w.bullet(richToPlain(item), { size: 9.5 });
        w.space(4);
      }
    }
    w.space(6);
  }
  w.rule();
  w.text(FOOTER_LINE, { size: 8, color: MUTED });

  return await w.doc.save();
}

function b64(bytes: Uint8Array): string {
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

async function getRow(token: string): Promise<AgreementRow> {
  if (!token || token.length < 20) throw Object.assign(new Error('Invalid link'), { status: 404 });
  const { data, error } = await db.from('rental_agreements').select('*').eq('token', token).single();
  if (error || !data) throw Object.assign(new Error('Agreement not found'), { status: 404 });
  return data as AgreementRow;
}

async function actionCreate(body: Record<string, unknown>) {
  const settings = await requireAdmin(body.adminKey as string);
  const clientEmail = String(body.clientEmail || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clientEmail)) {
    throw Object.assign(new Error('A valid client email is required'), { status: 400 });
  }
  const terms: Record<string, string> = {};
  for (const m of TERMS_META) {
    const raw = String((body.terms as Record<string, unknown>)?.[m.key] ?? m.default).trim();
    terms[m.key] = raw === '' ? m.default : raw;
  }
  const token = newToken();
  const { error } = await db.from('rental_agreements').insert({
    token,
    status: 'sent',
    client_name: String(body.clientName || '').trim() || null,
    client_email: clientEmail,
    terms,
    addendum: String(body.addendum || ''),
  });
  if (error) throw new Error(error.message);

  const origin = String(body.siteOrigin || '').replace(/\/$/, '');
  const url = `${origin}/agreement/?t=${token}`;
  const firstName = escHtml(String(body.clientName || '').trim().split(/\s+/)[0] || 'there');
  const emailed = await sendEmail(
    settings,
    [clientEmail],
    'Your Cardo Vacation Rentals management agreement is ready to sign',
    emailShell(`
      <h2 style="margin:0 0 14px;font-size:20px;">Hi ${firstName},</h2>
      <p style="font-size:14px;line-height:1.6;color:#3D3E47;">Your Rental Management Agreement with Cardo Vacation Rentals is ready. The key commercial terms have been filled in for you — review the agreement, complete your details, and sign online. It takes about five minutes.</p>
      <p style="margin:24px 0;"><a href="${url}" style="background:#ED3C78;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:14px 26px;border-radius:999px;display:inline-block;">Review &amp; Sign Agreement</a></p>
      <p style="font-size:13px;line-height:1.6;color:#6B6D78;">Once signed, a PDF copy is emailed to you automatically. You can cancel for any reason within 14 days of signing with no termination fee.</p>
      <p style="font-size:12px;color:#9A9CA6;">If the button doesn't work, copy this link: ${url}</p>
    `),
  );
  return json({ token, url, emailed });
}

async function actionList(body: Record<string, unknown>) {
  await requireAdmin(body.adminKey as string);
  const { data, error } = await db
    .from('rental_agreements')
    .select('token, status, client_name, client_email, terms, created_at, signed_at, sig_name')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return json({ agreements: data });
}

async function actionGet(body: Record<string, unknown>) {
  const row = await getRow(String(body.token || ''));
  return json({
    status: row.status,
    clientName: row.client_name,
    clientEmail: row.client_email,
    terms: row.terms,
    addendum: row.addendum,
    owner: row.status === 'signed' ? row.owner : null,
    acks: row.status === 'signed' ? row.acks : null,
    sigName: row.sig_name,
    sigDate: row.sig_date,
    sigData: row.status === 'signed' ? row.sig_data : null,
    signedAt: row.signed_at,
  });
}

async function actionSign(body: Record<string, unknown>) {
  const row = await getRow(String(body.token || ''));
  if (row.status === 'signed') {
    throw Object.assign(new Error('This agreement has already been signed.'), { status: 409 });
  }
  const owner = (body.owner || {}) as Record<string, string>;
  const acks = (body.acks || {}) as Record<string, boolean>;
  const sigName = String(body.sigName || '').trim();
  const sigDate = String(body.sigDate || '').trim();
  const sigData = String(body.sigData || '');

  const missing: string[] = [];
  if (!owner.fullName?.trim()) missing.push('full legal name');
  if (!owner.homeAddress?.trim()) missing.push('managed property address');
  if (!owner.email?.trim()) missing.push('email address');
  if (!sigName) missing.push('typed signature');
  if (!sigData.startsWith('data:image/png;base64,')) missing.push('drawn signature');
  for (const ack of ACKS) {
    if (ack.required && !acks[ack.key]) missing.push('all acknowledgements');
  }
  if (missing.length) {
    throw Object.assign(new Error('Please complete: ' + [...new Set(missing)].join(', ') + '.'), { status: 400 });
  }

  const signedAt = new Date().toISOString();
  const { error } = await db
    .from('rental_agreements')
    .update({ status: 'signed', owner, acks, sig_name: sigName, sig_date: sigDate, sig_data: sigData, signed_at: signedAt })
    .eq('token', row.token);
  if (error) throw new Error(error.message);

  const updated = { ...row, status: 'signed', owner, acks, sig_name: sigName, sig_date: sigDate, sig_data: sigData, signed_at: signedAt };
  let emailed = false;
  try {
    const settings = await getSettings();
    const pdf = await buildPdf(updated as AgreementRow);
    const attachment = { filename: 'Cardo-Rental-Management-Agreement.pdf', content: b64(pdf) };
    const recipients = [...new Set([owner.email.trim(), row.client_email, settings.notify_email].filter(Boolean))];
    emailed = await sendEmail(
      settings,
      recipients,
      `Signed: Rental Management Agreement — ${owner.homeAddress}`,
      emailShell(`
        <h2 style="margin:0 0 14px;font-size:20px;">Agreement signed ✓</h2>
        <p style="font-size:14px;line-height:1.6;color:#3D3E47;">${escHtml(sigName)} executed the Rental Management Agreement for <strong>${escHtml(owner.homeAddress)}</strong> on ${new Date(signedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Los_Angeles' })}.</p>
        <p style="font-size:14px;line-height:1.6;color:#3D3E47;">A PDF copy of the fully executed agreement is attached for your records.</p>
      `),
      [attachment],
    );
  } catch (e) {
    console.error('post-sign email failed', e);
  }
  return json({ signedAt, emailed });
}

async function actionGetSettings(body: Record<string, unknown>) {
  const settings = await requireAdmin(body.adminKey as string);
  return json({
    notifyEmail: settings.notify_email,
    fromEmail: settings.from_email,
    hasResendKey: !!settings.resend_api_key,
  });
}

async function actionSetSettings(body: Record<string, unknown>) {
  await requireAdmin(body.adminKey as string);
  const patch: Record<string, string> = {};
  if (typeof body.resendApiKey === 'string' && body.resendApiKey.trim()) patch.resend_api_key = body.resendApiKey.trim();
  if (typeof body.notifyEmail === 'string' && body.notifyEmail.trim()) patch.notify_email = body.notifyEmail.trim();
  if (typeof body.fromEmail === 'string' && body.fromEmail.trim()) patch.from_email = body.fromEmail.trim();
  if (Object.keys(patch).length) {
    const { error } = await db.from('portal_settings').update(patch).eq('id', 1);
    if (error) throw new Error(error.message);
  }
  return json({ ok: true });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const url = new URL(req.url);
    if (req.method === 'GET' && url.searchParams.get('action') === 'pdf') {
      const row = await getRow(url.searchParams.get('t') || '');
      const pdf = await buildPdf(row);
      return new Response(new Uint8Array(pdf), {
        headers: {
          ...CORS,
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="Cardo-Rental-Management-Agreement.pdf"',
        },
      });
    }
    const body = await req.json().catch(() => ({}));
    switch (body.action) {
      case 'create': return await actionCreate(body);
      case 'list': return await actionList(body);
      case 'get': return await actionGet(body);
      case 'sign': return await actionSign(body);
      case 'get_settings': return await actionGetSettings(body);
      case 'set_settings': return await actionSetSettings(body);
      default: return json({ error: 'Unknown action' }, 400);
    }
  } catch (e) {
    const status = (e as { status?: number }).status ?? 500;
    if (status === 500) console.error(e);
    return json({ error: (e as Error).message || 'Server error' }, status);
  }
});
