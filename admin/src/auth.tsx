import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, type User } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

type AuthStatus = 'loading' | 'signed-out' | 'checking' | 'admin' | 'denied';
interface AuthValue { status: AuthStatus; user: User | null; signIn: () => Promise<void>; signOut: () => Promise<void>; }
const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u);
    setStatus(u ? 'admin' : 'signed-out'); // TEMP: Task 3 replaces this with the bootstrap/claim check
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
