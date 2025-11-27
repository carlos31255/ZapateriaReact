// Página de contacto con formulario de comunicación

import { useState } from 'react';
import { contactService, type ContactoData } from '../services/contactService';

export const ContactoPage = () => {
  const [formData, setFormData] = useState<ContactoData>({
    nombre: '',
    correo: '',
    comentario: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Maneja el envío del formulario de contacto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactService.enviarMensaje(formData);
      alert('Mensaje enviado correctamente');
      setFormData({
        nombre: '',
        correo: '',
        comentario: ''
      });
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor principal
    <div className="container py-5">
      {/* Fila centrada para el formulario */}
      <div className="row justify-content-center">
        {/* Columna responsiva para el contenido */}
        <div className="col-md-8 col-lg-6">
          {/* Tarjeta contenedora del formulario */}
          <article className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* Encabezado de la página */}
              <header className="text-center mb-4">
                <h1 className="h2 mb-3">
                  <i className="bi bi-envelope me-2 text-primary"></i>
                  Contáctanos
                </h1>
                <p className="text-muted">
                  Envíanos un mensaje y te responderemos pronto.
                </p>
              </header>

              {/* Formulario de contacto */}
              <form onSubmit={handleSubmit}>
                {/* Campo: Nombre */}
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Campo: Email */}
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">
                    Correo Electrónico <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Campo: Mensaje */}
                <div className="mb-3">
                  <label htmlFor="comentario" className="form-label">
                    Mensaje <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="comentario"
                    name="comentario"
                    value={formData.comentario}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Escribe tu mensaje aquí..."
                    required
                    disabled={loading}
                  ></textarea>
                </div>

                {/* Botón de envío */}
                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
