import { useAuth } from './auth';
import Shell from './Shell';

export default function App() {
  const { status, signInError, signIn, signOut } = useAuth();

  if (status === 'admin') return <Shell />;

  return (
    <div>
      <header className="app-header">
        <div className="header-inner">
          <strong>Cardo CMS</strong>
          <span className="spacer" />
        </div>
        <div className="sunset-bar" />
      </header>
      <main className="main">
        <div className="auth-screen">
          <div className="auth-card">
            {status === 'loading' && <p>Loading…</p>}
            {status === 'checking' && <p>Checking access…</p>}
            {status === 'denied' && (
              <>
                <div className="kicker">Access Denied</div>
                <h1>Not authorized</h1>
                <p>This account isn’t authorized for the Cardo CMS. Contact an administrator.</p>
                <button className="btn-ghost" onClick={() => signOut()}>Sign out</button>
              </>
            )}
            {status === 'error' && (
              <>
                <div className="kicker">Error</div>
                <h1>Couldn't verify access</h1>
                <p>Couldn't verify access — check your connection and try again.</p>
                <button className="btn" onClick={() => window.location.reload()}>Try again</button>
              </>
            )}
            {status === 'signed-out' && (
              <>
                <div className="kicker">Cardo CMS</div>
                <h1>Sign in to continue</h1>
                <p>Use your Cardo Google account to access the admin panel.</p>
                <button className="btn" onClick={() => signIn()}>Sign in with Google</button>
                {signInError && <p className="auth-error">{signInError}</p>}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
