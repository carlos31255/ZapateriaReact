// SERVICIO DE AUTENTICACIÓN
// ⚠️ PARCIALMENTE DEPRECADO
// ⚠️ Lógica de autenticación movida a AuthContext
// ⚠️ Solo se mantienen funciones de validación (validarEmail, validarRUT, esMayorDeEdad)

import type { Usuario, CredencialesLogin, DatosRegistro, UsuarioAutenticado, AuthResponse, ApiResponse } from '../types';
import { getStorageKeys } from '../data/database';

export { getStorageKeys }; // Re-exportar para uso en otros módulos

const STORAGE_KEYS = getStorageKeys();

// ============================================
// FUNCIONES DE VALIDACIÓN (ACTIVAS)
// ============================================

// Simula un delay de red para hacer más realista la experiencia
const simularDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Exportar funciones de utilidad para validaciones
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

// SERVICIO DE LOGIN CON PROMESAS

// Login de usuario - Devuelve una Promesa (sintaxis moderna con async/await)
export const login = async (credenciales: CredencialesLogin): Promise<AuthResponse> => {
  try {
    // Simular delay de red
    await simularDelay();

    // Validaciones
    if (!credenciales.email || !credenciales.contrasena) {
      return {
        success: false,
        error: 'Email y contraseña son requeridos'
      };
    }

    if (!validarEmail(credenciales.email)) {
      return {
        success: false,
        error: 'Email no válido'
      };
    }

    // Buscar usuario en la base de datos
    const usuario = obtenerUsuarioPorEmail(credenciales.email);

    if (!usuario) {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }

    // Verificar contraseña
    if (usuario.contrasena !== credenciales.contrasena) {
      return {
        success: false,
        error: 'Contraseña incorrecta'
      };
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
    return {
      success: true,
      usuario: usuarioAutenticado,
      message: 'Login exitoso'
    };

  } catch (error) {
    return {
      success: false,
      error: 'Error al procesar el login'
    };
  }
};

// SERVICIO DE REGISTRO CON PROMESAS

// Registro de nuevo usuario - Devuelve una Promesa (sintaxis moderna con async/await)
export const registrar = async (datos: DatosRegistro): Promise<AuthResponse> => {
  try {
    // Simular delay de red
    await simularDelay(1000);

    // Validaciones
    if (!datos.nombre || !datos.email || !datos.contrasena || !datos.run) {
      return {
        success: false,
        error: 'Todos los campos obligatorios deben estar completos'
      };
    }

    if (!validarEmail(datos.email)) {
      return {
        success: false,
        error: 'Email no válido'
      };
    }

    if (!validarRUT(datos.run)) {
      return {
        success: false,
        error: 'RUT no válido'
      };
    }

    if (datos.contrasena.length < 6) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      };
    }

    if (datos.contrasena !== datos.confirmarContrasena) {
      return {
        success: false,
        error: 'Las contraseñas no coinciden'
      };
    }

    if (datos.fechaNacimiento && !esMayorDeEdad(datos.fechaNacimiento)) {
      return {
        success: false,
        error: 'Debe ser mayor de 18 años para registrarse'
      };
    }

    // Verificar si el email ya existe
    const usuarioExistente = obtenerUsuarioPorEmail(datos.email);
    if (usuarioExistente) {
      return {
        success: false,
        error: 'El email ya está registrado'
      };
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
    return {
      success: true,
      usuario: usuarioAutenticado,
      message: 'Registro exitoso'
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al procesar el registro'
    };
  }
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

// GESTIÓN DE USUARIOS

// Obtiene un usuario por su ID
export const obtenerUsuarioPorId = async (id: string): Promise<ApiResponse<Usuario>> => {
  try {
    await simularDelay(300);
    
    const usuario = getUsuarioById(id);
    
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

// Actualiza los datos de un usuario
export const actualizarUsuario = async (usuario: Usuario): Promise<ApiResponse<Usuario>> => {
  try {
    await simularDelay(500);
    
    const exito = updateUsuario(usuario.id, usuario);
    
    if (!exito) {
      return {
        success: false,
        error: 'No se pudo actualizar el usuario'
      };
    }
    
    // Obtener el usuario actualizado
    const usuarioActualizado = getUsuarioById(usuario.id);
    
    if (!usuarioActualizado) {
      return {
        success: false,
        error: 'Error al obtener usuario actualizado'
      };
    }
    
    // Si es el usuario actual, actualizar la sesión
    const usuarioActual = obtenerUsuarioActual();
    if (usuarioActual && usuarioActual.id === usuario.id) {
      const usuarioAutenticado: UsuarioAutenticado = {
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
      localStorage.setItem(STORAGE_KEYS.USUARIO_ACTUAL, JSON.stringify(usuarioAutenticado));
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
