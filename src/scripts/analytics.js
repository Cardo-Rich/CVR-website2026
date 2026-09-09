// Conversion tracking for the site's lead forms.
//
// Nothing here talks to an ad platform directly. Each conversion is pushed onto
// the GTM dataLayer as a `lead_submit` event and GTM (container GTM-TT9LPF7)
// fans it out to Meta, Google Ads and GA4. That keeps ad-platform IDs and
// conversion labels in the GTM UI, so adding or retargeting a platform is a
// container change, not a site deploy.
//
// `lead_type` distinguishes the forms, so GTM can map them to different
// conversion actions (an owner consultation is worth far more than a vendor
// signup). `event_id` is the deduplication key Meta's Conversions API expects
// if server-side events are ever sent for the same lead.

function eventId() {
  try {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  } catch (e) {}
  return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

// Fire once per lead, at the point the lead is actually captured — not on a
// button click, and not on the mailto fallback, where we can't tell whether the
// visitor ever hit send.
export function trackLead(leadType, params) {
  push('lead_submit', leadType, params);
}

// Non-conversion funnel milestones (extra detail on a lead already counted).
// Kept off `lead_submit` so a single lead is never counted twice.
export function trackLeadStep(leadType, params) {
  push('lead_step', leadType, params);
}

function push(event, leadType, params) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({
      event: event,
      lead_type: leadType,
      event_id: eventId(),
    }, params || {}));
  } catch (e) {
    // Analytics must never break a form submission.
  }
}
