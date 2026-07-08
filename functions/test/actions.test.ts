import { beforeEach, describe, it, expect } from 'vitest';
import { initializeApp, getApps, deleteApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createAgreement, getAgreementPublic, signAgreement, listAgreements, setSettings, getSettings } from '../src/actions';

function db() {
  if (!getApps().length) initializeApp({ projectId: 'demo-agreements' });
  return getFirestore();
}
// Minimal in-memory bucket stub (Storage emulator not required for action logic)
const files: Record<string, Buffer> = {};
const bucket = { file: (p: string) => ({
  save: async (b: Buffer) => { files[p] = b; },
  download: async () => [files[p]],
}) };
const noMail = async () => false;

beforeEach(async () => {
  const base = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/demo-agreements/databases/(default)/documents`;
  await fetch(base, { method: 'DELETE' }).catch(() => {});
});

describe('agreement actions (emulator)', () => {
  it('creates a sent agreement with a 36-hex token and defaulted terms', async () => {
    const d = await createAgreement(db(), { clientEmail: 'jane@example.com', clientName: 'Jane' });
    expect(d.status).toBe('sent');
    expect(d.token).toMatch(/^[0-9a-f]{36}$/);
    expect(d.terms.commissionPct).toBeTruthy();
  });

  it('rejects an invalid client email', async () => {
    await expect(createAgreement(db(), { clientEmail: 'nope' } as any)).rejects.toThrow(/valid client email/);
  });

  it('withholds owner/signature until signed', async () => {
    const d = await createAgreement(db(), { clientEmail: 'jane@example.com' });
    const view = await getAgreementPublic(db(), d.token);
    expect(view.status).toBe('sent');
    expect(view.owner).toBeNull();
  });

  it('signs, stores a PDF, and flips status', async () => {
    const d = await createAgreement(db(), { clientEmail: 'jane@example.com' });
    const res = await signAgreement(db(), bucket, d.token, {
      owner: { fullName: 'Jane A. Owner', homeAddress: '123 Ocean View Dr', email: 'jane@example.com' },
      acks: Object.fromEntries((await import('../src/content')).ACKS.filter(a => a.required).map(a => [a.key, true])),
      sigName: 'Jane A. Owner', sigDate: '2026-07-08', sigData: 'data:image/png;base64,iVBORw0KGgo=',
    }, noMail);
    expect(res.signedAt).toBeTruthy();
    const view = await getAgreementPublic(db(), d.token);
    expect(view.status).toBe('signed');
    expect(view.owner?.fullName).toBe('Jane A. Owner');
  });

  it('refuses to re-sign', async () => {
    const d = await createAgreement(db(), { clientEmail: 'jane@example.com' });
    const args = { owner: { fullName: 'J', homeAddress: 'X', email: 'j@e.com' },
      acks: Object.fromEntries((await import('../src/content')).ACKS.filter(a => a.required).map(a => [a.key, true])),
      sigName: 'J', sigDate: '2026-07-08', sigData: 'data:image/png;base64,iVBORw0KGgo=' };
    await signAgreement(db(), bucket, d.token, args, noMail);
    await expect(signAgreement(db(), bucket, d.token, args, noMail)).rejects.toThrow(/already been signed/);
  });

  it('lists agreements and round-trips settings', async () => {
    await createAgreement(db(), { clientEmail: 'a@b.com' });
    expect((await listAgreements(db())).length).toBeGreaterThan(0);
    await setSettings(db(), { notifyEmail: 'rich@cardorentals.com' });
    expect((await getSettings(db())).notifyEmail).toBe('rich@cardorentals.com');
  });
});
