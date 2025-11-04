// Tarjeta individual de producto

import { useState } from 'react';
import type { Producto } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatearPrecio } from '../../services/productService';
import { ProductModal } from './ProductModal';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  producto: Producto;
}

export const ProductCard = ({ producto }: ProductCardProps) => {
  const { agregarProducto } = useCart();
  const [showModal, setShowModal] = useState(false);

  const handleAgregarCarrito = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que abra el modal
    try {
      await agregarProducto(producto.id);
      // Toast notification o feedback visual aquí
      console.log('Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar:', error);
      alert('Error al agregar el producto');
    }
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
            loading="lazy"
          />
          {producto.destacado && (
            <span className={styles.badge}>Destacado</span>
          )}
          {producto.stock === 0 && (
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
              {producto.stock > 0 && producto.stock < 5 && (
                <span className={styles.lowStock}>
                  ¡Solo quedan {producto.stock}!
                </span>
              )}
            </div>
            
            <button
              className={`btn btn-primary btn-sm ${styles.addButton}`}
              onClick={handleAgregarCarrito}
              disabled={producto.stock === 0}
            >
              {producto.stock > 0 ? (
                <>
                  <i className="bi bi-cart-plus"></i> Agregar
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
        />
      )}
    </>
  );
};
