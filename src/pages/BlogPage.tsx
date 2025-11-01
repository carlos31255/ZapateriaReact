// PÁGINA DEL BLOG
export const BlogPage = () => {
  return (
    <div className="container">
      <div className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-5">Blog</h1>
          <p className="lead">Tendencias y consejos de calzado</p>
        </div>

        <div className="mb-4">
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <button className="btn btn-outline-primary active">Todos</button>
            <button className="btn btn-outline-primary">Tendencias</button>
            <button className="btn btn-outline-primary">Cuidado</button>
            <button className="btn btn-outline-primary">Consejos</button>
            <button className="btn btn-outline-primary">Estilo</button>
          </div>
        </div>

        <div className="row">
          <div className="col-12 text-center">
            <p className="text-muted">Cargando artículos...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
