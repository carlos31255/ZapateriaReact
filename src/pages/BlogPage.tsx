// Página de blog con artículos sobre calzado

export const BlogPage = () => {
  return (
    // Contenedor principal
    <div className="container py-5">
      {/* Encabezado de la página */}
      <header className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">
          <i className="bi bi-journal-text me-3"></i>
          Blog
        </h1>
        <p className="lead text-muted">
          Tendencias y consejos de calzado
        </p>
      </header>

      {/* Filtros de categorías de blog */}
      <nav className="mb-5" aria-label="Filtros de categoría">
        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <button className="btn btn-outline-primary active">
            <i className="bi bi-grid-3x3-gap me-2"></i>
            Todos
          </button>
          <button className="btn btn-outline-primary">
            <i className="bi bi-star me-2"></i>
            Tendencias
          </button>
          <button className="btn btn-outline-primary">
            <i className="bi bi-heart me-2"></i>
            Cuidado
          </button>
          <button className="btn btn-outline-primary">
            <i className="bi bi-lightbulb me-2"></i>
            Consejos
          </button>
          <button className="btn btn-outline-primary">
            <i className="bi bi-palette me-2"></i>
            Estilo
          </button>
        </div>
      </nav>

      {/* Sección de artículos del blog */}
      <section>
        <div className="row">
          <div className="col-12 text-center">
            {/* Estado de carga placeholder */}
            <div className="py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted">Cargando artículos...</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
