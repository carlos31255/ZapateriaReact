// Resumen del carrito con totales

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { usePedidos } from '../../hooks/usePedidos';
import { useProducts } from '../../hooks/useProducts';
import { formatearPrecio } from '../../helpers/productService';
import styles from './CartSummary.module.css';

interface CartSummaryProps {
  onCheckout?: () => void;
}

export const CartSummary = ({ onCheckout }: CartSummaryProps) => {
  const navigate = useNavigate();
  const { carrito, vaciarCarrito } = useCart();
  const { usuario } = useAuth();
  const { crearPedido } = usePedidos();
  const { obtenerProductoPorId, actualizarProducto } = useProducts();
  const [procesando, setProcesando] = useState(false);

  const subtotal = carrito.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const descuento = 0; // Aquí puedes calcular descuentos
  const envio = subtotal > 50000 ? 0 : 3000; // Envío gratis sobre $50.000
  const total = subtotal - descuento + envio;

  const handleCheckout = async () => {
    // Si no está autenticado, redirigir a login
    if (!usuario) {
      // Mostrar alerta antes de redirigir
      alert('Debes iniciar sesión primero para continuar con el pago');
      navigate('/login');
      return;
    }

    // Si está autenticado, proceder con el checkout
    if (onCheckout) {
      onCheckout();
      return;
    }

    // Lógica por defecto de checkout
    try {
      setProcesando(true);
      console.log('Procesando pago...');

      // 1. Verificar y actualizar stock de cada producto
      for (const item of carrito.items) {
        const producto = obtenerProductoPorId(item.id);
        if (!producto) {
          alert(`Error: El producto "${item.nombre}" ya no está disponible.`);
          setProcesando(false);
          return;
        }

        // Verificar si hay stock suficiente
        if (item.tallaSeleccionada && producto.stockPorTalla) {
          // Producto con tallas
          const tallaStock = producto.stockPorTalla.find(t => t.talla === item.tallaSeleccionada);
          if (!tallaStock || tallaStock.stock < item.cantidad) {
            alert(`Error: Stock insuficiente para "${item.nombre}" talla ${item.tallaSeleccionada}.`);
            setProcesando(false);
            return;
          }
          // Actualizar stock de la talla
          const nuevasStockPorTalla = producto.stockPorTalla.map(t =>
            t.talla === item.tallaSeleccionada ? { ...t, stock: t.stock - item.cantidad } : t
          );
          const nuevoStockTotal = nuevasStockPorTalla.reduce((sum: number, t) => sum + t.stock, 0);
          actualizarProducto(item.id, {
            stockPorTalla: nuevasStockPorTalla,
            stock: nuevoStockTotal
          });
        } else {
          // Producto sin tallas
          if (producto.stock < item.cantidad) {
            alert(`Error: Stock insuficiente para "${item.nombre}".`);
            setProcesando(false);
            return;
          }
          // Actualizar stock general
          actualizarProducto(item.id, { stock: producto.stock - item.cantidad });
        }
      }

      // 2. Crear el pedido
      const nuevoPedido = await crearPedido({
        usuarioId: usuario.id,
        nombreUsuario: usuario.nombre,
        emailUsuario: usuario.email,
        items: carrito.items,
        subtotal,
        descuento,
        total,
        estado: 'pendiente',
        direccionEnvio: usuario.direccion || ''
      });

      if (!nuevoPedido) {
        alert('Error al crear el pedido');
        setProcesando(false);
        return;
      }

      // 3. Vaciar el carrito
      vaciarCarrito();

      // 4. Mostrar mensaje de éxito
      alert(`¡Pago procesado exitosamente! 🎉\n\nNúmero de pedido: ${nuevoPedido.id}\nTotal: ${formatearPrecio(total)}\n\nPuedes ver tu pedido en tu perfil.`);

      // 5. Redirigir al perfil
      navigate('/perfil');

    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
    } finally {
      setProcesando(false);
    }
  };

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
        onClick={handleCheckout}
        disabled={carrito.items.length === 0 || procesando}
      >
        {procesando ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Procesando pago...
          </>
        ) : (
          <>
            <i className="bi bi-credit-card"></i>
            {!usuario ? 'Iniciar Sesión para Pagar' : 'Proceder al Pago'}
          </>
        )}
      </button>

      {/* Mensaje para usuarios no autenticados */}
      {!usuario && carrito.items.length > 0 && (
        <div className="alert alert-info mt-3 mb-0" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          <small>Debes iniciar sesión para continuar con el pago</small>
        </div>
      )}

      {/* Seguridad */}
      <div className={styles.security}>
        <i className="bi bi-shield-check"></i>
        <span>Compra 100% segura</span>
      </div>
    </div>
  );
};
