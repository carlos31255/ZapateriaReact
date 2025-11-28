import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Usuario } from '../types';
import { useUsuarios } from '../hooks';
import { usePedidos } from '../hooks/usePedidos';
import { formatearPrecio } from '../helpers/productService';
import { geografiaService } from '../services/geografiaService';
import type { Region, Comuna } from '../types';

export const PerfilPage = () => {
  const { usuario, cerrarSesionUsuario, actualizarSesion } = useAuth();
  const navigate = useNavigate();
  const { obtenerUsuarioPorId, actualizarUsuario } = useUsuarios();
  const { pedidos } = usePedidos();

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
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);

  useEffect(() => {
    const cargarRegiones = async () => {
      try {
        const data = await geografiaService.getAllRegiones();
        console.log('Regiones cargadas:', data);
        setRegiones(data);
      } catch (error) {
        console.error('Error al cargar regiones:', error);
      }
    };
    cargarRegiones();
  }, []);

  useEffect(() => {
    if (usuario) {
      console.log('Usuario actual:', usuario);
      console.log('Región del usuario:', usuario.region);
      console.log('Comuna del usuario:', usuario.comuna);
      cargarDatosUsuario();
    }
  }, [usuario]);

  const cargarDatosUsuario = async () => {
    if (!usuario) return;

    // Usar directamente los datos del usuario del contexto
    const datosFormulario = {
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      telefono: usuario.telefono || '+56',
      genero: usuario.genero || '',
      fechaNacimiento: usuario.fechaNacimiento || '',
      region: usuario.region || '',
      comuna: usuario.comuna || '',
      direccion: usuario.direccion || ''
    };

    console.log('Datos cargados en el formulario:', datosFormulario);
    setFormData(datosFormulario);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    setError('');
    setSuccess('');

    // Validar formato del teléfono
    if (formData.telefono && formData.telefono !== '+56') {
      if (!/^\+56[0-9]{9}$/.test(formData.telefono)) {
        setError('El teléfono debe tener el formato +56 seguido de 9 dígitos');
        return;
      }
    }

    setLoading(true);

    try {
      // Obtener el usuario completo
      const usuarioCompleto = obtenerUsuarioPorId(usuario.id);
      if (!usuarioCompleto) {
        throw new Error('No se pudo obtener el usuario');
      }

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

      const success = await actualizarUsuario(usuario.id, usuarioActualizado);

      if (success) {
        // Actualizar la sesión con los datos frescos
        await actualizarSesion();

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
      return;
    }

    // Para otros campos
    setFormData({
      ...formData,
      [name]: value
    });
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
                <span className={`badge ${usuario.rol === 'administrador' ? 'bg-danger' : 'bg-primary'
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

              {/* Botones de acción en modo vista (fuera del formulario) */}
              {!editMode && (
                <footer className="d-flex gap-2 mb-4">
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
                </footer>
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
                      {/* Input editable de teléfono con formato chileno */}
                      <input
                        type="tel"
                        className="form-control"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        onFocus={(e) => {
                          // Si está vacío al hacer foco, agregar +56
                          if (e.target.value === '' || e.target.value === '+56') {
                            setFormData({ ...formData, telefono: '+56' });
                          }
                        }}
                        placeholder="+56912345678"
                        pattern="\+56[0-9]{9}"
                        title="Formato: +56 seguido de 9 dígitos (ej: +56912345678)"
                        disabled={!editMode}
                        required
                        minLength={12}
                        maxLength={12}
                      />
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Formato: +56 + 9 dígitos
                      </small>
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
                        onChange={handleRegionChange}
                        disabled={!editMode}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {regiones.map(region => (
                          <option key={region.idRegion} value={region.nombreRegion}>
                            {region.nombreRegion}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Campo Comuna - Select editable */}
                    <div className="col-md-6">
                      <label htmlFor="comuna" className="form-label">
                        Comuna
                      </label>
                      {/* Select con comunas dinámicas */}
                      <select
                        className="form-control"
                        id="comuna"
                        name="comuna"
                        value={formData.comuna}
                        onChange={handleChange}
                        disabled={!editMode || !formData.region}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {comunas.map(comuna => (
                          <option key={comuna.idComuna} value={comuna.nombreComuna}>
                            {comuna.nombreComuna}
                          </option>
                        ))}
                      </select>
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

                {/* Footer: Botones de acción en modo edición */}
                {editMode && (
                  <footer className="d-flex gap-2 mt-4">
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
                  </footer>
                )}
              </form>
            </div>
          </article>

          {/* SECCIÓN DE MIS PEDIDOS */}
          <article className="card shadow mt-4">
            <div className="card-body p-4">
              <header className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-0">Mis Pedidos</h2>
                <span className="badge bg-info">
                  {pedidos.filter(p => p.usuarioId === usuario.id).length} pedido(s)
                </span>
              </header>

              {/* Lista de pedidos del usuario */}
              {pedidos.filter(p => p.usuarioId === usuario.id).length === 0 ? (
                <div className="alert alert-info" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  No has realizado ningún pedido aún.
                </div>
              ) : (
                <div className="accordion" id="accordionPedidos">
                  {pedidos
                    .filter(p => p.usuarioId === usuario.id)
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .map((pedido, index) => {
                      const collapseId = `collapsePedido${index}`;
                      return (
                        <div className="accordion-item" key={pedido.id}>
                          <h2 className="accordion-header" id={`heading${index}`}>
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#${collapseId}`}
                              aria-expanded="false"
                              aria-controls={collapseId}
                            >
                              <div className="d-flex justify-content-between align-items-center w-100 pe-3">
                                <div>
                                  <strong>Pedido #{pedido.id}</strong>
                                  <small className="text-muted ms-2">
                                    {new Date(pedido.fecha).toLocaleDateString('es-CL', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </small>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  <span className={`badge ${pedido.estado === 'entregado' ? 'bg-success' :
                                    pedido.estado === 'cancelado' ? 'bg-danger' :
                                      pedido.estado === 'enviado' ? 'bg-primary' :
                                        pedido.estado === 'procesando' ? 'bg-info' :
                                          'bg-warning text-dark'
                                    }`}>
                                    {pedido.estado.toUpperCase()}
                                  </span>
                                  <strong className="text-primary">{formatearPrecio(pedido.total)}</strong>
                                </div>
                              </div>
                            </button>
                          </h2>
                          <div
                            id={collapseId}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading${index}`}
                            data-bs-parent="#accordionPedidos"
                          >
                            <div className="accordion-body">
                              {/* Información del pedido */}
                              <div className="mb-3">
                                <h4 className="h6 mb-2">Información del Pedido</h4>
                                <div className="row g-2">
                                  <div className="col-md-6">
                                    <small className="text-muted">Estado:</small>
                                    <p className="mb-0">
                                      <span className={`badge ${pedido.estado === 'entregado' ? 'bg-success' :
                                        pedido.estado === 'cancelado' ? 'bg-danger' :
                                          pedido.estado === 'enviado' ? 'bg-primary' :
                                            pedido.estado === 'procesando' ? 'bg-info' :
                                              'bg-warning text-dark'
                                        }`}>
                                        {pedido.estado.toUpperCase()}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="col-md-6">
                                    <small className="text-muted">Fecha:</small>
                                    <p className="mb-0">
                                      {new Date(pedido.fecha).toLocaleDateString('es-CL', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                  {pedido.direccionEnvio && (
                                    <div className="col-12">
                                      <small className="text-muted">Dirección de Envío:</small>
                                      <p className="mb-0">{pedido.direccionEnvio}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Productos del pedido */}
                              <div className="mb-3">
                                <h4 className="h6 mb-2">Productos</h4>
                                <div className="table-responsive">
                                  <table className="table table-sm">
                                    <thead>
                                      <tr>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {pedido.items.map((item, idx) => (
                                        <tr key={`${item.id}-${idx}`}>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <img
                                                src={item.imagen || 'https://via.placeholder.com/40'}
                                                alt={item.nombre}
                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                className="rounded me-2"
                                              />
                                              <div>
                                                <div>{item.nombre}</div>
                                                {item.tallaSeleccionada && (
                                                  <small className="text-muted">
                                                    Talla: {item.tallaSeleccionada}
                                                  </small>
                                                )}
                                              </div>
                                            </div>
                                          </td>
                                          <td>{formatearPrecio(item.precio)}</td>
                                          <td>{item.cantidad}</td>
                                          <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Resumen de precios */}
                              <div className="border-top pt-3">
                                <div className="row">
                                  <div className="col-md-6 ms-auto">
                                    <div className="d-flex justify-content-between mb-2">
                                      <span>Subtotal:</span>
                                      <span>{formatearPrecio(pedido.subtotal)}</span>
                                    </div>
                                    {pedido.descuento > 0 && (
                                      <div className="d-flex justify-content-between mb-2 text-success">
                                        <span>Descuento:</span>
                                        <span>-{formatearPrecio(pedido.descuento)}</span>
                                      </div>
                                    )}
                                    <div className="d-flex justify-content-between fw-bold border-top pt-2">
                                      <span>Total:</span>
                                      <span className="text-primary">{formatearPrecio(pedido.total)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
