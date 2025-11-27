// Página de productos con filtros y lista de productos

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductList, ProductFilter } from '../components/products/products-components.index';
import { useProducts } from '../hooks';
import type { FilterState } from '../components/products/products-components.index';
import type { CategoriaProducto } from '../types';

export const ProductosPage = () => {
  const { productos, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const [filtros, setFiltros] = useState<FilterState>({
    categoria: 'todos',
    busqueda: '',
    ordenar: 'recientes'
  });

  // Actualizar filtros desde URL al montar
  useEffect(() => {
    const categoria = searchParams.get('categoria');
    if (categoria && categoria !== 'todos') {
      setFiltros(prev => ({ ...prev, categoria: categoria as CategoriaProducto | 'todos' }));
    }
  }, [searchParams]);

  // Filtrar y ordenar productos usando useMemo
  const productosFiltrados = useMemo(() => {
    let resultado = [...productos];

    // Filtrar por categoría
    if (filtros.categoria !== 'todos') {
      resultado = resultado.filter(p => p.categoria === filtros.categoria);
    }

    // Filtrar por búsqueda
    if (filtros.busqueda.trim()) {
      const terminoBusqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(producto =>
        producto.nombre.toLowerCase().includes(terminoBusqueda) ||
        producto.descripcion.toLowerCase().includes(terminoBusqueda) ||
        producto.categoria.toLowerCase().includes(terminoBusqueda)
      );
    }

    // Ordenar según criterio seleccionado
    switch (filtros.ordenar) {
      case 'precio-asc':
        return resultado.sort((a, b) => a.precio - b.precio);
      case 'precio-desc':
        return resultado.sort((a, b) => b.precio - a.precio);
      case 'nombre':
        return resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'recientes':
      default:
        return resultado.sort((a, b) => b.id - a.id);
    }
  }, [productos, filtros]);

  const handleFilterChange = (nuevosFiltros: FilterState) => {
    setFiltros(nuevosFiltros);
  };

  return (
    // Contenedor principal de la página
    <main className="container py-5">
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
          categoriaInicial={filtros.categoria}
        />
      </nav>

      {/* Sección de lista de productos */}
      <section>
        <ProductList productos={productosFiltrados} loading={loading} />
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
