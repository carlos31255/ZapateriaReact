// Custom hook para manejar usuarios usando servicios directamente

import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { Usuario } from '../types';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const usuariosBackend = await authService.getAllUsuarios();

      // Mapear usuarios del backend al formato frontend
      const usuariosMapeados: Usuario[] = usuariosBackend.map(u => ({
        id: u.idPersona.toString(),
        run: u.persona.rut,
        nombre: `${u.persona.nombre} ${u.persona.apellido}`,
        email: u.persona.email,
        rol: u.rol.nombreRol.toLowerCase() as any,
        genero: '',
        fechaNacimiento: '',
        region: '',
        comuna: u.persona.idComuna?.toString() || '',
        direccion: `${u.persona.calle || ''} ${u.persona.numeroPuerta || ''}`.trim(),
        telefono: u.persona.telefono,
        fechaRegistro: u.persona.fechaRegistro
      }));

      setUsuarios(usuariosMapeados);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const obtenerUsuarioPorEmail = (email: string): Usuario | undefined => {
    return usuarios.find(u => u.email === email);
  };

  const obtenerUsuarioPorId = (id: string): Usuario | undefined => {
    return usuarios.find(u => u.id === id);
  };

  const actualizarUsuario = async (id: string, datos: Partial<Usuario>): Promise<boolean> => {
    try {
      await authService.updateUsuario(parseInt(id), {
        persona: {
          nombre: datos.nombre?.split(' ')[0],
          apellido: datos.nombre?.split(' ').slice(1).join(' '),
          telefono: datos.telefono,
          calle: datos.direccion
        } as any
      });
      await cargarUsuarios();
      return true;
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      return false;
    }
  };

  const eliminarUsuario = async (id: string): Promise<boolean> => {
    try {
      await authService.deleteUsuario(parseInt(id));
      await cargarUsuarios();
      return true;
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      return false;
    }
  };

  const crearUsuario = async (datos: Partial<Usuario>): Promise<Usuario | null> => {
    try {
      // TODO: Implementar creación de usuario
      await cargarUsuarios();
      return null;
    } catch (err) {
      console.error('Error creando usuario:', err);
      return null;
    }
  };

  return {
    usuarios,
    loading,
    error,
    obtenerUsuarioPorEmail,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    crearUsuario,
    recargarUsuarios: cargarUsuarios,
    // Aliases para compatibilidad
    fetchUsuarios: cargarUsuarios,
    fetchActualizarUsuario: actualizarUsuario,
    fetchEliminarUsuario: eliminarUsuario,
    fetchCrearUsuario: crearUsuario
  };
};
