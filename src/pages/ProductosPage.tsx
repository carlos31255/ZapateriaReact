// Pagina de productos con filtros y lista de productos

import { useState, useEffect } from 'react';
import { ProductList, ProductFilter } from '../components/products/products-components.index';
import { fetchProductos, fetchProductosPorCategoria, buscarProductos } from '../services/productService';
import type { FilterState }  from '../components/products/products-components.index';
import type { Producto } from '../types';

export const ProductosPage = () => {
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos al montar
  useEffect(() => {
    cargarProductos();
  }, []);

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

  // Manejar cambios de filtros
  const handleFilterChange = async (filtros: FilterState) => {
    try {
      setLoading(true);
      let productosResultado: Producto[] = [];

      // Aplicar búsqueda si existe
      if (filtros.busqueda.trim()) {
        const response = await buscarProductos(filtros.busqueda);
        if (response.success && response.data) {
          productosResultado = response.data;
        }
      } else if (filtros.categoria !== 'todos') {
        // Filtrar por categoría
        const response = await fetchProductosPorCategoria(filtros.categoria);
        if (response.success && response.data) {
          productosResultado = response.data;
        }
      } else {
        // Obtener todos
        const response = await fetchProductos();
        if (response.success && response.data) {
          productosResultado = response.data;
        }
      }

      // Aplicar ordenamiento
      productosResultado = ordenarProductos(productosResultado, filtros.ordenar);
      
      setProductosFiltrados(productosResultado);
    } catch (error) {
      console.error('Error al filtrar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función de ordenamiento
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
    <div className="container py-5">
      <div className="mb-4">
        <h1 className="display-5 fw-bold mb-2">Nuestros Productos</h1>
        <p className="text-muted">
          Descubre nuestra colección de calzado de alta calidad
        </p>
      </div>

      {/* Filtros */}
      <ProductFilter onFilterChange={handleFilterChange} />

      {/* Lista de productos */}
      <ProductList productos={productosFiltrados} loading={loading} />

      {/* Contador de resultados */}
      {!loading && productosFiltrados.length > 0 && (
        <div className="text-center mt-4 text-muted">
          Mostrando {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
        </div>
      )}
    </div>
  );
};
