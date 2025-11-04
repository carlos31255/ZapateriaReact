// Página de acceso no autorizado

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './UnauthorizedPage.module.css';

export const UnauthorizedPage = () => {
  const { usuario } = useAuth();

  const getRedirectPath = () => {
    if (!usuario) return '/login';
    if (usuario.rol === 'administrador') return '/admin';
    return '/';
  };

  const getRedirectText = () => {
    if (!usuario) return 'Iniciar Sesión';
    if (usuario.rol === 'administrador') return 'Ir al Panel de Administración';
    return 'Ir al Inicio';
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <i className="bi bi-shield-x"></i>
        </div>
        
        <h1 className={styles.title}>Acceso Denegado</h1>
        
        <p className={styles.message}>
          No tienes permiso para acceder a esta página.
        </p>

        {usuario && (
          <div className={styles.userInfo}>
            <i className="bi bi-person-circle me-2"></i>
            Sesión iniciada como: <strong>{usuario.nombre}</strong> ({usuario.rol})
          </div>
        )}

        <div className={styles.actions}>
          <Link to={getRedirectPath()} className={styles.primaryButton}>
            <i className="bi bi-arrow-left me-2"></i>
            {getRedirectText()}
          </Link>
          
          {usuario && (
            <Link to="/perfil" className={styles.secondaryButton}>
              <i className="bi bi-person me-2"></i>
              Ver mi Perfil
            </Link>
          )}
        </div>

        <div className={styles.helpText}>
          <i className="bi bi-info-circle me-2"></i>
          Si crees que esto es un error, contacta al administrador del sistema.
        </div>
      </div>
    </div>
  );
};
