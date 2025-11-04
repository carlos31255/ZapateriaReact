// HEADER PRINCIPAL DE LA APLICACIÓN
// Navbar responsive con menú de navegación, carrito y autenticación

import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import styles from './Header.module.css';

export const Header = () => {
  const { usuario, estaAutenticado, cerrarSesionUsuario } = useAuth();
  const { carrito } = useCart();

  const handleLogout = async () => {
    await cerrarSesionUsuario();
  };

  return (
    <header className={styles.header}>
      <nav className="container">
        <div className={styles.navbar}>
          {/* Logo y nombre de la tienda */}
          <Link to="/" className={styles.logo}>
            <i className="bi bi-shop"></i>
            <span>StepStyle</span>
          </Link>

          {/* Menú de navegación principal */}
          <ul className={styles.navMenu}>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-house-door"></i>
                <span>Inicio</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/productos" 
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-grid-3x3-gap"></i>
                <span>Productos</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/blog" 
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-journal-text"></i>
                <span>Blog</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/nosotros" 
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-info-circle"></i>
                <span>Nosotros</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contacto" 
                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
              >
                <i className="bi bi-envelope"></i>
                <span>Contacto</span>
              </NavLink>
            </li>
          </ul>

          {/* Sección de acciones: Carrito y Usuario */}
          <div className={styles.navActions}>
            {/* Botón del carrito con contador */}
            <Link to="/carrito" className={styles.cartButton}>
              <i className="bi bi-cart3"></i>
              {carrito.cantidadTotal > 0 && (
                <span className={styles.cartBadge}>{carrito.cantidadTotal}</span>
              )}
            </Link>

            {/* Menú de usuario: Logged in o botones de auth */}
            {estaAutenticado && usuario ? (
              <div className={styles.userMenu}>
                <button className={styles.userButton}>
                  <i className="bi bi-person-circle"></i>
                  <span>{usuario.nombre.split(' ')[0]}</span>
                  <i className="bi bi-chevron-down"></i>
                </button>
                
                {/* Dropdown del usuario */}
                <div className={styles.userDropdown}>
                  <Link to="/perfil" className={styles.dropdownItem}>
                    <i className="bi bi-person"></i>
                    Mi Perfil
                  </Link>
                  <Link to="/carrito" className={styles.dropdownItem}>
                    <i className="bi bi-cart"></i>
                    Mi Carrito
                  </Link>
                  <div className={styles.dropdownDivider}></div>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    <i className="bi bi-box-arrow-right"></i>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link to="/login" className={styles.loginButton}>
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>Ingresar</span>
                </Link>
                <Link to="/registro" className={styles.registerButton}>
                  <i className="bi bi-person-plus"></i>
                  <span>Registrarse</span>
                </Link>
              </div>
            )}
          </div>

          {/* Botón de menú móvil (hamburguesa) */}
          <button className={styles.mobileMenuButton} aria-label="Abrir menú">
            <i className="bi bi-list"></i>
          </button>
        </div>
      </nav>
    </header>
  );
};
