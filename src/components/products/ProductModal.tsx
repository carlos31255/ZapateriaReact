// Modal flotante para mostrar detalles del producto

import { useCart } from '../../context/CartContext';
import { formatearPrecio } from '../../services/productService';
import type { Producto } from '../../types';
import styles from './ProductModal.module.css';

interface ProductModalProps {
  producto: Producto;
  onClose: () => void;
}

export const ProductModal = ({ producto, onClose }: ProductModalProps) => {
  const { agregarProducto } = useCart();

  const handleAgregarCarrito = async () => {
    try {
      await agregarProducto(producto.id);
      console.log('Producto agregado al carrito');
      // Opcionalmente cerrar el modal después de agregar
      // onClose();
    } catch (error) {
      console.error('Error al agregar:', error);
      alert('Error al agregar el producto');
    }
  };

  return (
    <>
      {/* Overlay oscuro de fondo */}
      <div className={styles.overlay} onClick={onClose}></div>

      {/* Contenedor del modal */}
      <div className={styles.modal}>
        {/* Botón cerrar */}
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <i className="bi bi-x-lg"></i>
        </button>

        <div className={styles.content}>
          {/* Columna de imagen */}
          <div className={styles.imageContainer}>
            <img 
              src={producto.imagen} 
              alt={producto.nombre}
              className={styles.image}
            />
            {producto.destacado && (
              <span className={styles.badge}>
                <i className="bi bi-star-fill me-1"></i>
                Destacado
              </span>
            )}
            {producto.stock === 0 && (
              <div className={styles.outOfStock}>
                <i className="bi bi-x-circle me-2"></i>
                Sin Stock
              </div>
            )}
          </div>

          {/* Columna de información */}
          <div className={styles.info}>
            {/* Categoría */}
            <span className={styles.category}>
              <i className="bi bi-tag me-1"></i>
              {producto.categoria}
            </span>

            {/* Título */}
            <h2 className={styles.title}>{producto.nombre}</h2>

            {/* Precio */}
            <div className={styles.priceContainer}>
              <span className={styles.price}>
                {formatearPrecio(producto.precio)}
              </span>
              {producto.stock > 0 && producto.stock < 5 && (
                <span className={styles.lowStock}>
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  ¡Solo quedan {producto.stock}!
                </span>
              )}
            </div>

            {/* Descripción */}
            <div className={styles.description}>
              <h3 className={styles.descriptionTitle}>
                <i className="bi bi-info-circle me-2"></i>
                Descripción
              </h3>
              <p>{producto.descripcion}</p>
            </div>

            {/* Stock disponible */}
            {producto.stock > 0 && (
              <div className={styles.stockInfo}>
                <i className="bi bi-box-seam me-2"></i>
                <span>Stock disponible: <strong>{producto.stock}</strong> unidades</span>
              </div>
            )}

            {/* Botón agregar al carrito */}
            <button
              className={`btn btn-primary btn-lg w-100 ${styles.addButton}`}
              onClick={handleAgregarCarrito}
              disabled={producto.stock === 0}
            >
              {producto.stock > 0 ? (
                <>
                  <i className="bi bi-cart-plus me-2"></i>
                  Agregar al Carrito
                </>
              ) : (
                <>
                  <i className="bi bi-x-circle me-2"></i>
                  Producto Sin Stock
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
