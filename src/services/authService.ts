// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================
// Este servicio maneja el login, registro y sesión de usuarios usando Promesas y simulando llamadas API

import type { Usuario, CredencialesLogin, DatosRegistro, UsuarioAutenticado, AuthResponse } from '../types';
import { obtenerUsuarioPorEmail, crearUsuario, getStorageKeys } from '../data/database';

const STORAGE_KEYS = getStorageKeys();

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

// Simula un delay de red para hacer más realista la experiencia
const simularDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Valida formato de email
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Valida formato de RUT chileno
export const validarRUT = (rut: string): boolean => {
  const rutLimpio = rut.replace(/[.-]/g, '');
  if (rutLimpio.length < 2) return false;

  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvFinal = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvFinal;
};

// Verifica si el usuario es mayor de edad
export const esMayorDeEdad = (fechaNacimiento: string): boolean => {
  const hoy = new Date();
  const fechaNac = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }

  return edad >= 18;
};

// ============================================
// SERVICIO DE LOGIN CON PROMESAS
// ============================================

// Login de usuario usando Promesas
export const login = (credenciales: CredencialesLogin): Promise<AuthResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Simular delay de red
      await simularDelay();

      // Validaciones
      if (!credenciales.email || !credenciales.contrasena) {
        reject({
          success: false,
          error: 'Email y contraseña son requeridos'
        });
        return;
      }

      if (!validarEmail(credenciales.email)) {
        reject({
          success: false,
          error: 'Email no válido'
        });
        return;
      }

      // Buscar usuario en la base de datos
      const usuario = obtenerUsuarioPorEmail(credenciales.email);

      if (!usuario) {
        reject({
          success: false,
          error: 'Usuario no encontrado'
        });
        return;
      }

      // Verificar contraseña
      if (usuario.contrasena !== credenciales.contrasena) {
        reject({
          success: false,
          error: 'Contraseña incorrecta'
        });
        return;
      }

      // Crear usuario autenticado (sin contraseña)
      const usuarioAutenticado: UsuarioAutenticado = {
        id: usuario.id,
        run: usuario.run,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        genero: usuario.genero,
        fechaNacimiento: usuario.fechaNacimiento,
        region: usuario.region,
        comuna: usuario.comuna,
        direccion: usuario.direccion,
        telefono: usuario.telefono,
        fechaRegistro: usuario.fechaRegistro,
        logueado: true
      };

      // Guardar sesión en localStorage
      localStorage.setItem(STORAGE_KEYS.USUARIO_ACTUAL, JSON.stringify(usuarioAutenticado));

      // Respuesta exitosa
      resolve({
        success: true,
        usuario: usuarioAutenticado,
        message: 'Login exitoso'
      });

    } catch (error) {
      reject({
        success: false,
        error: 'Error al procesar el login'
      });
    }
  });
};

// ============================================
// SERVICIO DE REGISTRO CON PROMESAS
// ============================================

// Registro de nuevo usuario usando Promesas
export const registrar = (datos: DatosRegistro): Promise<AuthResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Simular delay de red
      await simularDelay(1000);

      // Validaciones
      if (!datos.nombre || !datos.email || !datos.contrasena || !datos.run) {
        reject({
          success: false,
          error: 'Todos los campos obligatorios deben estar completos'
        });
        return;
      }

      if (!validarEmail(datos.email)) {
        reject({
          success: false,
          error: 'Email no válido'
        });
        return;
      }

      if (!validarRUT(datos.run)) {
        reject({
          success: false,
          error: 'RUT no válido'
        });
        return;
      }

      if (datos.contrasena.length < 6) {
        reject({
          success: false,
          error: 'La contraseña debe tener al menos 6 caracteres'
        });
        return;
      }

      if (datos.contrasena !== datos.confirmarContrasena) {
        reject({
          success: false,
          error: 'Las contraseñas no coinciden'
        });
        return;
      }

      if (datos.fechaNacimiento && !esMayorDeEdad(datos.fechaNacimiento)) {
        reject({
          success: false,
          error: 'Debe ser mayor de 18 años para registrarse'
        });
        return;
      }

      // Verificar si el email ya existe
      const usuarioExistente = obtenerUsuarioPorEmail(datos.email);
      if (usuarioExistente) {
        reject({
          success: false,
          error: 'El email ya está registrado'
        });
        return;
      }

      // Crear nuevo usuario
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

      // Respuesta exitosa
      resolve({
        success: true,
        usuario: usuarioAutenticado,
        message: 'Registro exitoso'
      });

    } catch (error) {
      reject({
        success: false,
        error: error instanceof Error ? error.message : 'Error al procesar el registro'
      });
    }
  });
};

// GESTIÓN DE SESIÓN

// Obtiene el usuario actual de la sesión
export const obtenerUsuarioActual = (): UsuarioAutenticado | null => {
  const usuarioStr = localStorage.getItem(STORAGE_KEYS.USUARIO_ACTUAL);
  if (!usuarioStr) return null;
  
  try {
    return JSON.parse(usuarioStr);
  } catch {
    return null;
  }
};

// Cierra la sesión del usuario
export const cerrarSesion = (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem(STORAGE_KEYS.USUARIO_ACTUAL);
    resolve();
  });
};

// Verifica si hay un usuario autenticado
export const estaAutenticado = (): boolean => {
  const usuario = obtenerUsuarioActual();
  return usuario !== null && usuario.logueado === true;
};

// Verifica si el usuario tiene un rol específico
export const tieneRol = (rol: 'cliente' | 'vendedor' | 'administrador'): boolean => {
  const usuario = obtenerUsuarioActual();
  return usuario !== null && usuario.rol === rol;
};
