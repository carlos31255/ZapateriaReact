import { useState, useEffect } from 'react';
import { useUsuarios } from '../hooks';
import type { Usuario } from '../types';
import styles from './AdminUsuariosPage.module.css';

export const AdminUsuariosPage = () => {
  const { usuarios, fetchUsuarios, fetchEliminarUsuario, fetchActualizarUsuario, fetchCrearUsuario } = useUsuarios();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  // Cargar usuarios al iniciar
  useEffect(() => {
    // Registrar visita a esta página
    const link = '/admin/usuarios';
    const saved = localStorage.getItem('admin_recent_pages');
    let recentLinks = saved ? JSON.parse(saved) : [];
    recentLinks = recentLinks.filter((l: string) => l !== link);
    recentLinks.unshift(link);
    recentLinks = recentLinks.slice(0, 10);
    localStorage.setItem('admin_recent_pages', JSON.stringify(recentLinks));

    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    // Los usuarios ya están disponibles en el Context a través del hook
    await fetchUsuarios();
  };

  const abrirModal = (usuario?: Usuario) => {
    if (usuario) {
      setUsuarioEditando(usuario);
    } else {
      setUsuarioEditando(null);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      await fetchEliminarUsuario(id);
      await cargarUsuarios();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (usuarioEditando) {
      // Actualizar usuario existente
      const usuarioActualizado: Usuario = {
        ...usuarioEditando,
        nombre: formData.get('nombre') as string,
        email: formData.get('email') as string,
        run: formData.get('run') as string,
        rol: formData.get('rol') as 'cliente' | 'administrador',
        genero: formData.get('genero') as string || undefined,
        fechaNacimiento: formData.get('fechaNacimiento') as string || undefined,
        region: formData.get('region') as string || undefined,
        comuna: formData.get('comuna') as string || undefined,
        direccion: formData.get('direccion') as string || undefined,
        telefono: formData.get('telefono') as string || undefined,
      };

      await fetchActualizarUsuario(usuarioEditando.id, usuarioActualizado);
    } else {
      // Crear nuevo usuario
      const nuevoUsuario: Omit<Usuario, 'id' | 'fechaRegistro'> = {
        run: formData.get('run') as string,
        nombre: formData.get('nombre') as string,
        email: formData.get('email') as string,
        contrasena: formData.get('contrasena') as string,
        rol: formData.get('rol') as 'cliente' | 'administrador',
        genero: formData.get('genero') as string || undefined,
        fechaNacimiento: formData.get('fechaNacimiento') as string || undefined,
        region: formData.get('region') as string || undefined,
        comuna: formData.get('comuna') as string || undefined,
        direccion: formData.get('direccion') as string || undefined,
        telefono: formData.get('telefono') as string || undefined,
      };

      await fetchCrearUsuario(nuevoUsuario);
    }

    await cargarUsuarios();
    cerrarModal();
  };

  const getRoleBadgeClass = (rol: string) => {
    switch (rol) {
      case 'administrador':
        return styles.rolAdmin;
      default:
        return styles.rolCliente;
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <i className="bi bi-people me-3"></i>
            Gestión de Usuarios
          </h1>
          <p className={styles.subtitle}>
            Administra los usuarios del sistema
          </p>
        </div>
        <button 
          onClick={() => abrirModal()}
          className={styles.addButton}
        >
          <i className="bi bi-person-plus me-2"></i>
          Nuevo Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha de Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>#{usuario.id}</td>
                <td>
                  <div className={styles.userName}>{usuario.nombre}</div>
                </td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`${styles.rolBadge} ${getRoleBadgeClass(usuario.rol)}`}>
                    {usuario.rol}
                  </span>
                </td>
                <td>
                  {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={() => abrirModal(usuario)}
                      className={styles.editButton}
                      title="Editar usuario"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      onClick={() => handleEliminar(usuario.id)}
                      className={styles.deleteButton}
                      title="Eliminar usuario"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuarios.length === 0 && (
          <div className={styles.emptyState}>
            <i className="bi bi-people" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
            <p>No hay usuarios registrados</p>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {modalAbierto && (
        <>
          <div className={styles.overlay} onClick={cerrarModal}></div>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{usuarioEditando ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
              <button onClick={cerrarModal} className={styles.closeButton}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="run">RUN *</label>
                  <input
                    type="text"
                    id="run"
                    name="run"
                    defaultValue={usuarioEditando?.run}
                    placeholder="12.345.678-9"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="nombre">Nombre completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    defaultValue={usuarioEditando?.nombre}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={usuarioEditando?.email}
                    required
                  />
                </div>

                {/* Campo contraseña solo para nuevos usuarios */}
                {!usuarioEditando && (
                  <div className={styles.formGroup}>
                    <label htmlFor="contrasena">Contraseña *</label>
                    <input
                      type="password"
                      id="contrasena"
                      name="contrasena"
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      required
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="genero">Género</label>
                  <select
                    id="genero"
                    name="genero"
                    defaultValue={usuarioEditando?.genero || ''}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    defaultValue={usuarioEditando?.fechaNacimiento}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    defaultValue={usuarioEditando?.telefono}
                    placeholder="+56912345678"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="region">Región</label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    defaultValue={usuarioEditando?.region}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="comuna">Comuna</label>
                  <input
                    type="text"
                    id="comuna"
                    name="comuna"
                    defaultValue={usuarioEditando?.comuna}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="direccion">Dirección</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    defaultValue={usuarioEditando?.direccion}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="rol">Rol *</label>
                  <select
                    id="rol"
                    name="rol"
                    defaultValue={usuarioEditando?.rol}
                    required
                  >
                    <option value="cliente">Cliente</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={cerrarModal} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton}>
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
