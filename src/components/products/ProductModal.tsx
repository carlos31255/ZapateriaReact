// Modal flotante para mostrar detalles del producto

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatearPrecio } from '../../helpers/productService';
import type { Producto, TallaCalzado } from '../../types';
import styles from './ProductModal.module.css';

interface ProductModalProps {
  producto: Producto;
  onClose: () => void;
  previewMode?: boolean;
}

export const ProductModal = ({ producto, onClose, previewMode = false }: ProductModalProps) => {
  const { agregarProducto } = useCart();
  const [tallaSeleccionada, setTallaSeleccionada] = useState<TallaCalzado | null>(null);
  const [cantidad, setCantidad] = useState(1);

  // Verificar si el producto maneja tallas
  const manejaTallas = producto.stockPorTalla && producto.stockPorTalla.length > 0;
  
  // Obtener tallas disponibles (con stock > 0)
  const tallasDisponibles = manejaTallas 
    ? producto.stockPorTalla!.filter(t => t.stock > 0) 
    : [];
  
  const stockDisponible = manejaTallas && tallaSeleccionada
    ? producto.stockPorTalla!.find(t => t.talla === tallaSeleccionada)?.stock || 0
    : producto.stock;

  // Verificar si el producto tiene stock (considerando productos con y sin tallas)
  const tieneStock = manejaTallas 
    ? tallasDisponibles.length > 0 
    : producto.stock > 0;

  const handleAgregarCarrito = async () => {
    // Si maneja tallas, debe seleccionar una
    if (manejaTallas && !tallaSeleccionada) {
      alert('Por favor selecciona una talla');
      return;
    }

    try {
      // Agregar al carrito con o sin talla según corresponda
      await agregarProducto(producto.id, cantidad, tallaSeleccionada || undefined);
      console.log('Producto agregado al carrito', tallaSeleccionada ? `con talla: ${tallaSeleccionada}` : 'sin talla');
      onClose();
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
            {!tieneStock && (
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
            </div>

            {/* Descripción */}
            <div className={styles.description}>
              <h3 className={styles.descriptionTitle}>
                <i className="bi bi-info-circle me-2"></i>
                Descripción
              </h3>
              <p>{producto.descripcion}</p>
            </div>

            {/* Selector de Tallas */}
            {manejaTallas && tieneStock && (
              <div className={styles.sizesSection}>
                <h3 className={styles.sizesTitle}>
                  <i className="bi bi-rulers me-2"></i>
                  Selecciona tu talla
                </h3>
                <div className={styles.sizesGrid}>
                  {tallasDisponibles.map((item) => (
                    <button
                      key={item.talla}
                      className={`${styles.sizeButton} ${tallaSeleccionada === item.talla ? styles.sizeSelected : ''}`}
                      onClick={() => setTallaSeleccionada(item.talla)}
                      type="button"
                    >
                      <span className={styles.sizeNumber}>{item.talla}</span>
                      <span className={styles.sizeStock}>({item.stock})</span>
                    </button>
                  ))}
                </div>
                {tallaSeleccionada && (
                  <p className={styles.sizeInfo}>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Talla {tallaSeleccionada} seleccionada - {stockDisponible} disponibles
                  </p>
                )}
              </div>
            )}

            {/* Selector de Cantidad - Solo se muestra si hay stock disponible */}
            {tieneStock && stockDisponible > 0 && (!manejaTallas || tallaSeleccionada) && (
              <div className={styles.quantitySection}>
                <label className={styles.quantityLabel}>
                  <i className="bi bi-123 me-2"></i>
                  Cantidad:
                </label>
                <div className={styles.quantityControls}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    type="button"
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input
                    type="number"
                    className={styles.quantityInput}
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.max(1, Math.min(stockDisponible, Number(e.target.value))))}
                    min="1"
                    max={stockDisponible}
                  />
                  <button
                    className={styles.quantityButton}
                    onClick={() => setCantidad(Math.min(stockDisponible, cantidad + 1))}
                    type="button"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Botón agregar al carrito */}
            <button
              className={`btn btn-primary btn-lg w-100 ${styles.addButton}`}
              onClick={handleAgregarCarrito}
              disabled={!tieneStock || stockDisponible === 0 || previewMode || (manejaTallas && !tallaSeleccionada)}
              title={
                previewMode 
                  ? 'Función deshabilitada en modo vista previa' 
                  : !tieneStock
                    ? 'Producto sin stock'
                  : manejaTallas && !tallaSeleccionada 
                    ? 'Selecciona una talla primero' 
                    : ''
              }
            >
              {previewMode ? (
                <>
                  <i className="bi bi-eye me-2"></i>
                  Modo Vista Previa - Compra Deshabilitada
                </>
              ) : !tieneStock || stockDisponible === 0 ? (
                <>
                  <i className="bi bi-x-circle me-2"></i>
                  Producto Sin Stock
                </>
              ) : manejaTallas && !tallaSeleccionada ? (
                <>
                  <i className="bi bi-cart-plus me-2"></i>
                  Selecciona una Talla
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus me-2"></i>
                  Agregar al Carrito ({cantidad})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
