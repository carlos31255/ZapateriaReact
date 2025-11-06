// HEADER PARA PANEL DE ADMINISTRACIÓN
// Navegación específica para administradores

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminHeader.module.css';

export const AdminHeader = () => {
  const { usuario, cerrarSesionUsuario } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = async () => {
    await cerrarSesionUsuario();
    
    // Navegar al login con mensaje de éxito
    navigate('/login', {
      state: {
        mensaje: 'Has cerrado sesión correctamente',
        tipo: 'success'
      },
      replace: true
    });
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
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
          <ul className={`${styles.navMenu} ${menuAbierto ? styles.navMenuOpen : ''}`}>
            <li>
              <NavLink 
                to="/admin" 
                end
                onClick={cerrarMenu}
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-speedometer2"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/productos" 
                onClick={cerrarMenu}
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-box-seam"></i>
                <span>Productos</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/usuarios" 
                onClick={cerrarMenu}
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-people"></i>
                <span>Usuarios</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/ventas" 
                onClick={cerrarMenu}
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-cart-check"></i>
                <span>Ventas</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/blog" 
                onClick={cerrarMenu}
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-journal-text"></i>
                <span>Blog</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/preview" 
                onClick={cerrarMenu}
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

          {/* Botón de menú móvil */}
          <button 
            className={styles.mobileMenuButton} 
            onClick={toggleMenu}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
          >
            <i className={menuAbierto ? "bi bi-x-lg" : "bi bi-list"}></i>
          </button>
        </div>
      </nav>
    </header>
  );
};
