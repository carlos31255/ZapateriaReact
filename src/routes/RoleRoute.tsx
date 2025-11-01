// ============================================
// COMPONENTE DE RUTA POR ROL
// ============================================
// Protege rutas que requieren un rol específico

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RolUsuario } from '../types';

interface RoleRouteProps {
  children: React.ReactNode;
  rolesPermitidos: RolUsuario[];
  redirectTo?: string;
}

export const RoleRoute = ({ 
  children, 
  rolesPermitidos, 
  redirectTo = '/' 
}: RoleRouteProps) => {
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

  // Si no está autenticado, redirigir al login
  if (!estaAutenticado || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario tiene el rol permitido
  const tieneRolPermitido = rolesPermitidos.includes(usuario.rol);

  // Si no tiene el rol, redirigir
  if (!tieneRolPermitido) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si tiene el rol permitido, mostrar el contenido
  return <>{children}</>;
};
