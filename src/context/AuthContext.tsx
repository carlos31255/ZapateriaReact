// CONTEXT DE AUTENTICACIÓN
// maneja el estado global de autenticación del usuario

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Usuario, UsuarioAutenticado, CredencialesLogin, DatosRegistro } from '../types';
import { useDatabase } from './DatabaseContext';
import {
  validarEmail,
  validarRUT,
  esMayorDeEdad
} from '../helpers/authService';

// Claves de localStorage
const STORAGE_KEYS = {
  USUARIO_ACTUAL: 'usuario'
};

// TIPOS

interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  estaAutenticado: boolean;
  cargando: boolean;
  error: string | null;
  iniciarSesion: (credenciales: CredencialesLogin) => Promise<UsuarioAutenticado | null>;
  registrarUsuario: (datos: DatosRegistro) => Promise<void>;
  cerrarSesionUsuario: () => Promise<void>;
  actualizarSesion: () => Promise<void>;
  limpiarError: () => void;
}

// ============================================
// CREACIÓN DEL CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// PROVIDER DEL CONTEXT

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { obtenerUsuarioPorEmail, crearUsuario } = useDatabase();
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simula delay de red
  const simularDelay = (ms: number = 800): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Obtiene el usuario actual de localStorage
  const obtenerUsuarioActual = (): UsuarioAutenticado | null => {
    const usuarioStr = localStorage.getItem(STORAGE_KEYS.USUARIO_ACTUAL);
    if (!usuarioStr) return null;
    
    try {
      return JSON.parse(usuarioStr);
    } catch {
      return null;
    }
  };

  // Verifica si hay una sesión activa al cargar la aplicación
  useEffect(() => {
    const verificarSesion = () => {
      try {
        const usuarioActual = obtenerUsuarioActual();
        if (usuarioActual && usuarioActual.logueado) {
          setUsuario(usuarioActual);
        }
      } catch (err) {
        console.error('Error al verificar sesión:', err);
      } finally {
        setCargando(false);
      }
    };

    verificarSesion();
  }, []);

  // Inicia sesión del usuario
  const iniciarSesion = async (credenciales: CredencialesLogin): Promise<UsuarioAutenticado | null> => {
    try {
      setCargando(true);
      setError(null);

      // Simular delay de red
      await simularDelay();

      // Validaciones
      if (!credenciales.email || !credenciales.contrasena) {
        throw new Error('Email y contraseña son requeridos');
      }

      if (!validarEmail(credenciales.email)) {
        throw new Error('Email no válido');
      }

      // Buscar usuario usando DatabaseContext
      const usuarioEncontrado = obtenerUsuarioPorEmail(credenciales.email);

      if (!usuarioEncontrado) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña
      if (usuarioEncontrado.contrasena !== credenciales.contrasena) {
        throw new Error('Contraseña incorrecta');
      }

      // Crear usuario autenticado (sin contraseña)
      const usuarioAutenticado: UsuarioAutenticado = {
        id: usuarioEncontrado.id,
        run: usuarioEncontrado.run,
        nombre: usuarioEncontrado.nombre,
        email: usuarioEncontrado.email,
        rol: usuarioEncontrado.rol,
        genero: usuarioEncontrado.genero,
        fechaNacimiento: usuarioEncontrado.fechaNacimiento,
        region: usuarioEncontrado.region,
        comuna: usuarioEncontrado.comuna,
        direccion: usuarioEncontrado.direccion,
        telefono: usuarioEncontrado.telefono,
        fechaRegistro: usuarioEncontrado.fechaRegistro,
        logueado: true
      };

      // Guardar sesión en localStorage
      localStorage.setItem(STORAGE_KEYS.USUARIO_ACTUAL, JSON.stringify(usuarioAutenticado));

      setUsuario(usuarioAutenticado);

      // Nota: El carrito se maneja en CartContext
      // Si se necesita vaciar el carrito para admins, hacerlo desde el componente

      return usuarioAutenticado;
    } catch (err: any) {
      const mensajeError = err.message || 'Error al iniciar sesión';
      setError(mensajeError);
      throw new Error(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  // Registra un nuevo usuario
  const registrarUsuario = async (datos: DatosRegistro): Promise<void> => {
    try {
      setCargando(true);
      setError(null);

      // Simular delay de red
      await simularDelay(1000);

      // Validaciones
      if (!datos.nombre || !datos.email || !datos.contrasena || !datos.run) {
        throw new Error('Todos los campos obligatorios deben estar completos');
      }

      if (!validarEmail(datos.email)) {
        throw new Error('Email no válido');
      }

      if (!validarRUT(datos.run)) {
        throw new Error('RUT no válido');
      }

      if (datos.contrasena.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (datos.contrasena !== datos.confirmarContrasena) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (datos.fechaNacimiento && !esMayorDeEdad(datos.fechaNacimiento)) {
        throw new Error('Debe ser mayor de 18 años para registrarse');
      }

      // Verificar si el email ya existe
      const usuarioExistente = obtenerUsuarioPorEmail(datos.email);
      if (usuarioExistente) {
        throw new Error('El email ya está registrado');
      }

      // Crear nuevo usuario usando DatabaseContext
      const nuevoUsuario: Omit<Usuario, 'id' | 'fechaRegistro'> = {
        run: datos.run,
        nombre: datos.nombre,
        email: datos.email,
        contrasena: datos.contrasena,
        rol: datos.rol || 'cliente',
        genero: datos.genero,
        fechaNacimiento: datos.fechaNacimiento,
        region: datos.region,
        comuna: datos.comuna,
        direccion: datos.direccion,
        telefono: datos.telefono
      };

      const usuarioCreado = crearUsuario(nuevoUsuario);

      // Crear usuario autenticado
      const usuarioAutenticado: UsuarioAutenticado = {
        id: usuarioCreado.id,
        run: usuarioCreado.run,
        nombre: usuarioCreado.nombre,
        email: usuarioCreado.email,
        rol: usuarioCreado.rol,
        genero: usuarioCreado.genero,
        fechaNacimiento: usuarioCreado.fechaNacimiento,
        region: usuarioCreado.region,
        comuna: usuarioCreado.comuna,
        direccion: usuarioCreado.direccion,
        telefono: usuarioCreado.telefono,
        fechaRegistro: usuarioCreado.fechaRegistro,
        logueado: true
      };

      // Guardar sesión en localStorage
      localStorage.setItem(STORAGE_KEYS.USUARIO_ACTUAL, JSON.stringify(usuarioAutenticado));

      setUsuario(usuarioAutenticado);
    } catch (err: any) {
      const mensajeError = err.message || 'Error al registrar usuario';
      setError(mensajeError);
      throw new Error(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  // Cierra la sesión del usuario
  const cerrarSesionUsuario = async (): Promise<void> => {
    try {
      setCargando(true);
      localStorage.removeItem(STORAGE_KEYS.USUARIO_ACTUAL);
      setUsuario(null);
      setError(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setCargando(false);
    }
  };

  // Actualiza la sesión del usuario con datos frescos de la base de datos
  const actualizarSesion = async (): Promise<void> => {
    try {
      if (!usuario) {
        throw new Error('No hay usuario logueado');
      }

      // Obtener datos actualizados del usuario desde la base de datos
      const usuarioActualizado = obtenerUsuarioPorEmail(usuario.email);

      if (!usuarioActualizado) {
        throw new Error('Usuario no encontrado');
      }

      // Crear usuario autenticado actualizado (sin contraseña)
      const usuarioAutenticadoActualizado: UsuarioAutenticado = {
        id: usuarioActualizado.id,
        run: usuarioActualizado.run,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email,
        rol: usuarioActualizado.rol,
        genero: usuarioActualizado.genero,
        fechaNacimiento: usuarioActualizado.fechaNacimiento,
        region: usuarioActualizado.region,
        comuna: usuarioActualizado.comuna,
        direccion: usuarioActualizado.direccion,
        telefono: usuarioActualizado.telefono,
        fechaRegistro: usuarioActualizado.fechaRegistro,
        logueado: true
      };

      // Actualizar localStorage
      localStorage.setItem(STORAGE_KEYS.USUARIO_ACTUAL, JSON.stringify(usuarioAutenticadoActualizado));

      // Actualizar estado
      setUsuario(usuarioAutenticadoActualizado);
    } catch (err) {
      console.error('Error al actualizar sesión:', err);
      throw err;
    }
  };

  // Limpia el error
  const limpiarError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    usuario,
    estaAutenticado: usuario !== null,
    cargando,
    error,
    iniciarSesion,
    registrarUsuario,
    cerrarSesionUsuario,
    actualizarSesion,
    limpiarError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// HOOK PERSONALIZADO

// Hook para usar el context de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};
