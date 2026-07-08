import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, type User } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, googleProvider, functions } from './firebase';

type AuthStatus = 'loading' | 'signed-out' | 'checking' | 'admin' | 'denied' | 'error';
interface AuthValue { status: AuthStatus; user: User | null; signInError: string | null; signIn: () => Promise<void>; signOut: () => Promise<void>; }
const Ctx = createContext<AuthValue | null>(null);

const BENIGN_SIGNIN_ERROR_CODES = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request']);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, async (u) => {
    setUser(u);
    if (!u) { setStatus('signed-out'); return; }
    setStatus('checking');
    try {
      // bootstrapAdmin verifies email_verified + Google provider, sets { admin } claim on the allowlist match
      const res = await httpsCallable<unknown, { admin: boolean }>(functions, 'bootstrapAdmin')();
      if (res.data.admin) {
        await u.getIdToken(true); // force-refresh so the new claim is in the token
        setStatus('admin');
      } else {
        setStatus('denied');
      }
    } catch {
      // bootstrapAdmin threw (network/callable error) or token refresh failed — this is
      // NOT a genuine allowlist miss, so don't show "denied". Fail closed into 'error'
      // instead, which offers a retry rather than a dead-end permanent denial.
      setStatus('error');
    }
  }), []);

  const signIn = async () => {
    setSignInError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code && BENIGN_SIGNIN_ERROR_CODES.has(code)) return;
      setSignInError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
    }
  };
  const signOut = async () => { await fbSignOut(auth); };

  return <Ctx.Provider value={{ status, user, signInError, signIn, signOut }}>{children}</Ctx.Provider>;
}
export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
