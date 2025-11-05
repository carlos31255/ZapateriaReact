// Página de blog con artículos sobre calzado

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BlogCard } from '../components/blog/blog-components.index';
import { obtenerArticulos, obtenerArticulosPorCategoria } from '../services/blogService';
import { EditButton } from '../components/admin/EditButton';
import type { ArticuloBlog, CategoriaBlog } from '../types';

type FilterCategory = CategoriaBlog | 'todos';

export const BlogPage = () => {
  const location = useLocation();
  const isPreviewMode = location.pathname.includes('/preview');
  const [articulos, setArticulos] = useState<ArticuloBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState<FilterCategory>('todos');

  // Cargar artículos al montar
  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      setLoading(true);
      const response = await obtenerArticulos();
      if (response.success && response.data) {
        setArticulos(response.data);
      }
    } catch (error) {
      console.error('Error al cargar artículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (categoria: FilterCategory) => {
    try {
      setLoading(true);
      setCategoriaActiva(categoria);
      
      const response = await obtenerArticulosPorCategoria(categoria);
      if (response.success && response.data) {
        setArticulos(response.data);
      }
    } catch (error) {
      console.error('Error al filtrar artículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorias = [
    { key: 'todos' as FilterCategory, label: 'Todos', icon: 'bi-grid-3x3-gap' },
    { key: 'tendencias' as FilterCategory, label: 'Tendencias', icon: 'bi-star' },
    { key: 'cuidado' as FilterCategory, label: 'Cuidado', icon: 'bi-heart' },
    { key: 'consejos' as FilterCategory, label: 'Consejos', icon: 'bi-lightbulb' },
    { key: 'estilo' as FilterCategory, label: 'Estilo', icon: 'bi-palette' }
  ];

  return (
    // Contenedor principal
    <div className="container py-5">
      {/* Botón de edición flotante (solo en modo preview) */}
      {isPreviewMode && (
        <EditButton 
          editPath="/admin/blog" 
          label="Gestionar Blog" 
        />
      )}

      {/* Encabezado de la página */}
      <header className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">
          <i className="bi bi-journal-text me-3"></i>
          Blog StepStyle
        </h1>
        <p className="lead text-muted">
          Tendencias, consejos y todo sobre el mundo del calzado
        </p>
      </header>

      {/* Filtros de categorías de blog */}
      <nav className="mb-5" aria-label="Filtros de categoría">
        <div className="d-flex gap-2 justify-content-center flex-wrap">
          {categorias.map((cat) => (
            <button
              key={cat.key}
              className={`btn ${categoriaActiva === cat.key ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleFilterChange(cat.key)}
            >
              <i className={`bi ${cat.icon} me-2`}></i>
              {cat.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Sección de artículos del blog */}
      <section>
        {loading ? (
          // Estado de carga
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted">Cargando artículos...</p>
            </div>
          </div>
        ) : articulos.length === 0 ? (
          // Sin resultados
          <div className="row">
            <div className="col-12 text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
              <p className="text-muted">No hay artículos disponibles en esta categoría.</p>
            </div>
          </div>
        ) : (
          // Grid de artículos
          <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {articulos.map((articulo) => (
                <div key={articulo.id} className="col">
                  <BlogCard articulo={articulo} />
                </div>
              ))}
            </div>

            {/* Footer: Contador de resultados */}
            <footer className="text-center mt-5">
              <p className="text-muted">
                <i className="bi bi-check-circle me-2"></i>
                Mostrando {articulos.length} {articulos.length === 1 ? 'artículo' : 'artículos'}
                {categoriaActiva !== 'todos' && ` en ${categoriaActiva}`}
              </p>
            </footer>
          </>
        )}
      </section>
    </div>
  );
};
