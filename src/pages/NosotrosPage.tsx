// Página informativa sobre la empresa StepStyle

export const NosotrosPage = () => {
  return (
    // Contenedor principal con padding vertical
    <div className="container py-5">
      {/* Header: Título principal de la página */}
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">
          <i className="bi bi-shop-window me-3"></i>
          Sobre StepStyle
        </h1>
        <p className="lead text-muted">
          Tu tienda de confianza para calzado de calidad
        </p>
        <hr className="w-25 mx-auto mt-4" />
      </header>

      {/* Sección 1: Historia de la empresa */}
      <section className="mb-5">
        <article className="row align-items-center g-4">
          {/* Columna de texto con historia */}
          <div className="col-md-6">
            <h2 className="h3 mb-4">
              <i className="bi bi-clock-history me-2 text-primary"></i>
              Nuestra Historia
            </h2>
            <p className="text-muted mb-3">
              StepStyle nace de la pasión por el calzado de calidad y el servicio al cliente.
              Desde nuestros inicios, nos hemos dedicado a ofrecer los mejores productos
              del mercado, combinando <strong>estilo</strong>, <strong>comodidad</strong> y <strong>durabilidad</strong>.
            </p>
            <p className="text-muted">
              Con años de experiencia en la industria del calzado, entendemos las necesidades
              de nuestros clientes y trabajamos constantemente para superarlas.
            </p>
          </div>
          {/* Columna de imagen representativa */}
          <div className="col-md-6">
            <img 
              src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600" 
              alt="Interior de tienda StepStyle con calzado exhibido" 
              className="img-fluid rounded shadow-lg"
              loading="lazy"
            />
          </div>
        </article>
      </section>

      {/* Sección 2: Misión y Visión */}
      <section className="mb-5">
        <h2 className="h3 text-center mb-4">
          <i className="bi bi-bullseye me-2 text-primary"></i>
          Nuestros Valores
        </h2>
        <div className="row text-center g-4">
          {/* Tarjeta de Misión */}
          <div className="col-md-6">
            <article className="card h-100 shadow-sm border-0">
              <div className="card-body p-4">
                <div className="mb-3">
                  <i className="bi bi-rocket-takeoff fs-1 text-primary"></i>
                </div>
                <h3 className="h4 card-title mb-3">Misión</h3>
                <p className="card-text text-muted">
                  Proporcionar calzado de alta calidad que combine estilo, comodidad y durabilidad,
                  superando las expectativas de nuestros clientes en cada paso.
                </p>
              </div>
            </article>
          </div>
          {/* Tarjeta de Visión */}
          <div className="col-md-6">
            <article className="card h-100 shadow-sm border-0">
              <div className="card-body p-4">
                <div className="mb-3">
                  <i className="bi bi-eye fs-1 text-primary"></i>
                </div>
                <h3 className="h4 card-title mb-3">Visión</h3>
                <p className="card-text text-muted">
                  Ser la tienda de calzado preferida a nivel nacional, reconocida por nuestra
                  excelencia en productos, servicio al cliente e innovación constante.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Sección 3: Información del desarrollo */}
      <section>
        <h2 className="h3 text-center mb-4">
          <i className="bi bi-code-slash me-2 text-primary"></i>
          Desarrollado por
        </h2>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <article className="card shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-laptop fs-1 text-primary"></i>
                </div>
                <h3 className="h5 mb-2">Equipo StepStyle</h3>
                <p className="text-muted mb-2">
                  <i className="bi bi-briefcase me-2"></i>
                  Desarrollo Web
                </p>
                <p className="small text-muted mb-0">
                  <i className="bi bi-code-square me-2"></i>
                  Proyecto desarrollado con <strong>React</strong> y <strong>TypeScript</strong>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};
