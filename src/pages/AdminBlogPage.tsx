// Página de gestión de entradas del blog

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerArticulosBlog } from '../data/database';
import styles from './AdminBlogPage.module.css';

interface BlogEntry {
  id: number;
  titulo: string;
  resumen?: string;
  descripcion?: string;
  imagen: string;
  fecha: string;
  autor: string;
  contenido: string;
  categoria?: string;
}

export const AdminBlogPage = () => {
  const [entradas, setEntradas] = useState<BlogEntry[]>([]);

  useEffect(() => {
    // Registrar visita a esta página
    const link = '/admin/blog';
    const saved = localStorage.getItem('admin_recent_pages');
    let recentLinks = saved ? JSON.parse(saved) : [];
    recentLinks = recentLinks.filter((l: string) => l !== link);
    recentLinks.unshift(link);
    recentLinks = recentLinks.slice(0, 10);
    localStorage.setItem('admin_recent_pages', JSON.stringify(recentLinks));

    cargarEntradas();
  }, []);

  const cargarEntradas = () => {
    // Usar la base de datos existente del sistema
    const articulos = obtenerArticulosBlog();
    // Mapear a formato compatible
    const articulosFormateados = articulos.map(a => ({
      ...a,
      descripcion: a.resumen,
      autor: a.autor || 'StepStyle Team'
    }));
    setEntradas(articulosFormateados);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta entrada?')) {
      // Eliminar del localStorage usando la función de la base de datos
      const articulos = obtenerArticulosBlog();
      const nuevosArticulos = articulos.filter(a => a.id !== id);
      localStorage.setItem('articulosBlog', JSON.stringify(nuevosArticulos));
      cargarEntradas();
    }
  };

  return (
    <div className="container py-5">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <i className="bi bi-newspaper me-3"></i>
            Gestión de Blog
          </h1>
          <p className={styles.subtitle}>
            Administra las entradas del blog
          </p>
        </div>
        <Link to="/admin/blog/new" className={styles.addButton}>
          <i className="bi bi-plus-lg me-2"></i>
          Nueva Entrada
        </Link>
      </header>

      <div className={styles.grid}>
        {entradas.map((entrada) => (
          <div key={entrada.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img src={entrada.imagen} alt={entrada.titulo} className={styles.image} />
            </div>
            <div className={styles.content}>
              <h3 className={styles.entryTitle}>{entrada.titulo}</h3>
              <p className={styles.description}>{entrada.descripcion || entrada.resumen}</p>
              <div className={styles.meta}>
                <span>
                  <i className="bi bi-person me-1"></i>
                  {entrada.autor}
                </span>
                <span>
                  <i className="bi bi-calendar me-1"></i>
                  {new Date(entrada.fecha).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className={styles.actions}>
                <Link to={`/admin/blog/edit/${entrada.id}`} className={styles.editButton}>
                  <i className="bi bi-pencil"></i>
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(entrada.id)}
                  className={styles.deleteButton}
                >
                  <i className="bi bi-trash"></i>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {entradas.length === 0 && (
        <div className={styles.empty}>
          <i className="bi bi-inbox"></i>
          <p>No hay entradas de blog</p>
          <Link to="/admin/blog/new" className={styles.emptyButton}>
            Crear Primera Entrada
          </Link>
        </div>
      )}
    </div>
  );
};
