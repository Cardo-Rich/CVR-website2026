import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, type User } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, googleProvider, functions } from './firebase';

type AuthStatus = 'loading' | 'signed-out' | 'checking' | 'admin' | 'denied';
interface AuthValue { status: AuthStatus; user: User | null; signIn: () => Promise<void>; signOut: () => Promise<void>; }
const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

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
      setStatus('denied');
    }
  }), []);

  const signIn = async () => { await signInWithPopup(auth, googleProvider); };
  const signOut = async () => { await fbSignOut(auth); };

  return <Ctx.Provider value={{ status, user, signIn, signOut }}>{children}</Ctx.Provider>;
}
export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
