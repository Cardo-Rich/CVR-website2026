import { useAuth } from './auth';

export default function App() {
  const { status, user, signIn, signOut } = useAuth();
  if (status === 'loading') return <p style={{ padding: 40 }}>Loading…</p>;
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
