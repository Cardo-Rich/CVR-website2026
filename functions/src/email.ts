import { FOOTER_LINE } from './content.js';
import type { PortalSettings } from './types.js';

export function escHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
export function emailShell(inner: string): string {
  return `<div style="background:#EDEAE2;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#0E1528;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;border:1px solid #e2dfd6;">
      ${inner}
      <p style="margin:28px 0 0;font-size:12px;color:#9A9CA6;">${FOOTER_LINE}</p>
    </div>
  </div>`;
}
export function makeSendEmail(apiKey: string | undefined, settings: PortalSettings) {
  return async (
    to: string[], subject: string, html: string,
    attachments: { filename: string; content: string }[] = [],
  ): Promise<boolean> => {
    if (!apiKey) return false;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: settings.fromEmail || 'Cardo Vacation Rentals <onboarding@resend.dev>',
        to, subject, html,
        attachments: attachments.length ? attachments : undefined,
      }),
    });
    if (!res.ok) { console.error('Resend error', res.status, await res.text()); return false; }
    return true;
  };
}
