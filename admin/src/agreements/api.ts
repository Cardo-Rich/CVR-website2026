import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import type { AgreementRow, Settings } from './types';

export async function createAgreement(input: { clientName: string; clientEmail: string; terms: Record<string,string>; addendum: string; siteOrigin: string }) {
  const r = await httpsCallable<typeof input, { token: string; url: string; emailed: boolean }>(functions, 'adminCreate')(input);
  return r.data;
}
export async function listAgreements(): Promise<AgreementRow[]> {
  const r = await httpsCallable<unknown, { agreements: AgreementRow[] }>(functions, 'adminList')();
  return r.data.agreements;
}
export async function getSettings(): Promise<Settings> {
  const r = await httpsCallable<unknown, Settings>(functions, 'adminGetSettings')();
  return r.data;
}
export async function setSettings(patch: { notifyEmail?: string; fromEmail?: string }) {
  const r = await httpsCallable<typeof patch, { ok: true }>(functions, 'adminSetSettings')(patch);
  return r.data;
}
