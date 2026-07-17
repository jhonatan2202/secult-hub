import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute() {
  const { currentUser } = useApp();

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}