import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function ensureApp() { if (!getApps().length) initializeApp(); }
export function getDb() { ensureApp(); return getFirestore(); }
export function getBucket() { ensureApp(); return getStorage().bucket(); }
