// Redirige usuarios autenticados lejos de páginas públicas como login

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  restricted?: boolean; // Si es true, usuarios autenticados no pueden acceder
}

export const PublicRoute = ({ 
  children, 
  redirectTo = '/',
  restricted = false 
}: PublicRouteProps) => {
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

  // Si la ruta es restringida y el usuario está autenticado, redirigir
  if (restricted && estaAutenticado) {
    return <Navigate to={redirectTo} replace />;
  }

  // Permitir acceso
  return <>{children}</>;
};
