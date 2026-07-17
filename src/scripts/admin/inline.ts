/* Gate for the inline admin layer. This is the ONLY admin code that loads for
   a normal visitor — a few bytes. The heavy layer (Firebase Auth/Functions +
   editing UI) is imported only when there's reason to believe an admin is here.

   We decide WITHOUT loading Firebase, using three cheap signals:
   1. the #admin hash (explicit first-time sign-in on a fresh browser),
   2. a localStorage flag we set once an admin has been confirmed here, and
   3. an existing Firebase auth session in IndexedDB — i.e. the person is
      already logged in (e.g. via /admin). This is what makes a signed-in admin
      see the admin view on the main site automatically, without #admin.

   A visitor who has never signed in has none of these, so Firebase is never
   downloaded or initialized for them. */
const ADMIN_FLAG = 'cardoAdmin';
// Firebase (modular SDK) persists auth in an IndexedDB database with this name.
const FIREBASE_AUTH_DB = 'firebaseLocalStorageDb';

function flagged(): boolean {
  if (location.hash === '#admin') return true;
  try { return localStorage.getItem(ADMIN_FLAG) === '1'; } catch { return false; }
}

// Is there already a Firebase auth session on this browser? Uses
// indexedDB.databases() so we only READ the list — we never open/create the DB
// or touch Firebase itself. Returns false wherever that API is unavailable
// (older Firefox, locked-down privacy modes); the flag/#admin paths still work.
async function hasFirebaseSession(): Promise<boolean> {
  try {
    if (typeof indexedDB === 'undefined' || !indexedDB.databases) return false;
    const dbs = await indexedDB.databases();
    return dbs.some((d) => d.name === FIREBASE_AUTH_DB);
  } catch { return false; }
}

async function decide() {
  if (flagged() || (await hasFirebaseSession())) import('./layer');
}
decide();
