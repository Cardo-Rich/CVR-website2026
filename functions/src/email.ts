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
export function signingInviteHtml(clientName: string, url: string): string {
  const firstName = escHtml((clientName || '').trim().split(/\s+/)[0] || 'there');
  return emailShell(`
    <h2 style="margin:0 0 14px;font-size:20px;">Hi ${firstName},</h2>
    <p style="font-size:14px;line-height:1.6;color:#3D3E47;">Your Rental Management Agreement with Cardo Vacation Rentals is ready. The key commercial terms have been filled in for you — review the agreement, complete your details, and sign online. It takes about five minutes.</p>
    <p style="margin:24px 0;"><a href="${url}" style="background:#ED3C78;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:14px 26px;border-radius:999px;display:inline-block;">Review &amp; Sign Agreement</a></p>
    <p style="font-size:13px;line-height:1.6;color:#6B6D78;">Once signed, a PDF copy is emailed to you automatically. You can cancel for any reason within 14 days of signing with no termination fee.</p>
    <p style="font-size:12px;color:#9A9CA6;">If the button doesn't work, copy this link: ${url}</p>`);
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
