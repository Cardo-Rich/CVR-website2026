import { beforeEach, describe, it, expect } from 'vitest';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { migrateAgreements, toAgreementDoc, type SupabaseRow } from '../src/migrate';

function db() { if (!getApps().length) initializeApp({ projectId: 'demo-agreements' }); return getFirestore(); }
const files: Record<string, Buffer> = {};
const bucket = { file: (p: string) => ({ save: async (b: Buffer) => { files[p] = b; }, download: async () => [files[p]] }) };

const rows: SupabaseRow[] = [
  { token: 'a'.repeat(36), status: 'signed', client_name: 'Jane Owner', client_email: 'jane@example.com',
    terms: { commissionPct: '20' }, addendum: null, owner: { fullName: 'Jane A. Owner', homeAddress: '123 Ocean', email: 'jane@example.com' },
    acks: { ackConsult: true }, sig_name: 'Jane A. Owner', sig_date: '2026-06-20', sig_data: 'data:image/png;base64,iVBORw0KGgo=',
    signed_at: '2026-06-20T10:00:00Z', created_at: '2026-06-19T10:00:00Z' },
  { token: 'b'.repeat(36), status: 'sent', client_name: 'Bob', client_email: 'bob@example.com',
    terms: {}, addendum: null, owner: null, acks: null, sig_name: null, sig_date: null, sig_data: null, signed_at: null, created_at: '2026-07-01T10:00:00Z' },
];

beforeEach(async () => {
  const base = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/demo-agreements/databases/(default)/documents`;
  await fetch(base, { method: 'DELETE' }).catch(() => {});
  for (const k of Object.keys(files)) delete files[k];
});

describe('migrateAgreements (emulator)', () => {
  it('maps snake_case → camelCase, preserving the token as id', () => {
    const d = toAgreementDoc(rows[0]);
    expect(d.token).toBe(rows[0].token);
    expect(d.clientName).toBe('Jane Owner');
    expect(d.sigData).toBe(rows[0].sig_data);
  });
  it('writes docs under their token, regenerates the PDF only for signed', async () => {
    const res = await migrateAgreements(rows, { notifyEmail: 'rich@cardorentals.com', fromEmail: 'X <onboarding@resend.dev>' }, db(), bucket);
    expect(res).toEqual({ migrated: 2, pdfs: 1 });
    const signed = (await db().doc(`agreements/${rows[0].token}`).get()).data()!;
    expect(signed.status).toBe('signed');
    expect(signed.pdfPath).toBe(`agreements/${rows[0].token}/executed.pdf`);
    expect(files[`agreements/${rows[0].token}/executed.pdf`]).toBeInstanceOf(Buffer);
    const sent = (await db().doc(`agreements/${rows[1].token}`).get()).data()!;
    expect(sent.status).toBe('sent');
    expect(sent.pdfPath).toBeNull();
    const cfg = (await db().doc('config/portalSettings').get()).data()!;
    expect(cfg.notifyEmail).toBe('rich@cardorentals.com');
  });
});
