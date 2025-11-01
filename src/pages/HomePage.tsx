// PÁGINA DE INICIO

export const HomePage = () => {
  return (
    <div className="container">
      <section className="hero text-center py-5">
        <h1 className="display-4 mb-4">Encuentra el par perfecto</h1>
        <p className="lead mb-4">
          Descubre nuestra colección de zapatos de alta calidad para hombre y mujer.
          Diseño, comodidad y estilo en un solo lugar.
        </p>
        <a href="/productos" className="btn btn-primary btn-lg">
          Ver Productos
        </a>
      </section>

      <section className="my-5">
        <h2 className="text-center mb-4">Productos Destacados</h2>
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-muted">Cargando productos destacados...</p>
          </div>
        </div>
      </section>
    </div>
  );
};
