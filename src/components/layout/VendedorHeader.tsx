// HEADER PARA PANEL DE VENDEDOR
// Navegación específica para vendedores

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminHeader.module.css'; // Reutilizamos estilos del admin

export const VendedorHeader = () => {
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
                    <Link to="/vendedor" className={styles.logo}>
                        <i className="bi bi-shop"></i>
                        <span>Panel de Vendedor</span>
                    </Link>

                    {/* Menú de navegación del vendedor */}
                    <ul className={`${styles.navMenu} ${menuAbierto ? styles.navMenuOpen : ''}`}>
                        <li>
                            <NavLink
                                to="/vendedor/productos"
                                onClick={cerrarMenu}
                                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
                            >
                                <i className="bi bi-box-seam"></i>
                                <span>Productos</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/vendedor/ventas"
                                onClick={cerrarMenu}
                                className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
                            >
                                <i className="bi bi-cart-check"></i>
                                <span>Ventas</span>
                            </NavLink>
                        </li>
                    </ul>

                    {/* Sección de usuario vendedor */}
                    <div className={styles.userSection}>
                        <div className={styles.userInfo}>
                            <i className="bi bi-person-circle"></i>
                            <span className={styles.userName}>{usuario?.nombre}</span>
                            <span className={styles.userRole}>Vendedor</span>
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
