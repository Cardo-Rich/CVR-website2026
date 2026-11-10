import { describe, it, expect } from 'vitest';
import { spamReason, HONEYPOT_FIELD } from '../src/spam';

const human = { elapsedMs: 8000, email: 'jane@example.com', phone: '+1 (619) 555-1212' };

describe('spamReason', () => {
  it('passes a real-looking submission (valid email + unhurried)', () => {
    expect(spamReason(human)).toBeNull();
  });
  it('passes when only a valid phone is given', () => {
    expect(spamReason({ elapsedMs: 5000, phone: '6195551212' })).toBeNull();
  });
  it('flags a filled honeypot', () => {
    expect(spamReason({ ...human, honeypot: 'http://spam.example' })).toBe('honeypot');
  });
  it('ignores an empty honeypot', () => {
    expect(spamReason({ ...human, honeypot: '' })).toBeNull();
  });
  it('flags an instant submit', () => {
    expect(spamReason({ ...human, elapsedMs: 200 })).toBe('too-fast');
  });
  it('flags a missing timing token (raw POST bot)', () => {
    expect(spamReason({ email: 'jane@example.com' })).toBe('too-fast');
  });
  it('flags a submission with no usable email or phone', () => {
    expect(spamReason({ elapsedMs: 5000, email: 'not-an-email', phone: '123' })).toBe('no-valid-contact');
  });
  it('exposes the honeypot field name for the front-end to match', () => {
    expect(HONEYPOT_FIELD).toBe('url');
  });
});
