// CONTEXT DE AUTENTICACIÓN
// maneja el estado global de autenticación del usuario

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UsuarioAutenticado, CredencialesLogin, DatosRegistro } from '../types';
import {
  login,
  registrar,
  cerrarSesion,
  obtenerUsuarioActual,
  estaAutenticado as verificarAutenticacion
} from '../services/authService';

// TIPOS

interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  estaAutenticado: boolean;
  cargando: boolean;
  error: string | null;
  iniciarSesion: (credenciales: CredencialesLogin) => Promise<UsuarioAutenticado | null>;
  registrarUsuario: (datos: DatosRegistro) => Promise<void>;
  cerrarSesionUsuario: () => Promise<void>;
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

  // Verifica si hay una sesión activa al cargar la aplicación
  useEffect(() => {
    const verificarSesion = () => {
      try {
        const usuarioActual = obtenerUsuarioActual();
        if (usuarioActual && verificarAutenticacion()) {
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

      const respuesta = await login(credenciales);

      if (respuesta.success && respuesta.usuario) {
        setUsuario(respuesta.usuario);
        return respuesta.usuario;
      } else {
        // Si el login falló, lanzar error
        const mensajeError = respuesta.error || 'Error al iniciar sesión';
        setError(mensajeError);
        throw new Error(mensajeError);
      }
    } catch (err: any) {
      const mensajeError = err.message || err.error || 'Error al iniciar sesión';
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

      const respuesta = await registrar(datos);

      if (respuesta.success && respuesta.usuario) {
        setUsuario(respuesta.usuario);
      }
    } catch (err: any) {
      const mensajeError = err.error || 'Error al registrar usuario';
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
      await cerrarSesion();
      setUsuario(null);
      setError(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setCargando(false);
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
