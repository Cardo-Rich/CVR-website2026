/* Gate for the inline admin layer. This is the ONLY admin code that loads for
   a normal visitor — a few bytes. The heavy layer (Firebase Auth/Functions +
   editing UI) is imported only when there's reason to believe an admin is here:
   either they've signed in before on this browser (a flag we set on activate),
   or they explicitly asked for the login prompt via the #admin hash.
   Public visitors therefore never download or initialize Firebase. */
const ADMIN_FLAG = 'cardoAdmin';

function shouldLoad(): boolean {
  if (location.hash === '#admin') return true;
  try { return localStorage.getItem(ADMIN_FLAG) === '1'; } catch { return false; }
}

if (shouldLoad()) import('./layer');
