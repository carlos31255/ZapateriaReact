// Resumen del carrito con totales

import { useCart } from '../../context/CartContext';
import { formatearPrecio } from '../../services/productService';
import styles from './CartSummary.module.css';

interface CartSummaryProps {
  onCheckout?: () => void;
}

export const CartSummary = ({ onCheckout }: CartSummaryProps) => {
  const { carrito } = useCart();

  const subtotal = carrito.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const descuento = 0; // Aquí puedes calcular descuentos
  const envio = subtotal > 50000 ? 0 : 3000; // Envío gratis sobre $50.000
  const total = subtotal - descuento + envio;

  return (
    <div className={styles.summary}>
      <h3 className={styles.title}>Resumen del Pedido</h3>
      
      <div className={styles.details}>
        {/* Subtotal */}
        <div className={styles.row}>
          <span className={styles.label}>Subtotal</span>
          <span className={styles.value}>{formatearPrecio(subtotal)}</span>
        </div>

        {/* Descuento */}
        {descuento > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>Descuento</span>
            <span className={`${styles.value} ${styles.discount}`}>
              -{formatearPrecio(descuento)}
            </span>
          </div>
        )}

        {/* Envío */}
        <div className={styles.row}>
          <span className={styles.label}>Envío</span>
          <span className={styles.value}>
            {envio === 0 ? (
              <span className={styles.freeShipping}>¡Gratis!</span>
            ) : (
              formatearPrecio(envio)
            )}
          </span>
        </div>

        {/* Mensaje envío gratis */}
        {envio > 0 && subtotal < 50000 && (
          <div className={styles.freeShippingMessage}>
            <i className="bi bi-truck"></i>
            <span>
              Añade {formatearPrecio(50000 - subtotal)} más para envío gratis
            </span>
          </div>
        )}

        <div className={styles.divider}></div>

        {/* Total */}
        <div className={`${styles.row} ${styles.totalRow}`}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>{formatearPrecio(total)}</span>
        </div>
      </div>

      {/* Botón */}
      <button 
        className={`btn btn-primary w-100 ${styles.checkoutBtn}`}
        onClick={onCheckout}
        disabled={carrito.items.length === 0}
      >
        <i className="bi bi-credit-card"></i>
        Proceder al Pago
      </button>

      {/* Seguridad */}
      <div className={styles.security}>
        <i className="bi bi-shield-check"></i>
        <span>Compra 100% segura</span>
      </div>
    </div>
  );
};
