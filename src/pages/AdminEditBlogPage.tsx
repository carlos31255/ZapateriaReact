// Página para editar o crear entradas del blog

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerArticulosBlog } from '../data/database';
import type { CategoriaBlog } from '../types';
import styles from './AdminEditBlogPage.module.css';

interface BlogEntry {
  id: number;
  titulo: string;
  resumen: string;
  imagen: string;
  fecha: string;
  autor: string;
  contenido: string;
  categoria: CategoriaBlog;
}

export const AdminEditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<BlogEntry>({
    id: 0,
    titulo: '',
    resumen: '',
    imagen: '',
    fecha: new Date().toISOString(),
    autor: 'StepStyle Team',
    contenido: '',
    categoria: 'consejos'
  });

  useEffect(() => {
    if (!isNew && id) {
      const articulos = obtenerArticulosBlog();
      const articulo = articulos.find(a => a.id === parseInt(id));
      if (articulo) {
        setFormData({
          ...articulo,
          autor: articulo.autor || 'StepStyle Team'
        });
      }
    }
  }, [id, isNew]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const articulos = obtenerArticulosBlog();

    if (isNew) {
      // Crear nueva entrada
      const newEntry = {
        ...formData,
        id: Math.max(0, ...articulos.map(a => a.id)) + 1,
        fecha: new Date().toISOString()
      };
      articulos.push(newEntry);
    } else {
      // Actualizar entrada existente
      const index = articulos.findIndex(a => a.id === formData.id);
      if (index !== -1) {
        articulos[index] = formData;
      }
    }

    localStorage.setItem('articulosBlog', JSON.stringify(articulos));
    alert(`Entrada ${isNew ? 'creada' : 'actualizada'} exitosamente`);
    navigate('/admin/blog');
  };

  return (
    <div className="container py-5">
      <header className={styles.header}>
        <h1 className={styles.title}>
          <i className="bi bi-pencil-square me-3"></i>
          {isNew ? 'Nueva Entrada de Blog' : 'Editar Entrada de Blog'}
        </h1>
        <p className={styles.subtitle}>
          {isNew ? 'Crea una nueva entrada para el blog' : 'Modifica el contenido de la entrada'}
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Título */}
          <div className={styles.formGroup}>
            <label htmlFor="titulo">
              <i className="bi bi-text-left me-2"></i>
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Título atractivo para la entrada"
              required
            />
          </div>

          {/* Autor */}
          <div className={styles.formGroup}>
            <label htmlFor="autor">
              <i className="bi bi-person me-2"></i>
              Autor *
            </label>
            <input
              type="text"
              id="autor"
              value={formData.autor}
              onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
              placeholder="Nombre del autor"
              required
            />
          </div>

          {/* Imagen URL */}
          <div className={styles.formGroupFull}>
            <label htmlFor="imagen">
              <i className="bi bi-image me-2"></i>
              URL de Imagen *
            </label>
            <input
              type="url"
              id="imagen"
              value={formData.imagen}
              onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
            {formData.imagen && (
              <div className={styles.imagePreview}>
                <img src={formData.imagen} alt="Preview" />
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className={styles.formGroupFull}>
            <label htmlFor="resumen">
              <i className="bi bi-text-paragraph me-2"></i>
              Resumen Breve *
            </label>
            <textarea
              id="resumen"
              rows={3}
              value={formData.resumen}
              onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
              placeholder="Breve resumen de la entrada (máx. 200 caracteres)"
              maxLength={200}
              required
            />
            <small className={styles.charCount}>
              {formData.resumen.length}/200 caracteres
            </small>
          </div>

          {/* Categoría */}
          <div className={styles.formGroup}>
            <label htmlFor="categoria">
              <i className="bi bi-tag me-2"></i>
              Categoría *
            </label>
            <select
              id="categoria"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value as CategoriaBlog })}
              required
            >
              <option value="tendencias">Tendencias</option>
              <option value="cuidado">Cuidado</option>
              <option value="consejos">Consejos</option>
              <option value="estilo">Estilo</option>
            </select>
          </div>

          {/* Contenido */}
          <div className={styles.formGroupFull}>
            <label htmlFor="contenido">
              <i className="bi bi-file-text me-2"></i>
              Contenido Completo *
            </label>
            <textarea
              id="contenido"
              rows={12}
              value={formData.contenido}
              onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
              placeholder="Escribe el contenido completo de la entrada del blog..."
              required
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className={styles.cancelButton}
          >
            <i className="bi bi-x-lg me-2"></i>
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => navigate('/preview/blog')}
            className={styles.previewButton}
          >
            <i className="bi bi-eye me-2"></i>
            Vista Previa
          </button>
          <button type="submit" className={styles.saveButton}>
            <i className="bi bi-check-lg me-2"></i>
            {isNew ? 'Publicar' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};
