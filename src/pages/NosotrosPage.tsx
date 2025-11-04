// Página informativa sobre la empresa StepStyle

import { useState } from 'react';

export const NosotrosPage = () => {
  // Estado para controlar qué modal está abierto
  const [activeModal, setActiveModal] = useState<'historia' | 'mision' | 'vision' | 'tecnologia' | null>(null);

  // Función para cerrar modal
  const closeModal = () => setActiveModal(null);

  // Función para manejar click en el overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

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
        <article 
          className="card shadow-sm border-0"
          style={{ 
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '';
          }}
          onClick={() => setActiveModal('historia')}
        >
          <div className="card-body p-4">
            <div className="row align-items-center g-4">
              {/* Columna de texto con historia */}
              <div className="col-md-6">
                <h2 className="h3 mb-3">
                  <i className="bi bi-clock-history me-2 text-primary"></i>
                  Nuestra Historia
                </h2>
                <p className="text-muted mb-3">
                  StepStyle nace de la pasión por el calzado de calidad y el servicio al cliente.
                  Desde nuestros inicios en <strong>2020</strong>, nos hemos dedicado a ofrecer los mejores productos
                  del mercado, combinando <strong>estilo</strong>, <strong>comodidad</strong> y <strong>durabilidad</strong>.
                </p>
                <div className="text-center mt-3">
                  <small className="text-primary fw-semibold">
                    <i className="bi bi-hand-index me-1"></i>
                    Click para conocer más detalles
                  </small>
                </div>
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
            </div>
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
            <article 
              className="card h-100 shadow-sm border-0"
              style={{ 
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(230, 57, 70, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '';
              }}
              onClick={() => setActiveModal('mision')}
            >
              <div className="card-body p-4">
                <div className="mb-3">
                  <i className="bi bi-rocket-takeoff fs-1 text-primary"></i>
                </div>
                <h3 className="h4 card-title mb-3">Misión</h3>
                <p className="card-text text-muted mb-3">
                  Proporcionar calzado de alta calidad que combine estilo, comodidad y durabilidad...
                </p>
                <small className="text-primary fw-semibold">
                  <i className="bi bi-hand-index me-1"></i>
                  Click para ver más
                </small>
              </div>
            </article>
          </div>
          {/* Tarjeta de Visión */}
          <div className="col-md-6">
            <article 
              className="card h-100 shadow-sm border-0"
              style={{ 
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(230, 57, 70, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '';
              }}
              onClick={() => setActiveModal('vision')}
            >
              <div className="card-body p-4">
                <div className="mb-3">
                  <i className="bi bi-eye fs-1 text-primary"></i>
                </div>
                <h3 className="h4 card-title mb-3">Visión</h3>
                <p className="card-text text-muted mb-3">
                  Ser la tienda de calzado preferida a nivel nacional, reconocida por nuestra excelencia...
                </p>
                <small className="text-primary fw-semibold">
                  <i className="bi bi-hand-index me-1"></i>
                  Click para ver más
                </small>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Sección 3: Información del desarrollo */}
      <section className="mb-5">
        <h2 className="h3 text-center mb-4">
          <i className="bi bi-code-slash me-2 text-primary"></i>
          Tecnología y Desarrollo
        </h2>
        <div className="row justify-content-center g-4">
          <div className="col-md-8 col-lg-6">
            <article 
              className="card shadow-sm border-0"
              style={{ 
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
              onClick={() => setActiveModal('tecnologia')}
            >
              <div className="card-body text-center p-4">
                <div 
                  className="mb-3"
                  style={{ 
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <i className="bi bi-laptop fs-1 text-primary"></i>
                </div>
                <h3 className="h5 mb-3">Equipo StepStyle</h3>
                <p className="text-muted mb-3">
                  <i className="bi bi-briefcase me-2"></i>
                  Desarrollo Web Full Stack
                </p>
                <p className="small text-muted mb-3">
                  Plataforma moderna construida con las últimas tecnologías web para 
                  brindarte la mejor experiencia de compra online.
                </p>

                <small className="text-primary fw-semibold">
                  <i className="bi bi-hand-index me-1"></i>
                  Click para conocer el stack tecnológico
                </small>
              </div>
            </article>
          </div>

          {/* Nueva sección: Valores del equipo */}
          <div className="col-12">
            <div className="row g-3 mt-2">
              <div className="col-md-3 col-6">
                <div 
                  className="card text-center shadow-sm border-0 h-100"
                  style={{ 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'white';
                    const icon = e.currentTarget.querySelector('i');
                    if (icon) icon.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '';
                    const icon = e.currentTarget.querySelector('i');
                    if (icon) icon.style.color = '';
                  }}
                >
                  <div className="card-body p-3">
                    <i className="bi bi-lightning fs-2 text-warning mb-2" style={{ transition: 'color 0.3s ease' }}></i>
                    <h5 className="h6 mb-1">Innovación</h5>
                    <p className="small mb-0 text-muted">Tecnología de punta</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div 
                  className="card text-center shadow-sm border-0 h-100"
                  style={{ 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'white';
                    const icon = e.currentTarget.querySelector('i');
                    if (icon) icon.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '';
                    const icon = e.currentTarget.querySelector('i');
                    if (icon) icon.style.color = '';
                  }}
                >
                  <div className="card-body p-3">
                    <i className="bi bi-shield-check fs-2 text-success mb-2" style={{ transition: 'color 0.3s ease' }}></i>
                    <h5 className="h6 mb-1">Seguridad</h5>
                    <p className="small mb-0 text-muted">Datos protegidos</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div 
                  className="card text-center shadow-sm border-0 h-100"
                  style={{ 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'white';
                    const icon = e.currentTarget.querySelector('i');
                    if (icon) icon.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '';
                    const icon = e.currentTarget.querySelector('i');
                    if (icon) icon.style.color = '';
                  }}
                >
                  <div className="card-body p-3">
                    <i className="bi bi-speedometer2 fs-2 text-info mb-2" style={{ transition: 'color 0.3s ease' }}></i>
                    <h5 className="h6 mb-1">Velocidad</h5>
                    <p className="small mb-0 text-muted">Carga rápida</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div 
                  className="card text-center shadow-sm border-0 h-100"
                  style={{ 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'white';
                    const icon = e.currentTarget.querySelector('i');
                    if (icon) icon.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '';
                    const icon = e.currentTarget.querySelector('i');
                    if (icon) icon.style.color = '';
                  }}
                >
                  <div className="card-body p-3">
                    <i className="bi bi-phone fs-2 text-danger mb-2" style={{ transition: 'color 0.3s ease' }}></i>
                    <h5 className="h6 mb-1">Responsive</h5>
                    <p className="small mb-0 text-muted">Multi-dispositivo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MODALES FLOTANTES ==================== */}
      
      {/* Overlay oscuro de fondo */}
      {activeModal && (
        <div 
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {/* Modal de Historia */}
          {activeModal === 'historia' && (
            <div 
              className="card shadow-lg"
              style={{
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                animation: 'slideDown 0.4s ease'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h3 className="h4 mb-0">
                  <i className="bi bi-clock-history me-2"></i>
                  Nuestra Historia
                </h3>
                <button 
                  onClick={closeModal}
                  className="btn btn-sm btn-light"
                  style={{ borderRadius: '50%', width: '35px', height: '35px' }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="card-body p-4">
                <img 
                  src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800" 
                  alt="Historia de StepStyle" 
                  className="img-fluid rounded mb-4 shadow"
                />
                
                <p className="text-muted mb-3">
                  StepStyle nace de la pasión por el calzado de calidad y el servicio al cliente.
                  Desde nuestros inicios en <strong>2020</strong>, nos hemos dedicado a ofrecer los mejores productos
                  del mercado, combinando <strong>estilo</strong>, <strong>comodidad</strong> y <strong>durabilidad</strong>.
                </p>
                
                <p className="text-muted mb-4">
                  Con años de experiencia en la industria del calzado, entendemos las necesidades
                  de nuestros clientes y trabajamos constantemente para superarlas. Nuestro equipo
                  está formado por expertos apasionados que seleccionan cuidadosamente cada producto.
                </p>

                <div className="bg-light p-3 rounded mb-4">
                  <h4 className="h5 mb-3">
                    <i className="bi bi-trophy me-2 text-warning"></i>
                    Nuestros Logros
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-people-fill"></i>
                        </div>
                        <div>
                          <strong className="d-block">+10,000</strong>
                          <small className="text-muted">Clientes satisfechos</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-bag-fill"></i>
                        </div>
                        <div>
                          <strong className="d-block">+500</strong>
                          <small className="text-muted">Modelos en catálogo</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-star-fill"></i>
                        </div>
                        <div>
                          <strong className="d-block">98%</strong>
                          <small className="text-muted">Satisfacción del cliente</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <div>
                          <strong className="d-block">3 Regiones</strong>
                          <small className="text-muted">Presencia en Chile</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary bg-opacity-10 p-3 rounded mb-4">
                  <h4 className="h5 mb-3">
                    <i className="bi bi-calendar-event me-2 text-primary"></i>
                    Línea de Tiempo
                  </h4>
                  <div className="timeline">
                    <div className="d-flex gap-3 mb-3">
                      <div className="text-primary fw-bold" style={{ minWidth: '60px' }}>2020</div>
                      <div className="flex-grow-1">
                        <strong className="d-block">Fundación de StepStyle</strong>
                        <p className="text-muted small mb-0">Nace el sueño de crear la mejor zapatería online de Chile</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3 mb-3">
                      <div className="text-primary fw-bold" style={{ minWidth: '60px' }}>2021</div>
                      <div className="flex-grow-1">
                        <strong className="d-block">Apertura tienda online</strong>
                        <p className="text-muted small mb-0">Lanzamiento oficial de nuestra plataforma e-commerce</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3 mb-3">
                      <div className="text-primary fw-bold" style={{ minWidth: '60px' }}>2023</div>
                      <div className="flex-grow-1">
                        <strong className="d-block">Expansión a 3 regiones</strong>
                        <p className="text-muted small mb-0">Crecimiento y cobertura nacional</p>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <div className="text-primary fw-bold" style={{ minWidth: '60px' }}>2025</div>
                      <div className="flex-grow-1">
                        <strong className="d-block">Renovación plataforma web</strong>
                        <p className="text-muted small mb-0">Nueva tecnología React 19 y mejor experiencia de usuario</p>
                      </div>
                    </div>
                  </div>
                </div>

                <blockquote className="border-start border-primary border-4 ps-3 mb-0">
                  <p className="mb-2 fst-italic">
                    "Cada paso cuenta, y queremos que des los tuyos con el mejor calzado posible."
                  </p>
                  <footer className="blockquote-footer">Equipo StepStyle</footer>
                </blockquote>
              </div>
            </div>
          )}

          {/* Modal de Misión */}
          {activeModal === 'mision' && (
            <div 
              className="card shadow-lg"
              style={{
                maxWidth: '600px',
                width: '100%',
                animation: 'slideDown 0.4s ease'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h3 className="h4 mb-0">
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Nuestra Misión
                </h3>
                <button 
                  onClick={closeModal}
                  className="btn btn-sm btn-light"
                  style={{ borderRadius: '50%', width: '35px', height: '35px' }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <i className="bi bi-rocket-takeoff" style={{ fontSize: '4rem', color: 'var(--color-primary)' }}></i>
                </div>
                
                <p className="text-muted mb-4 lead">
                  Proporcionar calzado de alta calidad que combine estilo, comodidad y durabilidad,
                  superando las expectativas de nuestros clientes en cada paso.
                </p>

                <h5 className="h6 mb-3">Nuestros Pilares:</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="text-center p-3 bg-light rounded">
                      <i className="bi bi-gem fs-2 text-primary mb-2 d-block"></i>
                      <strong>Calidad</strong>
                      <p className="small text-muted mb-0">Productos premium</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 bg-light rounded">
                      <i className="bi bi-palette fs-2 text-primary mb-2 d-block"></i>
                      <strong>Estilo</strong>
                      <p className="small text-muted mb-0">Diseños actuales</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 bg-light rounded">
                      <i className="bi bi-shield-check fs-2 text-primary mb-2 d-block"></i>
                      <strong>Durabilidad</strong>
                      <p className="small text-muted mb-0">Larga vida útil</p>
                    </div>
                  </div>
                </div>

                <div className="alert alert-primary mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Cada producto que ofrecemos pasa por rigurosos controles de calidad para garantizar tu satisfacción.
                </div>
              </div>
            </div>
          )}

          {/* Modal de Visión */}
          {activeModal === 'vision' && (
            <div 
              className="card shadow-lg"
              style={{
                maxWidth: '600px',
                width: '100%',
                animation: 'slideDown 0.4s ease'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h3 className="h4 mb-0">
                  <i className="bi bi-eye me-2"></i>
                  Nuestra Visión
                </h3>
                <button 
                  onClick={closeModal}
                  className="btn btn-sm btn-light"
                  style={{ borderRadius: '50%', width: '35px', height: '35px' }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <i className="bi bi-eye" style={{ fontSize: '4rem', color: 'var(--color-primary)' }}></i>
                </div>
                
                <p className="text-muted mb-4 lead">
                  Ser la tienda de calzado preferida a nivel nacional, reconocida por nuestra
                  excelencia en productos, servicio al cliente e innovación constante.
                </p>

                <h5 className="h6 mb-3">Objetivos a Futuro:</h5>
                <ul className="list-unstyled mb-4">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Expandir presencia a todo Chile
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Implementar realidad aumentada para prueba virtual
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Desarrollar línea de calzado sustentable
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Alcanzar 50,000 clientes satisfechos
                  </li>
                  <li className="mb-0">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Apertura de tiendas físicas en principales ciudades
                  </li>
                </ul>

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="text-center p-2 border rounded">
                      <i className="bi bi-trophy fs-3 text-warning d-block mb-1"></i>
                      <strong className="small">Excelencia</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-2 border rounded">
                      <i className="bi bi-lightbulb fs-3 text-warning d-block mb-1"></i>
                      <strong className="small">Innovación</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-2 border rounded">
                      <i className="bi bi-graph-up-arrow fs-3 text-warning d-block mb-1"></i>
                      <strong className="small">Liderazgo</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Tecnología */}
          {activeModal === 'tecnologia' && (
            <div 
              className="card shadow-lg"
              style={{
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                animation: 'slideDown 0.4s ease'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h3 className="h4 mb-0">
                  <i className="bi bi-laptop me-2"></i>
                  Tecnología y Desarrollo
                </h3>
                <button 
                  onClick={closeModal}
                  className="btn btn-sm btn-light"
                  style={{ borderRadius: '50%', width: '35px', height: '35px' }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="card-body p-4">
                <p className="text-muted mb-4">
                  Plataforma moderna construida con las últimas tecnologías web para 
                  brindarte la mejor experiencia de compra online.
                </p>

                <h5 className="h5 mb-3">
                  <i className="bi bi-stack me-2 text-primary"></i>
                  Stack Tecnológico
                </h5>
                <div className="row g-2 mb-4">
                  <div className="col-6 col-md-4">
                    <div className="p-3 bg-info bg-opacity-10 rounded text-center">
                      <i className="bi bi-filetype-jsx fs-2 text-info d-block mb-2"></i>
                      <strong>React 19</strong>
                      <p className="small text-muted mb-0">Biblioteca UI</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="p-3 bg-primary bg-opacity-10 rounded text-center">
                      <i className="bi bi-code-square fs-2 text-primary d-block mb-2"></i>
                      <strong>TypeScript</strong>
                      <p className="small text-muted mb-0">Tipado estático</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="p-3 bg-warning bg-opacity-10 rounded text-center">
                      <i className="bi bi-lightning-charge-fill fs-2 text-warning d-block mb-2"></i>
                      <strong>Vite</strong>
                      <p className="small text-muted mb-0">Build tool</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="p-3 bg-purple bg-opacity-10 rounded text-center">
                      <i className="bi bi-bootstrap-fill fs-2 text-purple d-block mb-2"></i>
                      <strong>Bootstrap 5</strong>
                      <p className="small text-muted mb-0">Framework CSS</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="p-3 bg-danger bg-opacity-10 rounded text-center">
                      <i className="bi bi-signpost-split-fill fs-2 text-danger d-block mb-2"></i>
                      <strong>React Router</strong>
                      <p className="small text-muted mb-0">Navegación SPA</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="p-3 bg-success bg-opacity-10 rounded text-center">
                      <i className="bi bi-cloud-arrow-up-fill fs-2 text-success d-block mb-2"></i>
                      <strong>Context API</strong>
                      <p className="small text-muted mb-0">Estado global</p>
                    </div>
                  </div>
                </div>

                <h5 className="h5 mb-3">
                  <i className="bi bi-check-circle me-2 text-success"></i>
                  Características Principales
                </h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-phone text-primary fs-5"></i>
                      <div>
                        <strong className="d-block">Responsive Design</strong>
                        <p className="small text-muted mb-0">Adaptable a todos los dispositivos</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-shield-lock text-primary fs-5"></i>
                      <div>
                        <strong className="d-block">Autenticación Segura</strong>
                        <p className="small text-muted mb-0">Sistema de usuarios robusto</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-cart-check text-primary fs-5"></i>
                      <div>
                        <strong className="d-block">Carrito en Tiempo Real</strong>
                        <p className="small text-muted mb-0">Actualización instantánea</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-speedometer2 text-primary fs-5"></i>
                      <div>
                        <strong className="d-block">Alto Rendimiento</strong>
                        <p className="small text-muted mb-0">Carga ultra rápida</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info mb-0">
                  <i className="bi bi-code-slash me-2"></i>
                  Desarrollado con las mejores prácticas de la industria y optimizado para SEO.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estilos de animación */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-50px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
