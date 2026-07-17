import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import OccurrencesPage from './pages/OccurrencesPage';
import DocumentsPage from './pages/DocumentsPage';
import PresencePage from './pages/PresencePage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('secult_token')));

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(Boolean(localStorage.getItem('secult_token')));
    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth:changed', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth:changed', syncAuth);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('secult_token');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('auth:changed'));
  };

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={() => { setIsAuthenticated(true); window.dispatchEvent(new Event('auth:changed')); }} />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage onLogin={() => { setIsAuthenticated(true); window.dispatchEvent(new Event('auth:changed')); }} />} />
      <Route element={isAuthenticated ? <Layout onLogout={logout} /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/almoxarifado" element={<InventoryPage />} />
        <Route path="/ocorrencias" element={<OccurrencesPage />} />
        <Route path="/documentos" element={<DocumentsPage />} />
        <Route path="/presenca" element={<PresencePage />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
    </Routes>
  );
}
