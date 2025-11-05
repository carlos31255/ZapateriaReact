// Página de productos en modo vista previa (sin botón de compra)

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { buscarProductos, ordenarPorPrecio } from '../helpers/productService';
import { ProductList, ProductFilter } from '../components/products/products-components.index';
import type { FilterState } from '../components/products/products-components.index';
import type { CategoriaProducto } from '../types';

export const PreviewProductosPage = () => {
  const [searchParams] = useSearchParams();
  const { productos: todosLosProductos } = useDatabase();
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

  // Filtrar y ordenar productos
  const productosFiltrados = useMemo(() => {
    let resultado = [...todosLosProductos];

    // Filtrar por búsqueda
    if (filtros.busqueda.trim()) {
      resultado = buscarProductos(resultado, filtros.busqueda);
    }

    // Filtrar por categoría
    if (filtros.categoria !== 'todos') {
      resultado = resultado.filter(p => p.categoria === filtros.categoria);
    }

    // Ordenar según criterio seleccionado
    if (filtros.ordenar === 'precio-asc') {
      resultado = ordenarPorPrecio(resultado, 'asc');
    } else if (filtros.ordenar === 'precio-desc') {
      resultado = ordenarPorPrecio(resultado, 'desc');
    } else if (filtros.ordenar === 'nombre') {
      resultado = resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else {
      // recientes: ordenar por ID descendente (más reciente primero)
      resultado = resultado.sort((a, b) => b.id - a.id);
    }

    return resultado;
  }, [todosLosProductos, filtros]);

  const handleFilterChange = (nuevosFiltros: FilterState) => {
    setFiltros(nuevosFiltros);
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
          categoriaInicial={filtros.categoria}
        />
      </nav>

      {/* Sección de lista de productos */}
      <section>
        <ProductList 
          productos={productosFiltrados} 
          loading={false}
          previewMode={true}
        />
      </section>

      {/* Footer: Contador de resultados */}
      {productosFiltrados.length > 0 && (
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
