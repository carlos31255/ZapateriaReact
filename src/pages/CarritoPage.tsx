import { useCart } from '../context/CartContext';
import { CartItem, CartSummary } from '../components/cart/cart-components.index';
import { Link } from 'react-router-dom';

export const CarritoPage = () => {
  const { carrito } = useCart();

  return (
    <div className="container">
      <div className="py-5">
        <h1 className="mb-4">Carrito de Compras</h1>
        
        <div className="row">
          <div className="col-md-8">
            {carrito.items.length === 0 ? (
              <div className="text-center py-5">
                <h3>Tu carrito está vacío</h3>
                <p className="text-muted">¿Por qué no explores nuestros productos?</p>
                <Link to="/productos" className="btn btn-primary">
                  Ver Productos
                </Link>
              </div>
            ) : (
              <div>
                {carrito.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
          
          <div className="col-md-4">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
};
