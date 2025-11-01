// PÁGINA DE NOSOTROS

export const NosotrosPage = () => {
  return (
    <div className="container">
      <div className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-5">Sobre StepStyle</h1>
          <p className="lead">Tu tienda de confianza para calzado de calidad</p>
        </div>

        <section className="mb-5">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2>Nuestra Historia</h2>
              <p>
                StepStyle nace de la pasión por el calzado de calidad y el servicio al cliente.
                Desde nuestros inicios, nos hemos dedicado a ofrecer los mejores productos
                del mercado, combinando estilo, comodidad y durabilidad.
              </p>
              <p>
                Con años de experiencia en la industria del calzado, entendemos las necesidades
                de nuestros clientes y trabajamos constantemente para superarlas.
              </p>
            </div>
            <div className="col-md-6">
              <img 
                src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600" 
                alt="Tienda" 
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="row text-center">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">Misión</h3>
                  <p className="card-text">
                    Proporcionar calzado de alta calidad que combine estilo, comodidad y durabilidad,
                    superando las expectativas de nuestros clientes en cada paso.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">Visión</h3>
                  <p className="card-text">
                    Ser la tienda de calzado preferida a nivel nacional, reconocida por nuestra
                    excelencia en productos, servicio al cliente e innovación constante.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-center mb-4">Desarrollado por</h2>
          <div className="row justify-content-center">
            <div className="col-md-4 text-center mb-4">
              <div className="card">
                <div className="card-body">
                  <h4>Equipo StepStyle</h4>
                  <p className="text-muted">Desarrollo Web</p>
                  <p>Proyecto desarrollado con React y TypeScript</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
