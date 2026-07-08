import { beforeEach, describe, it, expect } from 'vitest';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { resolveAdmin } from '../src/claims';

function db() { if (!getApps().length) initializeApp({ projectId: 'demo-agreements' }); return getFirestore(); }
beforeEach(async () => {
  await db().doc('config/admins').set({ emails: ['rich@cardorentals.com'] });
});
describe('resolveAdmin', () => {
  it('grants an allowlisted email (case-insensitive)', async () => {
    expect(await resolveAdmin(db(), 'Rich@CardoRentals.com')).toBe(true);
  });
  it('denies a non-allowlisted email', async () => {
    expect(await resolveAdmin(db(), 'stranger@gmail.com')).toBe(false);
  });
  it('denies when email is undefined', async () => {
    expect(await resolveAdmin(db(), undefined)).toBe(false);
  });
});
