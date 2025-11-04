import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validarFormularioLogin } from '../utils/validations/validations.index';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    contrasena: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    
    // Validar formulario
    const validationErrors = validarFormularioLogin(formData.email, formData.contrasena);
    
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }
    
    setLoading(true);

    try {
      const usuario = await iniciarSesion(formData);
      
      // Redirigir según el rol del usuario
      if (usuario && usuario.rol === 'administrador') {
        navigate('/admin');
      } else if (usuario && usuario.rol === 'vendedor') {
        navigate('/productos');
      } else {
        navigate('/');
      }
    } catch (err) {
      setGeneralError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    
    // Validar campo individual
    const validationErrors = validarFormularioLogin(formData.email, formData.contrasena);
    const fieldError = validationErrors.find(error => error.field === name);
    
    if (fieldError) {
      setErrors({
        ...errors,
        [name]: fieldError.message
      });
    }
  };

  return (
    // Contenedor principal centrado
    <div className="container">
      {/* Fila centrada con padding vertical */}
      <div className="row justify-content-center py-5">
        {/* Columna responsiva: 6/12 en medium, 5/12 en large */}
        <div className="col-md-6 col-lg-5">
          {/* Tarjeta de login con sombra */}
          <article className="card shadow">
            {/* Cuerpo de la tarjeta con padding */}
            <div className="card-body p-4">
              {/* Título principal del formulario */}
              <header className="text-center mb-4">
                <h1 className="h2">Iniciar Sesión</h1>
                <p className="text-muted">Accede a tu cuenta</p>
              </header>
              
              {/* Mensaje de error general (credenciales incorrectas, etc.) */}
              {generalError && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {generalError}
                </div>
              )}

              {/* Formulario de autenticación */}
              <form onSubmit={handleSubmit}>
                {/* Grupo: Campo de Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  {/* Input de email con validación visual Bootstrap */}
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : touched.email && !errors.email ? 'is-valid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="ejemplo@correo.com"
                    autoComplete="email"
                  />
                  {/* Mensaje de error específico del email */}
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Grupo: Campo de Contraseña */}
                <div className="mb-3">
                  <label htmlFor="contrasena" className="form-label">
                    Contraseña
                  </label>
                  {/* Input de contraseña con validación visual */}
                  <input
                    type="password"
                    className={`form-control ${errors.contrasena ? 'is-invalid' : touched.contrasena && !errors.contrasena ? 'is-valid' : ''}`}
                    id="contrasena"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  {/* Mensaje de error específico de contraseña */}
                  {errors.contrasena && (
                    <div className="invalid-feedback">
                      {errors.contrasena}
                    </div>
                  )}
                </div>

                {/* Botón de submit con estado de carga */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mb-3"
                  disabled={loading}
                >
                  {/* Muestra spinner y texto diferente cuando está cargando */}
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </button>

                {/* Link para registro de nuevos usuarios */}
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/registro" className="text-decoration-none fw-semibold">
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </form>

              {/* Separador visual */}
              <hr className="my-4" />

              {/* Sección de cuentas de prueba para testing */}
              <aside className="text-center">
                <h2 className="h6 text-muted mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Cuentas de prueba:
                </h2>
                {/* Lista de credenciales de prueba por rol */}
                <div className="small text-start">
                  {/* Cuenta Administrador */}
                  <div className="mb-2">
                    <p className="mb-1">
                      <strong className="text-danger">
                        <i className="bi bi-shield-fill-check me-1"></i>
                        Administrador:
                      </strong>
                    </p>
                    <p className="text-muted mb-0">
                      <code>admin@stepstyle.cl</code> / <code>admin123</code>
                    </p>
                  </div>
                  
                  {/* Cuenta Vendedor */}
                  <div className="mb-2">
                    <p className="mb-1">
                      <strong className="text-warning">
                        <i className="bi bi-shop me-1"></i>
                        Vendedor:
                      </strong>
                    </p>
                    <p className="text-muted mb-0">
                      <code>vendedor@stepstyle.cl</code> / <code>vende123</code>
                    </p>
                  </div>
                  
                  {/* Cuenta Cliente */}
                  <div className="mb-0">
                    <p className="mb-1">
                      <strong className="text-primary">
                        <i className="bi bi-person-fill me-1"></i>
                        Cliente:
                      </strong>
                    </p>
                    <p className="text-muted mb-0">
                      <code>cliente@gmail.com</code> / <code>cliente123</code>
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
