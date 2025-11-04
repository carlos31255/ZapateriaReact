// Modal flotante para mostrar artículo completo del blog

import type { ArticuloBlog } from '../../types';
import { formatearFecha } from '../../services/blogService';
import styles from './BlogModal.module.css';

interface BlogModalProps {
  articulo: ArticuloBlog;
  onClose: () => void;
}

export const BlogModal = ({ articulo, onClose }: BlogModalProps) => {
  const getCategoryIcon = (categoria: string) => {
    const icons = {
      tendencias: 'bi-star',
      cuidado: 'bi-heart',
      consejos: 'bi-lightbulb',
      estilo: 'bi-palette'
    };
    return icons[categoria as keyof typeof icons] || 'bi-journal-text';
  };

  const getCategoryColor = (categoria: string) => {
    const colors = {
      tendencias: '#ffc107',
      cuidado: '#dc3545',
      consejos: '#0dcaf0',
      estilo: '#6f42c1'
    };
    return colors[categoria as keyof typeof colors] || '#6c757d';
  };

  return (
    <>
      {/* Overlay oscuro de fondo */}
      <div className={styles.overlay} onClick={onClose}></div>

      {/* Contenedor del modal */}
      <article className={styles.modal}>
        {/* Botón cerrar */}
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar artículo"
        >
          <i className="bi bi-x-lg"></i>
        </button>

        {/* Imagen destacada */}
        <div className={styles.heroImage}>
          <img 
            src={articulo.imagen} 
            alt={articulo.titulo}
            className={styles.image}
          />
          <div 
            className={styles.categoryBadge}
            style={{ backgroundColor: getCategoryColor(articulo.categoria) }}
          >
            <i className={`bi ${getCategoryIcon(articulo.categoria)} me-2`}></i>
            {articulo.categoria}
          </div>
        </div>

        {/* Contenido del artículo */}
        <div className={styles.content}>
          {/* Header del artículo */}
          <header className={styles.header}>
            <h1 className={styles.title}>{articulo.titulo}</h1>
            
            <div className={styles.meta}>
              <span className={styles.date}>
                <i className="bi bi-calendar3 me-2"></i>
                {formatearFecha(articulo.fecha)}
              </span>
              {articulo.autor && (
                <span className={styles.author}>
                  <i className="bi bi-person-circle me-2"></i>
                  Por {articulo.autor}
                </span>
              )}
            </div>

            {/* Resumen destacado */}
            <p className={styles.summary}>{articulo.resumen}</p>
          </header>

          {/* Separador */}
          <hr className={styles.divider} />

          {/* Contenido principal */}
          <div className={styles.body}>
            <p className={styles.text}>{articulo.contenido}</p>
          </div>

          {/* Footer del artículo */}
          <footer className={styles.footer}>
            <div className={styles.shareSection}>
              <span className={styles.shareLabel}>
                <i className="bi bi-share me-2"></i>
                Comparte este artículo:
              </span>
              <div className={styles.shareButtons}>
                <button className={styles.shareButton} title="Compartir en Facebook">
                  <i className="bi bi-facebook"></i>
                </button>
                <button className={styles.shareButton} title="Compartir en Twitter">
                  <i className="bi bi-twitter"></i>
                </button>
                <button className={styles.shareButton} title="Compartir en WhatsApp">
                  <i className="bi bi-whatsapp"></i>
                </button>
                <button className={styles.shareButton} title="Copiar enlace">
                  <i className="bi bi-link-45deg"></i>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
};
