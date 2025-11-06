
// Item individual en el carrito

import type { ProductoCarrito } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatearPrecio } from '../../helpers/productService';
import styles from './CartItem.module.css';

interface CartItemProps {
  item: ProductoCarrito;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { actualizarCantidad, eliminarProducto } = useCart();

  const handleCantidadChange = async (nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;
    
    // Verificar stock de la talla específica si existe
    let stockDisponible = item.stock;
    if (item.tallaSeleccionada && item.stockPorTalla) {
      const stockTalla = item.stockPorTalla.find(st => st.talla === item.tallaSeleccionada);
      if (stockTalla) {
        stockDisponible = stockTalla.stock;
      }
    }
    
    if (nuevaCantidad > stockDisponible) {
      alert(`Solo hay ${stockDisponible} unidades disponibles${item.tallaSeleccionada ? ` de la talla ${item.tallaSeleccionada}` : ''}`);
      return;
    }
    try {
      await actualizarCantidad(item.id, nuevaCantidad, item.tallaSeleccionada);
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  const handleEliminar = async () => {
    if (confirm('¿Eliminar este producto del carrito?')) {
      try {
        await eliminarProducto(item.id, item.tallaSeleccionada);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const subtotal = item.precio * item.cantidad;

  return (
    <div className={styles.cartItem}>
      {/* Imagen */}
      <div className={styles.imageContainer}>
        <img 
          src={item.imagen} 
          alt={item.nombre}
          className={styles.image}
        />
      </div>

      {/* Información del producto */}
      <div className={styles.info}>
        <h3 className={styles.name}>{item.nombre}</h3>
        <p className={styles.category}>{item.categoria}</p>
        {item.tallaSeleccionada && (
          <p className={styles.size}>
            <i className="bi bi-rulers me-1"></i>
            Talla: <strong>{item.tallaSeleccionada}</strong>
          </p>
        )}
        <p className={styles.price}>{formatearPrecio(item.precio)}</p>
      </div>

      {/* Controles de cantidad */}
      <div className={styles.controls}>
        <div className={styles.quantityControl}>
          <button
            className={styles.quantityBtn}
            onClick={() => handleCantidadChange(item.cantidad - 1)}
            disabled={item.cantidad <= 1}
          >
            <i className="bi bi-dash"></i>
          </button>
          
          <input
            type="number"
            value={item.cantidad}
            onChange={(e) => handleCantidadChange(parseInt(e.target.value) || 1)}
            className={styles.quantityInput}
            min="1"
            max={item.stock}
          />
          
          <button
            className={styles.quantityBtn}
            onClick={() => handleCantidadChange(item.cantidad + 1)}
            disabled={item.cantidad >= item.stock}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>

        {item.cantidad >= item.stock && (
          <span className={styles.maxStock}>Stock máximo</span>
        )}
      </div>

      {/* Subtotal */}
      <div className={styles.subtotal}>
        <span className={styles.subtotalLabel}>Subtotal:</span>
        <span className={styles.subtotalPrice}>{formatearPrecio(subtotal)}</span>
      </div>

      {/* Botón eliminar */}
      <button
        className={styles.removeBtn}
        onClick={handleEliminar}
        title="Eliminar del carrito"
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
};
