// HEADER PARA PANEL DE ADMINISTRACIÓN
// Navegación específica para administradores

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminHeader.module.css';

export const AdminHeader = () => {
  const { usuario, cerrarSesionUsuario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await cerrarSesionUsuario();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <nav className="container">
        <div className={styles.navbar}>
          {/* Logo y nombre del panel */}
          <Link to="/admin" className={styles.logo}>
            <i className="bi bi-shield-fill-check"></i>
            <span>Panel de Administración</span>
          </Link>

          {/* Menú de navegación del admin */}
          <ul className={styles.navMenu}>
            <li>
              <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-speedometer2"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/productos" 
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-box-seam"></i>
                <span>Productos</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/usuarios" 
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-people"></i>
                <span>Usuarios</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/preview" 
                className={styles.navLinkPreview}
              >
                <i className="bi bi-eye"></i>
                <span>Vista Previa</span>
              </NavLink>
            </li>
          </ul>

          {/* Sección de usuario admin */}
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <i className="bi bi-person-circle"></i>
              <span className={styles.userName}>{usuario?.nombre}</span>
              <span className={styles.userRole}>Administrador</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className={styles.logoutButton}
              title="Cerrar sesión"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
