// Lista de productos con grid responsive

import { ProductCard } from './ProductCard';
import type { Producto } from '../../types';
import styles from './ProductList.module.css';

interface ProductListProps {
  productos: Producto[];
  loading?: boolean;
  previewMode?: boolean;
}

export const ProductList = ({ productos, loading = false, previewMode = false }: ProductListProps) => {
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </div>
        <p className="mt-3">Cargando productos...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className={styles.empty}>
        <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#ccc' }}></i>
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {productos.map((producto) => (
        <ProductCard 
          key={producto.id} 
          producto={producto} 
          previewMode={previewMode}
        />
      ))}
    </div>
  );
};
