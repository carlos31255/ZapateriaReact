// Tarjeta individual de producto

import { useState } from 'react';
import type { Producto } from '../../types';
import { formatearPrecio } from '../../helpers/productService';
import { ProductModal } from './ProductModal';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  producto: Producto;
  previewMode?: boolean;
}

export const ProductCard = ({ producto, previewMode = false }: ProductCardProps) => {
  const [showModal, setShowModal] = useState(false);

  // Verificar si hay stock disponible
  // Si tiene stockPorTalla, usar ese; si no, usar stock general
  const hayStockDisponible = producto.stockPorTalla 
    ? producto.stockPorTalla.some(t => t.stock > 0)
    : producto.stock > 0;
  
  const stockTotal = producto.stockPorTalla
    ? producto.stockPorTalla.reduce((sum, t) => sum + t.stock, 0)
    : producto.stock;

  const handleAgregarCarrito = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que abra el modal
    // Para agregar desde la card, necesitamos abrir el modal para seleccionar talla
    setShowModal(true);
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className={styles.card} onClick={handleCardClick}>
        {/* Imagen del producto */}
        <div className={styles.imageLink}>
          <img 
            src={producto.imagen} 
            alt={producto.nombre}
            className={styles.image}
            loading={producto.destacado ? "eager" : "lazy"}
            fetchPriority={producto.destacado ? "high" : "auto"}
          />
          {producto.destacado && (
            <span className={styles.badge}>Destacado</span>
          )}
          {!hayStockDisponible && (
            <div className={styles.outOfStock}>Sin Stock</div>
          )}
        </div>
        
        {/* Contenido */}
        <div className={styles.content}>
          {/* Categoría */}
          <span className={styles.category}>{producto.categoria}</span>
          
          {/* Título */}
          <h3 className={styles.title}>{producto.nombre}</h3>
          
          {/* Descripción */}
          <p className={styles.description}>{producto.descripcion}</p>
          
          {/* Footer con precio y botón */}
          <div className={styles.footer}>
            <div className={styles.priceContainer}>
              <span className={styles.price}>
                {formatearPrecio(producto.precio)}
              </span>
              {stockTotal > 0 && stockTotal < 10 && (
                <span className={styles.lowStock}>
                  ¡Pocas unidades!
                </span>
              )}
            </div>
            
            <button
              className={`btn btn-primary btn-sm ${styles.addButton}`}
              onClick={handleAgregarCarrito}
              disabled={!hayStockDisponible || previewMode}
              title={previewMode ? 'Función deshabilitada en modo vista previa' : ''}
            >
              {hayStockDisponible ? (
                <>
                  <i className="bi bi-cart-plus"></i> {previewMode ? 'Ver más' : 'Agregar'}
                </>
              ) : (
                'Sin stock'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalles del producto */}
      {showModal && (
        <ProductModal 
          producto={producto} 
          onClose={() => setShowModal(false)}
          previewMode={previewMode}
        />
      )}
    </>
  );
};
