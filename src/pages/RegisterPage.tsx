import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { DatosRegistro } from '../types';
import { validarFormularioRegistro, type DatosRegistroValidacion } from '../utils/validations/validations.index';
import { geografiaService, type Region, type Comuna } from '../services/geografiaService';

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

  const [regiones, setRegiones] = useState<Region[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Cargar regiones al montar el componente
  useEffect(() => {
    const loadRegiones = async () => {
      try {
        const data = await geografiaService.getAllRegiones();
        setRegiones(data);
      } catch (error) {
        console.error('Error cargando regiones:', error);
      }
    };
    loadRegiones();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    const validationErrors = validarFormularioRegistro(formData as DatosRegistroValidacion);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      setGeneralError('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    setEmailError('');

    try {
      await registrarUsuario(formData);
      navigate('/login');
    } catch (err) {
      const mensajeError = err instanceof Error ? err.message : 'Error al registrar usuario';

      if (mensajeError === 'El email ya está registrado') {
        setEmailError(mensajeError);
      } else {
        setGeneralError(mensajeError);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      if (value === '') {
        setFormData({ ...formData, telefono: '+56' });
        return;
      }

      let telefonoFormateado = value;
      if (!telefonoFormateado.startsWith('+56')) {
        telefonoFormateado = '+56' + telefonoFormateado.replace(/^\+?56?/, '');
      }

      telefonoFormateado = '+56' + telefonoFormateado.substring(3).replace(/\D/g, '');

      if (telefonoFormateado.length > 12) {
        telefonoFormateado = telefonoFormateado.substring(0, 12);
      }

      setFormData({ ...formData, telefono: telefonoFormateado });

      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
      if (generalError) {
        setGeneralError('');
      }
      return;
    }

    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (generalError) {
      setGeneralError('');
    }
    if (name === 'email' && emailError) {
      setEmailError('');
    }
  };

  const handleRegionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionName = e.target.value;
    const region = regiones.find(r => r.nombreRegion === regionName);

    setFormData({
      ...formData,
      region: regionName,
      comuna: ''
    });

    if (region) {
      try {
        const data = await geografiaService.getComunasByRegion(region.idRegion);
        setComunas(data);
      } catch (error) {
        console.error('Error cargando comunas:', error);
        setComunas([]);
      }
    } else {
      setComunas([]);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    if (name === 'email' && value) {
      const validationErrors = validarFormularioRegistro({ ...formData, email: value } as DatosRegistroValidacion);
      const emailFormatError = validationErrors.find(error => error.field === 'email');

      if (emailFormatError) {
        setErrors({ ...errors, email: emailFormatError.message });
        setEmailError('');
        return;
      } else {
        setEmailError('');
        setErrors({ ...errors, email: '' });
        return;
      }
    }

    const validationErrors = validarFormularioRegistro(formData as DatosRegistroValidacion);
    const fieldError = validationErrors.find(error => error.field === name);

    if (fieldError) {
      setErrors({ ...errors, [name]: fieldError.message });
    } else if (touched[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center py-5">
        <div className="col-md-8 col-lg-7">
          <article className="card shadow">
            <div className="card-body p-4">
              <header className="text-center mb-4">
                <h1 className="h2">Crear Cuenta</h1>
                <p className="text-muted">Completa el formulario para registrarte</p>
              </header>

              {generalError && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <fieldset className="mb-4">
                  <legend className="h5 mb-3 pb-2 border-bottom">Información Personal</legend>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="run" className="form-label">
                        RUN <span className="text-danger">*</span>
                      </label>
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
                      />
                      {errors.run && (
                        <div className="invalid-feedback">{errors.run}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="nombre" className="form-label">
                        Nombre Completo <span className="text-danger">*</span>
                      </label>
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
                      {errors.nombre && (
                        <div className="invalid-feedback">{errors.nombre}</div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        Correo Electrónico <span className="text-danger">*</span>
                      </label>
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
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                      {emailError && !errors.email && (
                        <div className="invalid-feedback d-block">
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          {emailError}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="telefono" className="form-label">
                        Teléfono <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errors.telefono ? 'is-invalid' : touched.telefono && !errors.telefono ? 'is-valid' : ''}`}
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={(e) => {
                          if (e.target.value === '' || e.target.value === '+56') {
                            setFormData({ ...formData, telefono: '+56' });
                          }
                        }}
                        required
                        placeholder="+56912345678"
                        pattern="\+56[0-9]{9}"
                        title="Formato: +56 seguido de 9 dígitos"
                        minLength={12}
                        maxLength={12}
                      />
                      {errors.telefono && (
                        <div className="invalid-feedback">{errors.telefono}</div>
                      )}
                      <small className="text-muted">
                        Formato: +56 + 9 dígitos (ej: +56912345678)
                      </small>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="genero" className="form-label">
                        Género <span className="text-danger">*</span>
                      </label>
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
                      {errors.genero && (
                        <div className="invalid-feedback">{errors.genero}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="fechaNacimiento" className="form-label">
                        Fecha de Nacimiento <span className="text-danger">*</span>
                      </label>
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
                      {errors.fechaNacimiento && (
                        <div className="invalid-feedback">{errors.fechaNacimiento}</div>
                      )}
                      <small className="text-muted">Debes ser mayor de 18 años</small>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="mb-4">
                  <legend className="h5 mb-3 pb-2 border-bottom">Dirección</legend>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="region" className="form-label">
                        Región <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${errors.region ? 'is-invalid' : touched.region && !errors.region ? 'is-valid' : ''}`}
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleRegionChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {regiones.map(region => (
                          <option key={region.idRegion} value={region.nombreRegion}>
                            {region.nombreRegion}
                          </option>
                        ))}
                      </select>
                      {errors.region && (
                        <div className="invalid-feedback">{errors.region}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="comuna" className="form-label">
                        Comuna <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${errors.comuna ? 'is-invalid' : touched.comuna && !errors.comuna ? 'is-valid' : ''}`}
                        id="comuna"
                        name="comuna"
                        value={formData.comuna}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        disabled={!formData.region}
                      >
                        <option value="">Seleccionar...</option>
                        {comunas.map(comuna => (
                          <option key={comuna.idComuna} value={comuna.idComuna.toString()}>
                            {comuna.nombreComuna}
                          </option>
                        ))}
                      </select>
                      {errors.comuna && (
                        <div className="invalid-feedback">{errors.comuna}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">
                      Dirección Completa <span className="text-danger">*</span>
                    </label>
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
                    {errors.direccion && (
                      <div className="invalid-feedback">{errors.direccion}</div>
                    )}
                  </div>
                </fieldset>

                <fieldset className="mb-4">
                  <legend className="h5 mb-3 pb-2 border-bottom">Seguridad</legend>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="contrasena" className="form-label">
                        Contraseña <span className="text-danger">*</span>
                      </label>
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
                        minLength={8}
                      />
                      {errors.contrasena && (
                        <div className="invalid-feedback">{errors.contrasena}</div>
                      )}
                      <small className="form-text text-muted">
                        Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo
                      </small>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="confirmarContrasena" className="form-label">
                        Confirmar Contraseña <span className="text-danger">*</span>
                      </label>
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
                        minLength={8}
                      />
                      {errors.confirmarContrasena && (
                        <div className="invalid-feedback">{errors.confirmarContrasena}</div>
                      )}
                    </div>
                  </div>
                </fieldset>

                <footer className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creando cuenta...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </button>

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
