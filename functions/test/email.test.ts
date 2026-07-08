import { describe, it, expect } from 'vitest';
import { escHtml, emailShell, makeSendEmail, signingInviteHtml } from '../src/email';

describe('email helpers', () => {
  it('escapes HTML', () => { expect(escHtml('<b>&"')).toBe('&#60;b&#62;&#38;&#34;'); });
  it('wraps content in the shell', () => { expect(emailShell('<p>hi</p>')).toContain('<p>hi</p>'); });
  it('returns false when no API key is configured', async () => {
    const send = makeSendEmail(undefined, { notifyEmail: '', fromEmail: '' });
    expect(await send(['x@y.com'], 's', '<p>h</p>')).toBe(false);
  });
  it('builds the signing invite email with the URL and first name', () => {
    const html = signingInviteHtml('Jane Doe', 'https://x/agreement/?t=abc');
    expect(html).toContain('https://x/agreement/?t=abc');
    expect(html).toContain('Hi Jane,');
  });
});
