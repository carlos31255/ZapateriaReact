// Para buscar y filtrar productos

import { useState } from 'react';
import type { CategoriaProducto } from '../../types';
import styles from './ProductFilter.module.css';

interface ProductFilterProps {
  onFilterChange: (filtros: FilterState) => void;
}

export interface FilterState {
  categoria: CategoriaProducto | 'todos';
  busqueda: string;
  ordenar: 'recientes' | 'precio-asc' | 'precio-desc' | 'nombre';
}

export const ProductFilter = ({ onFilterChange }: ProductFilterProps) => {
  const [filtros, setFiltros] = useState<FilterState>({
    categoria: 'todos',
    busqueda: '',
    ordenar: 'recientes'
  });

  const handleCategoriaChange = (categoria: CategoriaProducto | 'todos') => {
    const nuevosFiltros = { ...filtros, categoria };
    setFiltros(nuevosFiltros);
    onFilterChange(nuevosFiltros);
  };

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const busqueda = e.target.value;
    const nuevosFiltros = { ...filtros, busqueda };
    setFiltros(nuevosFiltros);
    onFilterChange(nuevosFiltros);
  };

  const handleOrdenarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ordenar = e.target.value as FilterState['ordenar'];
    const nuevosFiltros = { ...filtros, ordenar };
    setFiltros(nuevosFiltros);
    onFilterChange(nuevosFiltros);
  };

  const limpiarFiltros = () => {
    const filtrosLimpios: FilterState = {
      categoria: 'todos',
      busqueda: '',
      ordenar: 'recientes'
    };
    setFiltros(filtrosLimpios);
    onFilterChange(filtrosLimpios);
  };

  return (
    <div className={styles.filterContainer}>
      {/* Búsqueda */}
      <div className={styles.searchBox}>
        <i className="bi bi-search"></i>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={filtros.busqueda}
          onChange={handleBusquedaChange}
          className={styles.searchInput}
        />
        {filtros.busqueda && (
          <button 
            className={styles.clearButton}
            onClick={() => handleBusquedaChange({ target: { value: '' } } as any)}
          >
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>

      {/* Categorías */}
      <div className={styles.categories}>
        <button
          className={`${styles.categoryBtn} ${filtros.categoria === 'todos' ? styles.active : ''}`}
          onClick={() => handleCategoriaChange('todos')}
        >
          Todos
        </button>
        <button
          className={`${styles.categoryBtn} ${filtros.categoria === 'hombre' ? styles.active : ''}`}
          onClick={() => handleCategoriaChange('hombre')}
        >
          Hombre
        </button>
        <button
          className={`${styles.categoryBtn} ${filtros.categoria === 'mujer' ? styles.active : ''}`}
          onClick={() => handleCategoriaChange('mujer')}
        >
          Mujer
        </button>
        <button
          className={`${styles.categoryBtn} ${filtros.categoria === 'niños' ? styles.active : ''}`}
          onClick={() => handleCategoriaChange('niños')}
        >
          Niños
        </button>
        <button
          className={`${styles.categoryBtn} ${filtros.categoria === 'deportivos' ? styles.active : ''}`}
          onClick={() => handleCategoriaChange('deportivos')}
        >
          Deportivos
        </button>
      </div>

      {/* Ordenar y limpiar */}
      <div className={styles.actions}>
        <select 
          value={filtros.ordenar} 
          onChange={handleOrdenarChange}
          className={styles.sortSelect}
        >
          <option value="recientes">Más recientes</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre A-Z</option>
        </select>

        <button 
          className={styles.clearFilters}
          onClick={limpiarFiltros}
        >
          <i className="bi bi-arrow-clockwise"></i> Limpiar filtros
        </button>
      </div>
    </div>
  );
};
