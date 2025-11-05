// Custom hook para manejar usuarios usando DatabaseContext

import { useDatabase } from '../context/DatabaseContext';
import type { Usuario, ApiResponse } from '../types';

// Simula un delay de red
const simularDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const useUsuarios = () => {
  const {
    usuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorEmail,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
  } = useDatabase();

  // OPERACIONES DE LECTURA

  // Obtiene todos los usuarios
  const fetchUsuarios = async (): Promise<ApiResponse<Usuario[]>> => {
    try {
      await simularDelay();
      
      return {
        success: true,
        data: usuarios,
        message: 'Usuarios obtenidos exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener usuarios'
      };
    }
  };

  // Obtiene un usuario por ID
  const fetchUsuarioPorId = async (id: string): Promise<ApiResponse<Usuario>> => {
    try {
      await simularDelay(300);
      
      const usuario = obtenerUsuarioPorId(id);
      
      if (!usuario) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }
      
      return {
        success: true,
        data: usuario
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener usuario'
      };
    }
  };

  // Obtiene un usuario por email
  const fetchUsuarioPorEmail = async (email: string): Promise<ApiResponse<Usuario>> => {
    try {
      await simularDelay(300);
      
      const usuario = obtenerUsuarioPorEmail(email);
      
      if (!usuario) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }
      
      return {
        success: true,
        data: usuario
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener usuario'
      };
    }
  };

  // OPERACIONES DE ESCRITURA

  // Crea un nuevo usuario
  const fetchCrearUsuario = async (
    usuario: Omit<Usuario, 'id' | 'fechaRegistro'>
  ): Promise<ApiResponse<Usuario>> => {
    try {
      await simularDelay(800);
      
      // Validaciones
      if (!usuario.nombre || !usuario.email || !usuario.contrasena) {
        return {
          success: false,
          error: 'Faltan datos requeridos'
        };
      }
      
      // Verificar si el email ya existe
      const usuarioExistente = obtenerUsuarioPorEmail(usuario.email);
      if (usuarioExistente) {
        return {
          success: false,
          error: 'El email ya está registrado'
        };
      }
      
      const nuevoUsuario = crearUsuario(usuario);
      
      return {
        success: true,
        data: nuevoUsuario,
        message: 'Usuario creado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al crear el usuario'
      };
    }
  };

  // Actualiza un usuario existente
  const fetchActualizarUsuario = async (
    id: string,
    datosActualizados: Partial<Usuario>
  ): Promise<ApiResponse<Usuario>> => {
    try {
      await simularDelay(500);
      
      const resultado = actualizarUsuario(id, datosActualizados);
      
      if (!resultado) {
        return {
          success: false,
          error: 'No se pudo actualizar el usuario'
        };
      }
      
      // Obtener el usuario actualizado
      const usuarioActualizado = obtenerUsuarioPorId(id);
      
      if (!usuarioActualizado) {
        return {
          success: false,
          error: 'Error al obtener usuario actualizado'
        };
      }
      
      return {
        success: true,
        data: usuarioActualizado,
        message: 'Usuario actualizado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al actualizar usuario'
      };
    }
  };

  // Elimina un usuario
  const fetchEliminarUsuario = async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      await simularDelay(600);
      
      const resultado = eliminarUsuario(id);
      
      if (!resultado) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }
      
      return {
        success: true,
        data: true,
        message: 'Usuario eliminado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al eliminar el usuario'
      };
    }
  };

  return {
    // Data
    usuarios,
    
    // Operaciones
    fetchUsuarios,
    fetchUsuarioPorId,
    fetchUsuarioPorEmail,
    fetchCrearUsuario,
    fetchActualizarUsuario,
    fetchEliminarUsuario
  };
};
