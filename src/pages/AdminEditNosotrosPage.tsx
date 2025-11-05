// Página de edición del contenido de "Nosotros"

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminEditNosotrosPage.module.css';

interface NosotrosContent {
  titulo: string;
  descripcion: string;
  mision: string;
  vision: string;
}

export const AdminEditNosotrosPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<NosotrosContent>({
    titulo: 'Sobre Nosotros',
    descripcion: 'En StepStyle, nos dedicamos a ofrecer el mejor calzado para cada ocasión.',
    mision: 'Proporcionar calzado de alta calidad que combine estilo, comodidad y durabilidad.',
    vision: 'Ser la tienda de calzado líder en el mercado, reconocida por nuestra excelencia y servicio al cliente.'
  });

  useEffect(() => {
    // Cargar contenido desde localStorage
    const savedContent = localStorage.getItem('nosotros_content');
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardar en localStorage
    localStorage.setItem('nosotros_content', JSON.stringify(content));
    alert('Contenido guardado exitosamente');
    navigate('/preview/nosotros');
  };

  return (
    <div className="container py-5">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <i className="bi bi-pencil-square me-3"></i>
            Editar Contenido - Nosotros
          </h1>
          <p className={styles.subtitle}>
            Personaliza la información de la página "Sobre Nosotros"
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Título */}
          <div className={styles.formGroup}>
            <label htmlFor="titulo">Título Principal</label>
            <input
              type="text"
              id="titulo"
              value={content.titulo}
              onChange={(e) => setContent({ ...content, titulo: e.target.value })}
              required
            />
          </div>

          {/* Descripción */}
          <div className={styles.formGroup}>
            <label htmlFor="descripcion">Descripción Breve</label>
            <textarea
              id="descripcion"
              rows={3}
              value={content.descripcion}
              onChange={(e) => setContent({ ...content, descripcion: e.target.value })}
              required
            />
          </div>

          {/* Misión */}
          <div className={styles.formGroup}>
            <label htmlFor="mision">
              <i className="bi bi-bullseye me-2"></i>
              Misión
            </label>
            <textarea
              id="mision"
              rows={4}
              value={content.mision}
              onChange={(e) => setContent({ ...content, mision: e.target.value })}
              required
            />
          </div>

          {/* Visión */}
          <div className={styles.formGroup}>
            <label htmlFor="vision">
              <i className="bi bi-eye me-2"></i>
              Visión
            </label>
            <textarea
              id="vision"
              rows={4}
              value={content.vision}
              onChange={(e) => setContent({ ...content, vision: e.target.value })}
              required
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/preview/nosotros')}
            className={styles.cancelButton}
          >
            <i className="bi bi-x-lg me-2"></i>
            Cancelar
          </button>
          <button type="submit" className={styles.saveButton}>
            <i className="bi bi-check-lg me-2"></i>
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};
