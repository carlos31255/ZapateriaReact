// Página de productos en modo vista previa (sin botón de compra)

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProductos, fetchProductosPorCategoria, buscarProductos } from '../services/productService';
import { ProductList, ProductFilter } from '../components/products/products-components.index';
import type { FilterState } from '../components/products/products-components.index';
import type { Producto, CategoriaProducto } from '../types';

export const PreviewProductosPage = () => {
  const [searchParams] = useSearchParams();
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActual, setCategoriaActual] = useState<CategoriaProducto | 'todos'>('todos');

  // Cargar productos al montar
  useEffect(() => {
    const categoria = searchParams.get('categoria');
    if (categoria && categoria !== 'todos') {
      setCategoriaActual(categoria as CategoriaProducto);
      cargarProductosPorCategoria(categoria);
    } else {
      setCategoriaActual('todos');
      cargarProductos();
    }
  }, [searchParams]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await fetchProductos();
      if (response.success && response.data) {
        setProductosFiltrados(response.data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarProductosPorCategoria = async (categoria: string) => {
    try {
      setLoading(true);
      const response = await fetchProductosPorCategoria(categoria as CategoriaProducto);
      if (response.success && response.data) {
        setProductosFiltrados(response.data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (filtros: FilterState) => {
    try {
      setLoading(true);
      let productosResultado: Producto[] = [];

      if (filtros.busqueda.trim()) {
        const response = await buscarProductos(filtros.busqueda);
        if (response.success && response.data) {
          productosResultado = response.data;
        }
      } else if (filtros.categoria !== 'todos') {
        const response = await fetchProductosPorCategoria(filtros.categoria);
        if (response.success && response.data) {
          productosResultado = response.data;
        }
      } else {
        const response = await fetchProductos();
        if (response.success && response.data) {
          productosResultado = response.data;
        }
      }

      productosResultado = ordenarProductos(productosResultado, filtros.ordenar);
      setProductosFiltrados(productosResultado);
    } catch (error) {
      console.error('Error al filtrar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const ordenarProductos = (
    productos: Producto[], 
    ordenar: FilterState['ordenar']
  ): Producto[] => {
    const productosOrdenados = [...productos];

    switch (ordenar) {
      case 'precio-asc':
        return productosOrdenados.sort((a, b) => a.precio - b.precio);
      case 'precio-desc':
        return productosOrdenados.sort((a, b) => b.precio - a.precio);
      case 'nombre':
        return productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'recientes':
      default:
        return productosOrdenados.sort((a, b) => b.id - a.id);
    }
  };

  return (
    // Contenedor principal de la página
    <main className="container py-5">
      {/* Banner de información de modo preview */}
      <div className="alert alert-info mb-4" role="alert">
        <i className="bi bi-eye me-2"></i>
        <strong>Modo Vista Previa:</strong> Los botones de compra están deshabilitados
      </div>

      {/* Encabezado de la página */}
      <header className="mb-4">
        <h1 className="display-5 fw-bold mb-2">
          <i className="bi bi-grid-3x3-gap me-3"></i>
          Nuestros Productos
        </h1>
        <p className="text-muted">
          Descubre nuestra colección de calzado de alta calidad
        </p>
      </header>

      {/* Sección de filtros */}
      <nav aria-label="Filtros de productos">
        <ProductFilter 
          onFilterChange={handleFilterChange} 
          categoriaInicial={categoriaActual}
        />
      </nav>

      {/* Sección de lista de productos */}
      <section>
        <ProductList 
          productos={productosFiltrados} 
          loading={loading}
          previewMode={true}
        />
      </section>

      {/* Footer: Contador de resultados */}
      {!loading && productosFiltrados.length > 0 && (
        <footer className="text-center mt-4">
          <p className="text-muted">
            <i className="bi bi-check-circle me-2"></i>
            Mostrando {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
          </p>
        </footer>
      )}
    </main>
  );
};
