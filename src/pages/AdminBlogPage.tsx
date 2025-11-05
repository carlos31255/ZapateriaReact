// Página de gestión de entradas del blog

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../hooks';
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
  const { articulosBlog, fetchArticulos, fetchEliminarArticulo } = useBlog();
  const [entradas, setEntradas] = useState<BlogEntry[]>([]);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null);

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

  // Actualizar entradas cuando cambie articulosBlog del Context
  useEffect(() => {
    const articulosFormateados = articulosBlog.map(a => ({
      ...a,
      descripcion: a.resumen,
      autor: a.autor || 'StepStyle Team'
    }));
    setEntradas(articulosFormateados);
  }, [articulosBlog]);

  const cargarEntradas = async () => {
    // Cargar artículos desde el Context
    await fetchArticulos();
  };

  const handleDelete = async (id: number) => {
    // Obtener el título del artículo para el mensaje
    const entrada = entradas.find(e => e.id === id);
    const titulo = entrada?.titulo || 'este artículo';
    
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${titulo}"?\n\nEsta acción no se puede deshacer.`)) {
      try {
        const result = await fetchEliminarArticulo(id);
        if (result.success) {
          // Mostrar mensaje de éxito
          setMensaje({ tipo: 'success', texto: `El artículo "${titulo}" ha sido eliminado correctamente.` });
          
          // No es necesario recargar manualmente, el useEffect lo hará automáticamente
          // al detectar el cambio en articulosBlog
          
          // Limpiar mensaje después de 5 segundos
          setTimeout(() => setMensaje(null), 5000);
        } else {
          // Mostrar mensaje de error
          setMensaje({ tipo: 'error', texto: 'Error al eliminar el artículo. Intenta nuevamente.' });
          setTimeout(() => setMensaje(null), 5000);
        }
      } catch (error) {
        // Manejar errores inesperados
        setMensaje({ tipo: 'error', texto: 'Error inesperado al eliminar el artículo.' });
        setTimeout(() => setMensaje(null), 5000);
      }
    }
  };

  return (
    <div className="container py-5">
      {/* Mensaje de éxito o error */}
      {mensaje && (
        <div 
          className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} 
          role="alert"
        >
          <i className={`bi bi-${mensaje.tipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
          {mensaje.texto}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMensaje(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

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
