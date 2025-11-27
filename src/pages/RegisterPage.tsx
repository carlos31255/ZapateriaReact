import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { DatosRegistro } from '../types';
import { validarFormularioRegistro, type DatosRegistroValidacion } from '../utils/validations/validations.index';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { registrarUsuario } = useAuth();

  const [formData, setFormData] = useState<DatosRegistro>({
    run: '',
    nombre: '',
    email: '',
    contrasena: '',
    confirmarContrasena: '',
    genero: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: '',
    telefono: '+56',
    rol: 'cliente'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [emailError, setEmailError] = useState(''); // Error específico de email duplicado
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    // Validar todo el formulario
    const validationErrors = validarFormularioRegistro(formData as DatosRegistroValidacion);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);

      // Mostrar primer error como mensaje general
      setGeneralError('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    setEmailError(''); // Limpiar error previo de email

    try {
      await registrarUsuario(formData);
      navigate('/login');
    } catch (err) {
      const mensajeError = err instanceof Error ? err.message : 'Error al registrar usuario';

      // Si el error es de email duplicado, mostrarlo específicamente en el campo email
      if (mensajeError === 'El email ya está registrado') {
        setEmailError(mensajeError);
      } else {
        setGeneralError(mensajeError);
      }

      // Scroll al top para que el usuario vea el mensaje de error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Manejo especial para el teléfono
    if (name === 'telefono') {
      // Si está vacío, establecer el prefijo por defecto
      if (value === '') {
        setFormData({
          ...formData,
          telefono: '+56'
        });
        return;
      }

      // Asegurar que siempre comience con +56
      let telefonoFormateado = value;
      if (!telefonoFormateado.startsWith('+56')) {
        telefonoFormateado = '+56' + telefonoFormateado.replace(/^\+?56?/, '');
      }

      // Eliminar caracteres no numéricos excepto el +
      telefonoFormateado = '+56' + telefonoFormateado.substring(3).replace(/\D/g, '');

      // Limitar a +56 + 9 dígitos (formato chileno)
      if (telefonoFormateado.length > 12) {
        telefonoFormateado = telefonoFormateado.substring(0, 12);
      }

      setFormData({
        ...formData,
        telefono: telefonoFormateado
      });

      // Limpiar error del campo
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }

      if (generalError) {
        setGeneralError('');
      }

      return;
    }

    // Para otros campos
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

    // Limpiar error de email duplicado si se está editando el email
    if (name === 'email' && emailError) {
      setEmailError('');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });

    // Verificación especial para email: validar formato
    if (name === 'email' && value) {
      const validationErrors = validarFormularioRegistro({ ...formData, email: value } as DatosRegistroValidacion);
      const emailFormatError = validationErrors.find(error => error.field === 'email');

      if (emailFormatError) {
        setErrors({
          ...errors,
          email: emailFormatError.message
        });
        setEmailError('');
        return;
      } else {
        // Email válido
        setEmailError('');
        setErrors({
          ...errors,
          email: ''
        });
        return;
      }
    }

    // Validar el formulario completo y encontrar errores del campo actual
    const validationErrors = validarFormularioRegistro(formData as DatosRegistroValidacion);
    const fieldError = validationErrors.find(error => error.field === name);

    if (fieldError) {
      setErrors({
        ...errors,
        [name]: fieldError.message
      });
    } else if (touched[name]) {
      // Si el campo estaba marcado como tocado y ahora no tiene error, limpiarlo
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    // Contenedor principal centrado con Bootstrap
    <div className="container">
      {/* Fila con justificación centrada y padding vertical */}
      <div className="row justify-content-center py-5">
        {/* Columna responsiva: 8/12 en medium, 7/12 en large */}
        <div className="col-md-8 col-lg-7">
          {/* Article semántico para el formulario completo con sombra */}
          <article className="card shadow">
            {/* Cuerpo de la tarjeta con padding */}
            <div className="card-body p-4">
              {/* Encabezado del formulario */}
              <header className="text-center mb-4">
                <h1 className="h2">Crear Cuenta</h1>
                <p className="text-muted">Completa el formulario para registrarte</p>
              </header>

              {/* Mensaje de error general (se muestra si hay error en el submit) */}
              {generalError && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {generalError}
                </div>
              )}

              {/* Formulario principal de registro */}
              <form onSubmit={handleSubmit}>
                {/* SECCIÓN 1: Información Personal */}
                <fieldset className="mb-4">
                  {/* Título de la sección con borde inferior */}
                  <legend className="h5 mb-3 pb-2 border-bottom">Información Personal</legend>

                  {/* Fila: RUN y Nombre (2 columnas en pantallas medianas) */}
                  <div className="row mb-3">
                    {/* Campo RUN - 6/12 columnas en medium */}
                    <div className="col-md-6">
                      <label htmlFor="run" className="form-label">
                        RUN <span className="text-danger">*</span>
                      </label>
                      {/* Input con validación visual (is-valid/is-invalid de Bootstrap) */}
                      <input
                        type="text"
                        className={`form-control ${errors.run ? 'is-invalid' : touched.run && !errors.run ? 'is-valid' : ''}`}
                        id="run"
                        name="run"
                        value={formData.run}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="12345678-9"
                        aria-describedby="runHelp"
                      />
                      {/* Mensaje de error específico del campo */}
                      {errors.run && (
                        <div className="invalid-feedback">
                          {errors.run}
                        </div>
                      )}
                    </div>
                    {/* Campo Nombre - 6/12 columnas en medium */}
                    <div className="col-md-6">
                      <label htmlFor="nombre" className="form-label">
                        Nombre Completo <span className="text-danger">*</span>
                      </label>
                      {/* Input con validación visual Bootstrap */}
                      <input
                        type="text"
                        className={`form-control ${errors.nombre ? 'is-invalid' : touched.nombre && !errors.nombre ? 'is-valid' : ''}`}
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="Juan Pérez"
                      />
                      {/* Mensaje de error específico del campo */}
                      {errors.nombre && (
                        <div className="invalid-feedback">
                          {errors.nombre}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fila: Email y Teléfono (2 columnas en pantallas medianas) */}
                  <div className="row mb-3">
                    {/* Campo Email */}
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        Correo Electrónico <span className="text-danger">*</span>
                      </label>
                      {/* Input tipo email con validación */}
                      <input
                        type="email"
                        className={`form-control ${errors.email || emailError ? 'is-invalid' : touched.email && !errors.email && !emailError ? 'is-valid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="ejemplo@correo.com"
                      />
                      {/* Mensaje de error del email */}
                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email}
                        </div>
                      )}
                      {/* Mensaje de error de email duplicado */}
                      {emailError && !errors.email && (
                        <div className="invalid-feedback d-block">
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          {emailError}
                        </div>
                      )}
                    </div>
                    {/* Campo Teléfono */}
                    <div className="col-md-6">
                      <label htmlFor="telefono" className="form-label">
                        Teléfono <span className="text-danger">*</span>
                      </label>
                      {/* Input tipo tel con validación y formato chileno */}
                      <input
                        type="tel"
                        className={`form-control ${errors.telefono ? 'is-invalid' : touched.telefono && !errors.telefono ? 'is-valid' : ''}`}
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={(e) => {
                          // Si está vacío al hacer foco, agregar +56
                          if (e.target.value === '' || e.target.value === '+56') {
                            setFormData({ ...formData, telefono: '+56' });
                          }
                        }}
                        required
                        placeholder="+56912345678"
                        pattern="\+56[0-9]{9}"
                        title="Formato: +56 seguido de 9 dígitos (ej: +56912345678)"
                        minLength={12}
                        maxLength={12}
                      />
                      {/* Mensaje de error del teléfono */}
                      {errors.telefono && (
                        <div className="invalid-feedback">
                          {errors.telefono}
                        </div>
                      )}
                      <small className="text-muted">
                        Formato: +56 + 9 dígitos (ej: +56912345678)
                      </small>
                    </div>
                  </div>

                  {/* Fila: Género y Fecha de Nacimiento (2 columnas) */}
                  <div className="row mb-3">
                    {/* Campo Género - Select dropdown */}
                    <div className="col-md-6">
                      <label htmlFor="genero" className="form-label">
                        Género <span className="text-danger">*</span>
                      </label>
                      {/* Select con opciones predefinidas */}
                      <select
                        className={`form-select ${errors.genero ? 'is-invalid' : touched.genero && !errors.genero ? 'is-valid' : ''}`}
                        id="genero"
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                      </select>
                      {/* Mensaje de error del género */}
                      {errors.genero && (
                        <div className="invalid-feedback">
                          {errors.genero}
                        </div>
                      )}
                    </div>
                    {/* Campo Fecha de Nacimiento - Date picker */}
                    <div className="col-md-6">
                      <label htmlFor="fechaNacimiento" className="form-label">
                        Fecha de Nacimiento <span className="text-danger">*</span>
                      </label>
                      {/* Input tipo date con validación de edad (18+) */}
                      <input
                        type="date"
                        className={`form-control ${errors.fechaNacimiento ? 'is-invalid' : touched.fechaNacimiento && !errors.fechaNacimiento ? 'is-valid' : ''}`}
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {/* Mensaje de error de fecha */}
                      {errors.fechaNacimiento && (
                        <div className="invalid-feedback">
                          {errors.fechaNacimiento}
                        </div>
                      )}
                      {/* Ayuda visual sobre requisito de edad */}
                      <small className="text-muted">Debes ser mayor de 18 años</small>
                    </div>
                  </div>
                </fieldset>

                {/* SECCIÓN 2: Dirección */}
                <fieldset className="mb-4">
                  {/* Título de la sección de dirección */}
                  <legend className="h5 mb-3 pb-2 border-bottom">Dirección</legend>

                  {/* Fila: Región y Comuna (2 columnas) */}
                  <div className="row mb-3">
                    {/* Campo Región - Select con regiones de Chile */}
                    <div className="col-md-6">
                      <label htmlFor="region" className="form-label">
                        Región <span className="text-danger">*</span>
                      </label>
                      {/* Select con regiones principales de Chile */}
                      <select
                        className={`form-select ${errors.region ? 'is-invalid' : touched.region && !errors.region ? 'is-valid' : ''}`}
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Metropolitana">Región Metropolitana</option>
                        <option value="Valparaíso">Valparaíso</option>
                        <option value="Biobío">Biobío</option>
                        <option value="Araucanía">Araucanía</option>
                        <option value="Los Lagos">Los Lagos</option>
                      </select>
                      {/* Mensaje de error de región */}
                      {errors.region && (
                        <div className="invalid-feedback">
                          {errors.region}
                        </div>
                      )}
                    </div>
                    {/* Campo Comuna - Input de texto */}
                    <div className="col-md-6">
                      <label htmlFor="comuna" className="form-label">
                        Comuna <span className="text-danger">*</span>
                      </label>
                      {/* Input text para comuna */}
                      <input
                        type="text"
                        className={`form-control ${errors.comuna ? 'is-invalid' : touched.comuna && !errors.comuna ? 'is-valid' : ''}`}
                        id="comuna"
                        name="comuna"
                        value={formData.comuna}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="Santiago"
                      />
                      {/* Mensaje de error de comuna */}
                      {errors.comuna && (
                        <div className="invalid-feedback">
                          {errors.comuna}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Campo Dirección Completa - Ancho completo */}
                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">
                      Dirección Completa <span className="text-danger">*</span>
                    </label>
                    {/* Input para dirección completa (calle, número, depto) */}
                    <input
                      type="text"
                      className={`form-control ${errors.direccion ? 'is-invalid' : touched.direccion && !errors.direccion ? 'is-valid' : ''}`}
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Av. Principal 123, Depto 45"
                    />
                    {/* Mensaje de error de dirección */}
                    {errors.direccion && (
                      <div className="invalid-feedback">
                        {errors.direccion}
                      </div>
                    )}
                  </div>
                </fieldset>

                {/* SECCIÓN 3: Seguridad (Contraseñas) */}
                <fieldset className="mb-4">
                  {/* Título de la sección de seguridad */}
                  <legend className="h5 mb-3 pb-2 border-bottom">Seguridad</legend>

                  {/* Fila: Contraseña y Confirmación (2 columnas) */}
                  <div className="row mb-3">
                    {/* Campo Contraseña */}
                    <div className="col-md-6">
                      <label htmlFor="contrasena" className="form-label">
                        Contraseña <span className="text-danger">*</span>
                      </label>
                      {/* Input tipo password con validación de longitud mínima */}
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
                        minLength={6}
                        aria-describedby="passwordHelp"
                      />
                      {/* Mensaje de error de contraseña */}
                      {errors.contrasena && (
                        <div className="invalid-feedback">
                          {errors.contrasena}
                        </div>
                      )}
                      {/* Texto de ayuda para requisitos de contraseña */}
                      <small id="passwordHelp" className="form-text text-muted">
                        Mínimo 6 caracteres
                      </small>
                    </div>
                    {/* Campo Confirmar Contraseña */}
                    <div className="col-md-6">
                      <label htmlFor="confirmarContrasena" className="form-label">
                        Confirmar Contraseña <span className="text-danger">*</span>
                      </label>
                      {/* Input para confirmar que ambas contraseñas coinciden */}
                      <input
                        type="password"
                        className={`form-control ${errors.confirmarContrasena ? 'is-invalid' : touched.confirmarContrasena && !errors.confirmarContrasena ? 'is-valid' : ''}`}
                        id="confirmarContrasena"
                        name="confirmarContrasena"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="••••••••"
                        minLength={6}
                      />
                      {/* Mensaje de error si las contraseñas no coinciden */}
                      {errors.confirmarContrasena && (
                        <div className="invalid-feedback">
                          {errors.confirmarContrasena}
                        </div>
                      )}
                    </div>
                  </div>
                </fieldset>

                {/* Footer del formulario: botón submit y link a login */}
                <footer className="mt-4">
                  {/* Botón de envío del formulario (ancho completo) */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {/* Muestra spinner y texto diferente cuando está cargando */}
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creando cuenta...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </button>

                  {/* Link para usuarios que ya tienen cuenta */}
                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      ¿Ya tienes una cuenta?{' '}
                      <Link to="/login" className="text-decoration-none fw-semibold">
                        Inicia sesión aquí
                      </Link>
                    </p>
                  </div>
                </footer>
              </form>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
