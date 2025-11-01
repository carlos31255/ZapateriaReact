// ============================================
// PÁGINA DE PRODUCTOS
// ============================================

export const ProductosPage = () => {
  return (
    <div className="container">
      <div className="py-5">
        <h1 className="mb-4">Nuestros Productos</h1>
        
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex gap-3 flex-wrap">
              <select className="form-select" style={{ width: 'auto' }}>
                <option value="todos">Todas las categorías</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="niños">Niños</option>
                <option value="deportivos">Deportivos</option>
              </select>
              
              <input 
                type="text" 
                className="form-control" 
                placeholder="Buscar productos..."
                style={{ width: 'auto', flex: 1, maxWidth: '300px' }}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 text-center">
            <p className="text-muted">Cargando productos...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
