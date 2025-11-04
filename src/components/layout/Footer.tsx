// Footer del sitio con información y enlaces de navegación

import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          {/* Columna 1: Información de la empresa */}
          <div className={styles.column}>
            <div className={styles.brand}>
              <i className="bi bi-bag-heart-fill fs-3 text-primary"></i>
              <h3 className={styles.brandName}>StepStyle</h3>
            </div>
            <p className={styles.description}>
              Tu tienda de confianza para encontrar el calzado perfecto. 
              Calidad, estilo y comodidad en cada paso.
            </p>
          </div>

          {/* Columna 2: Enlaces de navegación */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Navegación</h4>
            <nav className={styles.links}>
              <Link to="/" className={styles.link}>
                <i className="bi bi-house-door me-2"></i>
                Inicio
              </Link>
              <Link to="/productos" className={styles.link}>
                <i className="bi bi-grid-3x3-gap me-2"></i>
                Productos
              </Link>
              <Link to="/blog" className={styles.link}>
                <i className="bi bi-journal-text me-2"></i>
                Blog
              </Link>
              <Link to="/nosotros" className={styles.link}>
                <i className="bi bi-info-circle me-2"></i>
                Nosotros
              </Link>
              <Link to="/contacto" className={styles.link}>
                <i className="bi bi-envelope me-2"></i>
                Contacto
              </Link>
            </nav>
          </div>

          {/* Columna 3: Categorías de productos */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Categorías</h4>
            <nav className={styles.links}>
              <Link to="/productos?categoria=hombre" className={styles.link}>
                <i className="bi bi-person me-2"></i>
                Hombre
              </Link>
              <Link to="/productos?categoria=mujer" className={styles.link}>
                <i className="bi bi-gender-female me-2"></i>
                Mujer
              </Link>
              <Link to="/productos?categoria=niños" className={styles.link}>
                <i className="bi bi-person-hearts me-2"></i>
                Niños
              </Link>
              <Link to="/productos?categoria=deportivos" className={styles.link}>
                <i className="bi bi-dribbble me-2"></i>
                Deportivos
              </Link>
            </nav>
          </div>

          {/* Columna 4: Información de contacto */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contacto</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <i className="bi bi-geo-alt-fill me-2"></i>
                <span>Santiago, Chile</span>
              </div>
              <div className={styles.contactItem}>
                <i className="bi bi-envelope-fill me-2"></i>
                <a href="mailto:info@stepstyle.cl" className={styles.contactLink}>
                  info@stepstyle.cl
                </a>
              </div>
              <div className={styles.contactItem}>
                <i className="bi bi-phone-fill me-2"></i>
                <a href="tel:+56912345678" className={styles.contactLink}>
                  +56 9 1234 5678
                </a>
              </div>
              <div className={styles.contactItem}>
                <i className="bi bi-clock-fill me-2"></i>
                <span>Lun - Vie: 9:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <hr className={styles.divider} />

        {/* Bottom bar con copyright y desarrolladores */}
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>
              © {currentYear} <strong>StepStyle</strong>. Todos los derechos reservados.
            </p>
          </div>
          <div className={styles.developers}>
            <span className={styles.developedBy}>Desarrollado por:</span>
            <a 
              href="https://github.com/BrayanGallardo19" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.devLink}
              title="Ver perfil de Brayan Gallardo"
            >
              <i className="bi bi-github me-1"></i>
              Brayan Gallardo
            </a>
            <span className={styles.separator}>•</span>
            <a 
              href="https://github.com/carlos31255" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.devLink}
              title="Ver perfil de Carlos Hidalgo"
            >
              <i className="bi bi-github me-1"></i>
              Carlos Hidalgo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
