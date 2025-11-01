// PÁGINA DE CONTACTO

export const ContactoPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensaje enviado correctamente');
  };

  return (
    <div className="container">
      <div className="py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h1 className="mb-4 text-center">Contáctanos</h1>
            <p className="text-center text-muted mb-4">
              Envíanos un mensaje y te responderemos pronto.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="correo" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="comentario" className="form-label">
                  Mensaje
                </label>
                <textarea
                  className="form-control"
                  id="comentario"
                  rows={5}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
