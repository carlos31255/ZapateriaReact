// PÁGINA DEL CARRITO

export const CarritoPage = () => {
  return (
    <div className="container">
      <div className="py-5">
        <h1 className="mb-4">Carrito de Compras</h1>
        
        <div className="row">
          <div className="col-md-8">
            <div className="text-center py-5">
              <h3>Tu carrito está vacío</h3>
              <p className="text-muted">¿Por qué no explores nuestros productos?</p>
              <a href="/productos" className="btn btn-primary">
                Ver Productos
              </a>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Resumen del Pedido</h5>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>$0</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Descuento:</span>
                  <span>$0</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>$0</span>
                </div>
                <button className="btn btn-primary w-100 mt-3" disabled>
                  Proceder al Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
