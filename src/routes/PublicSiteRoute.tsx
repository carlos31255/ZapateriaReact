// Protege rutas públicas para que administradores no puedan acceder
// Los administradores solo pueden ver el sitio público a través de /preview

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { usuario, estaAutenticado, cargando } = useAuth();

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

  // Si está autenticado y es administrador, redirigir al panel admin
  if (estaAutenticado && usuario && usuario.rol === 'administrador') {
    return <Navigate to="/admin" replace />;
  }

  // Si no es administrador, permitir acceso
  return <>{children}</>;
};
