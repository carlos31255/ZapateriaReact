            // Tarjeta individual de artículo del blog

import { useState } from 'react';
import type { ArticuloBlog } from '../../types';
import { formatearFecha } from '../../helpers/blogService';
import { BlogModal } from './BlogModal';
import styles from './BlogCard.module.css';

interface BlogCardProps {
  articulo: ArticuloBlog;
}

export const BlogCard = ({ articulo }: BlogCardProps) => {
  const [showModal, setShowModal] = useState(false);

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
      <article 
        className={styles.card}
        onClick={() => setShowModal(true)}
      >
        {/* Imagen del artículo */}
        <div className={styles.imageContainer}>
          <img 
            src={articulo.imagen} 
            alt={articulo.titulo}
            className={styles.image}
            loading="lazy"
          />
          <div 
            className={styles.categoryBadge}
            style={{ backgroundColor: getCategoryColor(articulo.categoria) }}
          >
            <i className={`bi ${getCategoryIcon(articulo.categoria)} me-1`}></i>
            {articulo.categoria}
          </div>
        </div>

        {/* Contenido del artículo */}
        <div className={styles.content}>
          {/* Meta información */}
          <div className={styles.meta}>
            <span className={styles.date}>
              <i className="bi bi-calendar3 me-1"></i>
              {formatearFecha(articulo.fecha)}
            </span>
            {articulo.autor && (
              <span className={styles.author}>
                <i className="bi bi-person me-1"></i>
                {articulo.autor}
              </span>
            )}
          </div>

          {/* Título */}
          <h3 className={styles.title}>{articulo.titulo}</h3>

          {/* Resumen */}
          <p className={styles.summary}>{articulo.resumen}</p>

          {/* Botón leer más */}
          <div className={styles.readMore}>
            <span>
              Leer artículo completo
              <i className="bi bi-arrow-right ms-2"></i>
            </span>
          </div>
        </div>
      </article>

      {/* Modal del artículo */}
      {showModal && (
        <BlogModal 
          articulo={articulo}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
