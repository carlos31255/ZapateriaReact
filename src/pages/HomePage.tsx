import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ProductCard } from '../components/products/products-components.index';
import { useProducts } from '../hooks';
import type { Producto } from '../types';

export const HomePage = () => {
  const { fetchProductos } = useProducts();
  // Estado para productos destacados y carga
  const [productosDestacados, setProductosDestacados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Detectar si estamos en modo preview
  const location = useLocation();
  const isPreviewMode = location.pathname.includes('/preview');
  
  // Ruta de productos según el modo
  const productosRoute = isPreviewMode ? '/preview/productos' : '/productos';

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductosDestacados();
  }, []);

  // Obtiene productos destacados desde el servicio
  const cargarProductosDestacados = async () => {
    try {
      const response = await fetchProductos();
      if (response.data) {
        // Filtrar solo los productos destacados y tomar los primeros 4
        const destacados = response.data.filter((p: Producto) => p.destacado).slice(0, 4);
        setProductosDestacados(destacados);
      }
    } catch (error) {
      console.error('Error al cargar productos destacados:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor principal de la página
    <main className="container">
      {/* Sección Hero: Bienvenida y llamado a la acción */}
      <section className="hero text-center py-5">
        <header className="mb-4">
          <h1 className="display-4 fw-bold mb-3">
            Encuentra el par perfecto
          </h1>
          <p className="lead text-muted">
            Descubre nuestra colección de zapatos de alta calidad para hombre y mujer.
            Diseño, comodidad y estilo en un solo lugar.
          </p>
        </header>
        <Link to={productosRoute} className="btn btn-primary btn-lg">
          <i className="bi bi-bag me-2"></i>
          Ver Productos
        </Link>
      </section>

      {/* Sección: Productos Destacados */}
      <section className="my-5">
        <header className="text-center mb-4">
          <h2 className="h3">
            <i className="bi bi-star-fill me-2 text-warning"></i>
            Productos Destacados
          </h2>
        </header>

        {/* Estado: Cargando productos */}
        {loading ? (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted">Cargando productos destacados...</p>
            </div>
          </div>
        ) : productosDestacados.length === 0 ? (
          /* Estado: Sin productos destacados */
          <div className="row">
            <div className="col-12 text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
              <p className="text-muted">No hay productos destacados disponibles.</p>
            </div>
          </div>
        ) : (
          /* Grid de productos destacados */
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {productosDestacados.map((producto) => (
              <div key={producto.id} className="col">
                <ProductCard producto={producto} previewMode={isPreviewMode} />
              </div>
            ))}
          </div>
        )}
        
        {/* Botón para ver todos los productos */}
        <footer className="text-center mt-4">
          <Link to={productosRoute} className="btn btn-outline-primary">
            <i className="bi bi-arrow-right-circle me-2"></i>
            Ver Todos los Productos
          </Link>
        </footer>
      </section>
    </main>
  );
};
