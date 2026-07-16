import { useState } from 'react';
import { useAuth } from './auth';
import AgreementsModule from './agreements/AgreementsModule';
import ContentModule from './content/ContentModule';

type Module = 'agreements' | 'content';

export default function Shell() {
  const { user, signOut } = useAuth();
  const [module, setModule] = useState<Module>('agreements');
  return (
    <div>
      <header className="app-header">
        <div className="header-inner">
          <strong>Cardo CMS</strong>
          <nav className="nav">
            <a href="#" aria-current={module === 'agreements' ? 'page' : undefined} onClick={(e) => { e.preventDefault(); setModule('agreements'); }}>Agreements</a>
            <a href="#" aria-current={module === 'content' ? 'page' : undefined} onClick={(e) => { e.preventDefault(); setModule('content'); }}>Site content</a>
          </nav>
          <span className="spacer" />
          <span className="who">{user?.email}</span>
          <button className="btn-ghost" onClick={() => signOut()}>Sign out</button>
        </div>
        <div className="sunset-bar" />
      </header>
      <main className="main">
        {module === 'agreements' ? <AgreementsModule /> : <ContentModule />}
      </main>
    </div>
  );
}
