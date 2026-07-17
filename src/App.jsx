import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Occurrences from './pages/Occurrences';
import Documents from './pages/Documents';
import Presence from './pages/Presence';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSettings from './pages/ProfileSettings';

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="almoxarifado" element={<Inventory />} />
          <Route path="ocorrencias" element={<Occurrences />} />
          <Route path="documentos" element={<Documents />} />
          <Route path="presenca" element={<Presence />} />
          <Route path="perfil" element={<ProfileSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={currentUser ? '/' : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;