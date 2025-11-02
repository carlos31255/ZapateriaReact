import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Usuario } from '../types';
import { obtenerUsuarioPorId, actualizarUsuario } from '../services/authService';

export const PerfilPage = () => {
  const { usuario, cerrarSesionUsuario } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    genero: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: ''
  });
  
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (usuario) {
      cargarDatosUsuario();
    }
  }, [usuario]);

  const cargarDatosUsuario = async () => {
    if (!usuario) return;
    
    try {
      const respuesta = await obtenerUsuarioPorId(usuario.id);
      if (respuesta.success && respuesta.data) {
        const user = respuesta.data;
        setFormData({
          nombre: user.nombre || '',
          email: user.email || '',
          telefono: user.telefono || '',
          genero: user.genero || '',
          fechaNacimiento: user.fechaNacimiento || '',
          region: user.region || '',
          comuna: user.comuna || '',
          direccion: user.direccion || ''
        });
      }
    } catch (err) {
      console.error('Error al cargar datos del usuario:', err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Obtener el usuario completo
      const respuestaUsuario = await obtenerUsuarioPorId(usuario.id);
      if (!respuestaUsuario.success || !respuestaUsuario.data) {
        throw new Error('No se pudo obtener el usuario');
      }

      const usuarioCompleto = respuestaUsuario.data;

      // Actualizar solo los campos editables
      const usuarioActualizado: Usuario = {
        ...usuarioCompleto,
        nombre: formData.nombre,
        telefono: formData.telefono,
        genero: formData.genero,
        fechaNacimiento: formData.fechaNacimiento,
        region: formData.region,
        comuna: formData.comuna,
        direccion: formData.direccion
      };

      const respuesta = await actualizarUsuario(usuarioActualizado);
      
      if (respuesta.success) {
        setSuccess('Perfil actualizado correctamente');
        setEditMode(false);
        // Recargar los datos
        await cargarDatosUsuario();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCerrarSesion = async () => {
    try {
      await cerrarSesionUsuario();
      navigate('/');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Validación: si no hay usuario, mostrar mensaje de advertencia
  if (!usuario) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Debes iniciar sesión para ver tu perfil
        </div>
      </div>
    );
  }

  return (
    // Contenedor principal con padding vertical
    <div className="container py-5">
      {/* Fila centrada con columna de ancho limitado */}
      <div className="row justify-content-center">
        {/* Columna responsiva: 8/12 en large */}
        <div className="col-lg-8">
          {/* Tarjeta principal del perfil con sombra */}
          <article className="card shadow">
            {/* Cuerpo de la tarjeta */}
            <div className="card-body p-4">
              {/* Header: Título y badge de rol */}
              <header className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Mi Perfil</h1>
                {/* Badge dinámico según rol del usuario */}
                <span className={`badge ${
                  usuario.rol === 'administrador' ? 'bg-danger' :
                  usuario.rol === 'vendedor' ? 'bg-warning' : 'bg-primary'
                }`}>
                  {usuario.rol.toUpperCase()}
                </span>
              </header>

              {/* Mensaje de error (si existe) */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {/* Mensaje de éxito (si existe) */}
              {success && (
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </div>
              )}

              {/* Formulario de edición de perfil */}
              <form onSubmit={handleSubmit}>
                {/* SECCIÓN 1: Información Básica */}
                <fieldset className="mb-4">
                  {/* Título de la sección con borde inferior */}
                  <legend className="h5 mb-3 pb-2 border-bottom">Información Básica</legend>

                  {/* Fila: RUN y Nombre (2 columnas) */}
                  <div className="row mb-3">
                    {/* Campo RUN - No editable */}
                    <div className="col-md-6">
                      <label htmlFor="run" className="form-label">
                        RUN
                      </label>
                      {/* Input deshabilitado permanentemente */}
                      <input
                        type="text"
                        className="form-control"
                        id="run"
                        value={usuario.run}
                        disabled
                      />
                      <small className="text-muted">
                        <i className="bi bi-lock-fill me-1"></i>
                        No se puede modificar
                      </small>
                    </div>
                    {/* Campo Nombre - Editable en modo edición */}
                    <div className="col-md-6">
                      <label htmlFor="nombre" className="form-label">
                        Nombre Completo
                      </label>
                      {/* Input que se habilita/deshabilita según editMode */}
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={!editMode}
                        required
                      />
                    </div>
                  </div>

                  {/* Fila: Email y Teléfono (2 columnas) */}
                  <div className="row mb-3">
                    {/* Campo Email - No editable */}
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        Correo Electrónico
                      </label>
                      {/* Email no modificable por seguridad */}
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={formData.email}
                        disabled
                      />
                      <small className="text-muted">
                        <i className="bi bi-lock-fill me-1"></i>
                        No se puede modificar
                      </small>
                    </div>
                    {/* Campo Teléfono - Editable */}
                    <div className="col-md-6">
                      <label htmlFor="telefono" className="form-label">
                        Teléfono
                      </label>
                      {/* Input editable de teléfono */}
                      <input
                        type="tel"
                        className="form-control"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        disabled={!editMode}
                        required
                      />
                    </div>
                  </div>

                  {/* Fila: Género y Fecha de Nacimiento (2 columnas) */}
                  <div className="row mb-3">
                    {/* Campo Género - Select editable */}
                    <div className="col-md-6">
                      <label htmlFor="genero" className="form-label">
                        Género
                      </label>
                      {/* Select con opciones predefinidas */}
                      <select
                        className="form-select"
                        id="genero"
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                        disabled={!editMode}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    {/* Campo Fecha de Nacimiento - Editable */}
                    <div className="col-md-6">
                      <label htmlFor="fechaNacimiento" className="form-label">
                        Fecha de Nacimiento
                      </label>
                      {/* Date picker editable */}
                      <input
                        type="date"
                        className="form-control"
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        disabled={!editMode}
                        required
                      />
                    </div>
                  </div>
                </fieldset>

                {/* SECCIÓN 2: Dirección */}
                <fieldset className="mb-4">
                  {/* Título de la sección de dirección */}
                  <legend className="h5 mb-3 pb-2 border-bottom">Dirección</legend>

                  {/* Fila: Región y Comuna (2 columnas) */}
                  <div className="row mb-3">
                    {/* Campo Región - Select editable */}
                    <div className="col-md-6">
                      <label htmlFor="region" className="form-label">
                        Región
                      </label>
                      {/* Select con regiones de Chile */}
                      <select
                        className="form-select"
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        disabled={!editMode}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Metropolitana">Región Metropolitana</option>
                        <option value="Valparaíso">Valparaíso</option>
                        <option value="Biobío">Biobío</option>
                        <option value="Araucanía">Araucanía</option>
                        <option value="Los Lagos">Los Lagos</option>
                      </select>
                    </div>
                    {/* Campo Comuna - Input editable */}
                    <div className="col-md-6">
                      <label htmlFor="comuna" className="form-label">
                        Comuna
                      </label>
                      {/* Input de texto para comuna */}
                      <input
                        type="text"
                        className="form-control"
                        id="comuna"
                        name="comuna"
                        value={formData.comuna}
                        onChange={handleChange}
                        disabled={!editMode}
                        required
                      />
                    </div>
                  </div>

                  {/* Campo Dirección - Ancho completo */}
                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">
                      Dirección Completa
                    </label>
                    {/* Input para dirección completa editable */}
                    <input
                      type="text"
                      className="form-control"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                  </div>
                </fieldset>

                {/* SECCIÓN 3: Información de Cuenta */}
                <fieldset className="mb-4">
                  {/* Título de información de cuenta */}
                  <legend className="h5 mb-3 pb-2 border-bottom">Información de Cuenta</legend>

                  {/* Campo Rol - No editable */}
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    {/* Input deshabilitado con el rol del usuario */}
                    <input
                      type="text"
                      className="form-control"
                      value={usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                      disabled
                    />
                    <small className="text-muted">
                      <i className="bi bi-lock-fill me-1"></i>
                      Asignado por el sistema
                    </small>
                  </div>

                  {/* Campo Fecha de Registro - No editable */}
                  <div className="mb-3">
                    <label className="form-label">Fecha de Registro</label>
                    {/* Input deshabilitado con fecha formateada */}
                    <input
                      type="text"
                      className="form-control"
                      value={new Date(usuario.fechaRegistro).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      disabled
                    />
                    <small className="text-muted">
                      <i className="bi bi-calendar-check me-1"></i>
                      Miembro desde esta fecha
                    </small>
                  </div>
                </fieldset>

                {/* Footer: Botones de acción según modo (vista/edición) */}
                <footer className="d-flex gap-2 mt-4">
                  {/* Modo vista: Botones Editar y Cerrar Sesión */}
                  {!editMode ? (
                    <>
                      {/* Botón para activar modo edición */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setEditMode(true)}
                      >
                        <i className="bi bi-pencil-square me-2"></i>
                        Editar Perfil
                      </button>
                      {/* Botón para cerrar sesión */}
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleCerrarSesion}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    /* Modo edición: Botones Guardar y Cancelar */
                    <>
                      {/* Botón submit para guardar cambios */}
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                      >
                        {/* Muestra spinner cuando está guardando */}
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Guardar Cambios
                          </>
                        )}
                      </button>
                      {/* Botón para cancelar edición y restaurar datos */}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditMode(false);
                          cargarDatosUsuario(); // Restaura datos originales
                          setError('');
                          setSuccess('');
                        }}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancelar
                      </button>
                    </>
                  )}
                </footer>
              </form>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
