// GoHighLevel (LeadConnector) booking proxy — real timeslots from a
// round-robin calendar, plus contact upsert + appointment creation so leads
// land in the HighLevel CRM. All calls use a Private Integration token.
const BASE = 'https://services.leadconnectorhq.com';

export interface GhlConfig {
  token: () => string;
  calendarId: () => string;
  locationId: () => string;
  timezone: () => string;
}

export interface Slot { iso: string; label: string; }
export interface Day { date: string; label: string; slots: Slot[]; }

function headers(cfg: GhlConfig, version: string): Record<string, string> {
  return {
    Authorization: `Bearer ${cfg.token()}`,
    Version: version,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

function timeLabel(iso: string, tz: string): string {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(new Date(iso));
}
function dayLabel(dateKey: string, tz: string): string {
  // 'YYYY-MM-DD' → 'Mon, Jul 14'
  const d = new Date(dateKey + 'T12:00:00');
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: tz }).format(d);
}

// GET real free slots for the configured calendar, grouped by day.
export async function getSlots(cfg: GhlConfig, days: number): Promise<Day[]> {
  const tz = cfg.timezone();
  const start = Date.now();
  const end = start + days * 24 * 60 * 60 * 1000;
  const url = `${BASE}/calendars/${cfg.calendarId()}/free-slots?startDate=${start}&endDate=${end}&timezone=${encodeURIComponent(tz)}`;
  const r = await fetch(url, { headers: headers(cfg, '2021-04-15') });
  if (!r.ok) throw new Error(`GHL free-slots ${r.status}: ${await r.text()}`);
  const data = (await r.json()) as Record<string, unknown>;
  const out: Day[] = [];
  for (const key of Object.keys(data)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue; // skip traceId etc.
    const val = data[key] as { slots?: string[] };
    if (!val || !Array.isArray(val.slots) || !val.slots.length) continue;
    out.push({ date: key, label: dayLabel(key, tz), slots: val.slots.map((iso) => ({ iso, label: timeLabel(iso, tz) })) });
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

export interface BookInput {
  firstName?: string; lastName?: string; email?: string; phone?: string;
  startIso?: string; guests?: string; earlyContact?: boolean;
  hearAbout?: string;
}

// The public endpoint can't be trusted to tag contacts with arbitrary strings,
// so attribution answers are allowlisted against the form's own options. Must
// stay in sync with the "How did you hear about us?" select in OwnerHero.astro.
const HEAR_ABOUT_OPTIONS = new Set([
  'Google search',
  'AI assistant (ChatGPT, Perplexity, etc.)',
  'Airbnb or Vrbo',
  'Referral from a friend or owner',
  'My realtor',
  'Social media',
  'Stayed in a Cardo home',
  'Other',
]);

// Upsert the contact (idempotent by email/phone) and, if a slot was chosen,
// create the appointment. On a round-robin calendar GHL assigns the owner.
export async function book(cfg: GhlConfig, input: BookInput): Promise<{ contactId: string; appointmentId?: string }> {
  const tz = cfg.timezone();
  const hearAbout = HEAR_ABOUT_OPTIONS.has((input.hearAbout || '').trim()) ? (input.hearAbout || '').trim() : '';
  const contactBody: Record<string, unknown> = {
    locationId: cfg.locationId(),
    firstName: input.firstName || '',
    lastName: input.lastName || '',
    email: input.email || '',
    phone: input.phone || '',
    source: 'Owners landing page',
  };
  if (hearAbout) contactBody.tags = [`Heard: ${hearAbout}`];
  const cRes = await fetch(`${BASE}/contacts/upsert`, { method: 'POST', headers: headers(cfg, '2021-07-28'), body: JSON.stringify(contactBody) });
  if (!cRes.ok) throw new Error(`GHL contact upsert ${cRes.status}: ${await cRes.text()}`);
  const cJson = (await cRes.json()) as { contact?: { id?: string }; id?: string };
  const contactId = cJson.contact?.id || cJson.id;
  if (!contactId) throw new Error('GHL upsert returned no contact id');

  let appointmentId: string | undefined;
  if (input.startIso) {
    const start = new Date(input.startIso);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const extras = [
      input.guests ? `Additional guests: ${input.guests}` : '',
      input.earlyContact ? 'Wants earlier contact if a slot opens up.' : '',
      hearAbout ? `Heard about us via: ${hearAbout}` : '',
    ].filter(Boolean).join('\n');
    const apptBody: Record<string, unknown> = {
      calendarId: cfg.calendarId(),
      locationId: cfg.locationId(),
      contactId,
      startTime: input.startIso,
      endTime: end.toISOString(),
      timezone: tz,
      title: `Cardo consultation — ${(input.firstName || '')} ${(input.lastName || '')}`.trim(),
      appointmentStatus: 'confirmed',
      ignoreDateRange: false,
    };
    if (extras) apptBody.meta = { notes: extras };
    const aRes = await fetch(`${BASE}/calendars/events/appointments`, { method: 'POST', headers: headers(cfg, '2021-04-15'), body: JSON.stringify(apptBody) });
    if (!aRes.ok) throw new Error(`GHL appointment ${aRes.status}: ${await aRes.text()}`);
    const aJson = (await aRes.json()) as { id?: string; appointment?: { id?: string } };
    appointmentId = aJson.id || aJson.appointment?.id;
  }
  return { contactId, appointmentId };
}

// Attach property details (collected on the final step) as a CRM note.
export async function addNote(cfg: GhlConfig, contactId: string, text: string): Promise<void> {
  if (!text.trim()) return;
  const r = await fetch(`${BASE}/contacts/${contactId}/notes`, { method: 'POST', headers: headers(cfg, '2021-07-28'), body: JSON.stringify({ body: text }) });
  if (!r.ok) throw new Error(`GHL note ${r.status}: ${await r.text()}`);
}

// ---- Generic lead helpers (referral / vendor / cost-seg website forms) ----

export interface LeadContactInput {
  firstName?: string; lastName?: string; email?: string; phone?: string;
  source?: string; tags?: string[];
}
// Upsert a contact (idempotent by email/phone) with a source + tags. No appointment.
export async function upsertContact(cfg: GhlConfig, input: LeadContactInput): Promise<string> {
  const body: Record<string, unknown> = {
    locationId: cfg.locationId(),
    firstName: input.firstName || '',
    lastName: input.lastName || '',
    email: input.email || '',
    phone: input.phone || '',
    source: input.source || 'Website',
  };
  if (input.tags && input.tags.length) body.tags = input.tags;
  const r = await fetch(`${BASE}/contacts/upsert`, { method: 'POST', headers: headers(cfg, '2021-07-28'), body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`GHL contact upsert ${r.status}: ${await r.text()}`);
  const j = (await r.json()) as { contact?: { id?: string }; id?: string };
  const id = j.contact?.id || j.id;
  if (!id) throw new Error('GHL upsert returned no contact id');
  return id;
}

export interface PipelineRef { pipelineId: string; stageId: string; }
// Find a pipeline by (case-insensitive) name and return it + its first stage.
export async function findPipeline(cfg: GhlConfig, name: string): Promise<PipelineRef | null> {
  const r = await fetch(`${BASE}/opportunities/pipelines?locationId=${encodeURIComponent(cfg.locationId())}`, { headers: headers(cfg, '2021-07-28') });
  if (!r.ok) throw new Error(`GHL pipelines ${r.status}: ${await r.text()}`);
  const j = (await r.json()) as { pipelines?: Array<{ id: string; name: string; stages?: Array<{ id: string }> }> };
  const want = name.trim().toLowerCase();
  const p = (j.pipelines || []).find((x) => (x.name || '').trim().toLowerCase() === want);
  if (!p || !p.stages || !p.stages.length) return null;
  return { pipelineId: p.id, stageId: p.stages[0].id };
}

// Create an opportunity in the given pipeline stage for a contact.
export async function createOpportunity(
  cfg: GhlConfig,
  input: { pipelineId: string; stageId: string; contactId: string; name: string; monetaryValue?: number },
): Promise<string> {
  const body: Record<string, unknown> = {
    pipelineId: input.pipelineId,
    locationId: cfg.locationId(),
    pipelineStageId: input.stageId,
    name: input.name,
    status: 'open',
    contactId: input.contactId,
  };
  if (input.monetaryValue) body.monetaryValue = input.monetaryValue;
  const r = await fetch(`${BASE}/opportunities/`, { method: 'POST', headers: headers(cfg, '2021-07-28'), body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`GHL opportunity ${r.status}: ${await r.text()}`);
  const j = (await r.json()) as { opportunity?: { id?: string }; id?: string };
  return j.opportunity?.id || j.id || '';
}
