import { describe, it, expect } from 'vitest';
import { buildPdf } from '../src/pdf';
import type { AgreementDoc } from '../src/types';

const signed: AgreementDoc = {
  token: 'a'.repeat(36), status: 'signed',
  clientName: 'Jane Owner', clientEmail: 'jane@example.com',
  terms: { commissionPct: '20', startupFee: '500', lockSyncFee: '190' },
  addendum: 'None.',
  owner: { fullName: 'Jane A. Owner', homeAddress: '123 Ocean View Dr', email: 'jane@example.com' },
  acks: { ackConsult: true }, sigName: 'Jane A. Owner', sigDate: '2026-07-08',
  sigData: null, signedAt: '2026-07-08T12:00:00.000Z', createdAt: '2026-07-08T11:00:00.000Z', pdfPath: null,
};

describe('buildPdf', () => {
  it('produces a non-empty PDF starting with the %PDF header', async () => {
    const bytes = await buildPdf(signed);
    expect(bytes.length).toBeGreaterThan(1000);
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-');
  });
});
