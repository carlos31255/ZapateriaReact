// ============================================
// COMPONENTE DE RUTA PROTEGIDA
// ============================================
// Protege rutas que requieren autenticación

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({ children, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { estaAutenticado, cargando } = useAuth();

  // Mostrar loader mientras se verifica la autenticación
  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!estaAutenticado) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
};
