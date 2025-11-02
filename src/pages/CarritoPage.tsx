import { useCart } from '../context/CartContext';
import { CartItem, CartSummary } from '../components/cart/cart-components.index';
import { Link } from 'react-router-dom';

export const CarritoPage = () => {
  // Obtener estado del carrito desde contexto
  const { carrito } = useCart();

  return (
    // Contenedor principal de la página
    <main className="container py-5">
      {/* Encabezado de la página */}
      <header className="mb-4">
        <h1 className="h2">
          <i className="bi bi-cart3 me-3"></i>
          Carrito de Compras
        </h1>
      </header>
      
      {/* Grid de dos columnas: Items y Resumen */}
      <div className="row g-4">
        {/* Columna izquierda: Lista de items del carrito */}
        <div className="col-md-8">
          {carrito.items.length === 0 ? (
            /* Estado vacío: Sin productos en el carrito */
            <article className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <i className="bi bi-cart-x fs-1 text-muted mb-3 d-block"></i>
                <h2 className="h4 mb-3">Tu carrito está vacío</h2>
                <p className="text-muted mb-4">
                  ¿Por qué no explores nuestros productos?
                </p>
                <Link to="/productos" className="btn btn-primary">
                  <i className="bi bi-bag me-2"></i>
                  Ver Productos
                </Link>
              </div>
            </article>
          ) : (
            /* Lista de items del carrito */
            <section>
              {carrito.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </section>
          )}
        </div>
        
        {/* Columna derecha: Resumen del pedido */}
        <aside className="col-md-4">
          <CartSummary />
        </aside>
      </div>
    </main>
  );
};
