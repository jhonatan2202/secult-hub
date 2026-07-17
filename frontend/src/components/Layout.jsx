import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function Layout({ onLogout }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('secult-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('secult-theme', theme);
  }, [theme]);

  const handleLogout = () => {
    if (typeof onLogout === 'function') onLogout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>SECULT</h2>
        <nav className="nav-links">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/almoxarifado">Almoxarifado</NavLink>
          <NavLink to="/ocorrencias">Ocorrências</NavLink>
          <NavLink to="/documentos">Documentos</NavLink>
          <NavLink to="/presenca">Presença</NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div>
            <strong>SECULT Hub Cultural</strong>
            <div>Gestão interna e operacional</div>
          </div>
          <div className="topbar-actions">
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              <span className="theme-toggle__icon" aria-hidden="true">
                {theme === 'dark' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="4.2" />
                    <path d="M12 2v2.5M12 19.5V22M4.5 4.5l1.8 1.8M17.7 17.7l1.8 1.8M2 12h2.5M19.5 12H22M4.5 19.5l1.8-1.8M17.7 6.3l1.8-1.8" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.9 8.9 0 1 0 20 15.5Z" />
                  </svg>
                )}
              </span>
              <span className="theme-toggle__label">{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</span>
            </button>
            <button className="btn" onClick={handleLogout}>Sair</button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
