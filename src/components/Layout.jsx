import { Link, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  DashboardIcon,
  DocumentIcon,
  InventoryIcon,
  MoonIcon,
  OccurrenceIcon,
  PresenceIcon,
  ProfileIcon,
  SunIcon
} from './Icons';

export default function Layout() {
  const { currentUser, logout, theme, toggleTheme } = useApp();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: DashboardIcon, end: true },
    { to: '/almoxarifado', label: 'Almoxarifado', icon: InventoryIcon },
    { to: '/ocorrencias', label: 'Ocorrências', icon: OccurrenceIcon },
    { to: '/documentos', label: 'Documentos', icon: DocumentIcon },
    { to: '/presenca', label: 'Presença', icon: PresenceIcon },
    { to: '/perfil', label: 'Perfil', icon: ProfileIcon }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>SECULT</h2>
            <p>Hub Cultural</p>
          </div>
        </div>

        <nav className="nav-links">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <span className="nav-icon">
                <Icon size={18} />
              </span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-card">
          <div className="status-dot" />
          <strong>Modo híbrido</strong>
          <p>Operação offline preparada para presença, estoque e ocorrências.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-copy">
            <div className="eyebrow">Painel Interno</div>
            <h1>Sistema de Gestão SECULT</h1>
            <p>Centralize eventos, insumos e ocorrências com mais segurança e menos retrabalho.</p>
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" onClick={toggleTheme} title="Alternar tema">
              {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>

            <Link to="/perfil" className="user-pill">
              <span className="user-avatar">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
              <div>
                <strong>{currentUser?.name || 'Usuário'}</strong>
                <small>{currentUser?.role || 'Acesso interno'}</small>
              </div>
            </Link>

            <button className="btn btn-secondary" onClick={logout}>
              Sair
            </button>
          </div>
        </header>

        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}