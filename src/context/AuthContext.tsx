// CONTEXT DE AUTENTICACIÓN
// maneja el estado global de autenticación del usuario

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UsuarioAutenticado, CredencialesLogin, DatosRegistro } from '../types';
import { authService } from '../services/authService';
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
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      // Validaciones básicas
      if (!credenciales.email || !credenciales.contrasena) {
        throw new Error('Email y contraseña son requeridos');
      }

      if (!validarEmail(credenciales.email)) {
        throw new Error('Email no válido');
      }

      // Llamada al servicio de autenticación
      const usuarioAutenticado = await authService.login(credenciales);

      // Guardar sesión en localStorage
      localStorage.setItem(STORAGE_KEYS.USUARIO_ACTUAL, JSON.stringify(usuarioAutenticado));

      setUsuario(usuarioAutenticado);

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

      // Llamada al servicio de registro
      await authService.register(datos);

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
      localStorage.removeItem(STORAGE_KEYS.USUARIO_ACTUAL);
      setUsuario(null);
      setError(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Actualiza la sesión del usuario
  const actualizarSesion = async (): Promise<void> => {
    // Implementación pendiente o simplificada por ahora
    // Podría requerir un endpoint de "me" o "refresh token"
    console.log('Actualizar sesión no implementado completamente');
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
