import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/products/products-components.index';
import { fetchProductos } from '../services/productService';
import type { Producto } from '../types';

export const HomePage = () => {
  const [productosDestacados, setProductosDestacados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductosDestacados();
  }, []);

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
    <div className="container">
      <section className="hero text-center py-5">
        <h1 className="display-4 mb-4">Encuentra el par perfecto</h1>
        <p className="lead mb-4">
          Descubre nuestra colección de zapatos de alta calidad para hombre y mujer.
          Diseño, comodidad y estilo en un solo lugar.
        </p>
        <Link to="/productos" className="btn btn-primary btn-lg">
          Ver Productos
        </Link>
      </section>

      <section className="my-5">
        <h2 className="text-center mb-4">Productos Destacados</h2>
        {loading ? (
          <div className="row">
            <div className="col-12 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          </div>
        ) : productosDestacados.length === 0 ? (
          <div className="row">
            <div className="col-12 text-center">
              <p className="text-muted">No hay productos destacados disponibles.</p>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {productosDestacados.map((producto) => (
              <div key={producto.id} className="col">
                <ProductCard producto={producto} />
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-4">
          <Link to="/productos" className="btn btn-outline-primary">
            Ver Todos los Productos
          </Link>
        </div>
      </section>
    </div>
  );
};
