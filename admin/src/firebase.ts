import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

export const app = initializeApp({
  apiKey: 'AIzaSyDEvpX1WsRtgaLOSHWh6Pf6SP9pzk-g0UE',
  authDomain: 'cardo-website-2026.firebaseapp.com',
  projectId: 'cardo-website-2026',
  storageBucket: 'cardo-website-2026.firebasestorage.app',
  messagingSenderId: '350974726921',
  appId: '1:350974726921:web:ad0d1bee9a616c9715f9d8',
});
export const auth = getAuth(app);
export const functions = getFunctions(app, 'us-central1'); // callables live in us-central1
export const googleProvider = new GoogleAuthProvider();
