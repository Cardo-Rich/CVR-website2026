// Website lead intake: realtor referral, vendor application, and cost-segregation
// inquiry forms all POST here. Each lead is (best-effort) pushed into the
// HighLevel CRM as a tagged contact + note — and, for cost-seg, an opportunity in
// a named pipeline — and a notification email is sent so nothing gets forgotten.
import type { GhlConfig } from './ghl.js';
import { upsertContact, addNote, findPipeline, createOpportunity } from './ghl.js';
import { emailShell, escHtml } from './email.js';

export type LeadType = 'referral' | 'vendor' | 'costseg';

interface LeadMeta {
  label: string;      // human label for subject/email
  source: string;     // GHL contact source
  tags: string[];     // GHL contact tags
  notify: string;     // internal recipient for the notification email
  pipeline?: string;  // if set, create an opportunity in this (by-name) pipeline
}

// Recipients are fixed server-side so the public endpoint can't be used to email
// arbitrary addresses.
const LEADS: Record<LeadType, LeadMeta> = {
  referral: { label: 'Realtor referral', source: 'Realtor Referral Program', tags: ['Website Lead', 'Realtor Referral'], notify: 'sales@cardorentals.com' },
  vendor:   { label: 'Vendor application', source: 'Vendor Application', tags: ['Website Lead', 'Vendor'], notify: 'owners@cardorentals.com' },
  costseg:  { label: 'Cost segregation inquiry', source: 'Cost Segregation', tags: ['Website Lead', 'Cost Segregation'], notify: 'sales@cardorentals.com', pipeline: 'Cost Segregation' },
};

export interface LeadInput {
  type?: string;
  name?: string; email?: string; phone?: string;
  fields?: Record<string, string>;
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return { firstName: parts.shift() || '', lastName: parts.join(' ') };
}

function fieldsHtml(fields: Record<string, string>): string {
  const rows = Object.entries(fields)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `<tr><td style="padding:5px 14px 5px 0;color:#6B6D78;vertical-align:top;white-space:nowrap;">${escHtml(k)}</td><td style="padding:5px 0;color:#0E1528;">${escHtml(String(v))}</td></tr>`)
    .join('');
  return `<table style="border-collapse:collapse;font-size:14px;line-height:1.5;">${rows}</table>`;
}

type SendEmail = (to: string[], subject: string, html: string) => Promise<boolean>;

export async function handleLead(cfg: GhlConfig, sendEmail: SendEmail, input: LeadInput): Promise<{ ok: boolean; emailed: boolean; crm: boolean }> {
  const meta = LEADS[(input.type || '') as LeadType];
  if (!meta) throw new Error('Unknown lead type');

  const fields = input.fields || {};
  const name = (input.name || '').trim();
  const email = (input.email || '').trim();
  const phone = (input.phone || '').trim();
  if (!name && !email && !phone) throw new Error('A name, email, or phone is required');
  const { firstName, lastName } = splitName(name);

  const noteText = `${meta.label} — submitted via cardorentals.com\n\n` +
    Object.entries(fields).filter(([, v]) => v && String(v).trim()).map(([k, v]) => `${k}: ${v}`).join('\n');

  // CRM push — best-effort; a CRM failure must never block the notification email.
  let crm = false;
  if (cfg.token() && cfg.locationId()) {
    try {
      const contactId = await upsertContact(cfg, { firstName, lastName, email, phone, source: meta.source, tags: meta.tags });
      await addNote(cfg, contactId, noteText).catch((e) => console.error('lead note failed', e));
      if (meta.pipeline) {
        const pipe = await findPipeline(cfg, meta.pipeline).catch((e) => { console.error('pipeline lookup failed', e); return null; });
        if (pipe) {
          await createOpportunity(cfg, { ...pipe, contactId, name: name || email || meta.label }).catch((e) => console.error('opportunity failed', e));
        } else {
          console.warn(`Pipeline "${meta.pipeline}" not found in HighLevel — opportunity skipped.`);
        }
      }
      crm = true;
    } catch (e) {
      console.error('lead CRM failed', e);
    }
  }

  // Notification email (Resend) — the safety net so no lead is forgotten.
  let emailed = false;
  try {
    const html = emailShell(
      `<h2 style="margin:0 0 4px;font-size:18px;">New ${escHtml(meta.label.toLowerCase())}</h2>
       <p style="font-size:13px;color:#6B6D78;margin:0 0 18px;">Submitted from cardorentals.com${crm ? ' · added to HighLevel' : ''}</p>
       ${fieldsHtml(fields)}`,
    );
    emailed = await sendEmail([meta.notify], `New ${meta.label.toLowerCase()}${name ? ' — ' + name : ''}`, html);
  } catch (e) {
    console.error('lead email failed', e);
  }

  return { ok: true, emailed, crm };
}
