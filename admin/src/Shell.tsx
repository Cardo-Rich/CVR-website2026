import { useAuth } from './auth';

export default function Shell() {
  const { user, signOut } = useAuth();
  return (
    <div>
      <header className="app-header">
        <div className="header-inner">
          <strong>Cardo CMS</strong>
          <nav className="nav">
            <a href="#" aria-current="page">Agreements</a>
          </nav>
          <span className="spacer" />
          <span className="who">{user?.email}</span>
          <button className="btn-ghost" onClick={() => signOut()}>Sign out</button>
        </div>
        <div className="sunset-bar" />
      </header>
      <main className="main">
        {/* Plan 2b mounts the Agreements module here */}
        <p>Welcome. The Agreements module lands in Plan 2b.</p>
      </main>
    </div>
  );
}
