import type { Firestore } from 'firebase-admin/firestore';

export async function resolveAdmin(db: Firestore, email: string | undefined): Promise<boolean> {
  if (!email) return false;
  const snap = await db.doc('config/admins').get();
  const emails = (snap.data()?.emails as string[] | undefined) ?? [];
  return emails.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}
