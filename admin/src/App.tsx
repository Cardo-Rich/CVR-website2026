import { useAuth } from './auth';

export default function App() {
  const { status, user, signIn, signOut } = useAuth();
  if (status === 'loading') return <p style={{ padding: 40 }}>Loading…</p>;
  if (status === 'checking') return <p style={{ padding: 40 }}>Checking access…</p>;
  if (status === 'denied') return (
    <div style={{ fontFamily: 'system-ui', padding: 40 }}>
      <h1>Access denied</h1>
      <p>This account isn’t authorized for the Cardo CMS. Contact an administrator.</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
  if (status !== 'admin') return (
    <div style={{ fontFamily: 'system-ui', padding: 40 }}>
      <h1>Cardo CMS</h1>
      <button onClick={() => signIn()}>Sign in with Google</button>
    </div>
  );
  return (
    <div style={{ fontFamily: 'system-ui', padding: 40 }}>
      <p>Signed in as {user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
