// Layout para modo vista previa (sin compras ni autenticación)

import { Link, useLocation } from 'react-router-dom';
import styles from './PreviewLayout.module.css';

interface PreviewLayoutProps {
  children: React.ReactNode;
}

export const PreviewLayout = ({ children }: PreviewLayoutProps) => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={styles.previewContainer}>
      {/* Banner de Vista Previa */}
      <div className={styles.previewBanner}>
        <div className="container">
          <div className={styles.bannerContent}>
            <i className="bi bi-eye me-2"></i>
            <span>Modo Vista Previa - Solo lectura</span>
            <Link to="/admin" className={styles.exitButton}>
              <i className="bi bi-box-arrow-left me-2"></i>
              Salir de Vista Previa
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar sin carrito ni auth */}
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/preview">
            <i className="bi bi-shop me-2"></i>
            StepStyle
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#previewNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="previewNav">
            <ul className="navbar-nav ms-auto gap-3">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActivePath('/preview') ? 'active fw-bold' : ''}`} 
                  to="/preview"
                >
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActivePath('/preview/productos') ? 'active fw-bold' : ''}`} 
                  to="/preview/productos"
                >
                  Productos
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActivePath('/preview/blog') ? 'active fw-bold' : ''}`} 
                  to="/preview/blog"
                >
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActivePath('/preview/nosotros') ? 'active fw-bold' : ''}`} 
                  to="/preview/nosotros"
                >
                  Nosotros
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActivePath('/preview/contacto') ? 'active fw-bold' : ''}`} 
                  to="/preview/contacto"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className={styles.mainContent}>
        {children}
      </main>

      {/* Footer simplificado */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              <i className="bi bi-eye me-2"></i>
              Vista previa del sitio - No se pueden realizar compras en este modo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
