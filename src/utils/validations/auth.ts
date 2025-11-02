// VALIDACIONES DE AUTENTICACIÓN

import { validarEmail, validarRequerido, validarLongitudMinima, validarSoloLetras } from './common';
import type { ValidationError } from './types';

 
/* Valida contraseña */

export const validarContrasena = (contrasena: string): string | null => {
  if (!contrasena) {
    return 'La contraseña es requerida';
  }
  
  if (contrasena.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  
  if (contrasena.length > 50) {
    return 'La contraseña no puede tener más de 50 caracteres';
  }
  
  return null;
};

/* Valida confirmación de contraseña */
export const validarConfirmacionContrasena = (
  contrasena: string, 
  confirmacion: string
): string | null => {
  if (!confirmacion) {
    return 'Debe confirmar la contraseña';
  }
  
  if (contrasena !== confirmacion) {
    return 'Las contraseñas no coinciden';
  }
  
  return null;
};

/* Valida RUT con dígito verificador */
export const validarRUT = (rut: string): string | null => {
  if (!rut.trim()) {
    return 'El RUT es requerido';
  }
  
  // Limpiar el RUT de puntos y guiones
  const rutLimpio = rut.replace(/[.-]/g, '');
  
  if (rutLimpio.length < 2) {
    return 'El RUT es demasiado corto';
  }
  
  if (rutLimpio.length > 9) {
    return 'El RUT es demasiado largo';
  }
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();
  
  // Validar que el cuerpo solo contenga números
  if (!/^\d+$/.test(cuerpo)) {
    return 'El RUT debe contener solo números antes del dígito verificador';
  }
  
  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dvEsperado = 11 - (suma % 11);
  const dvFinal = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  
  if (dv !== dvFinal) {
    return 'El RUT no es válido';
  }
  
  return null;
};


 /* Valida nombre completo*/
 
export const validarNombre = (nombre: string): string | null => {
  const errorRequerido = validarRequerido(nombre, 'El nombre');
  if (errorRequerido) return errorRequerido;
  
  const errorLongitud = validarLongitudMinima(nombre, 3, 'El nombre');
  if (errorLongitud) return errorLongitud;
  
  if (nombre.trim().length > 100) {
    return 'El nombre no puede tener más de 100 caracteres';
  }
  
  const errorLetras = validarSoloLetras(nombre, 'El nombre');
  if (errorLetras) return errorLetras;
  
  return null;
};

/* Valida fecha de nacimiento y mayoría de edad */
export const validarFechaNacimiento = (fecha: string): string | null => {
  if (!fecha) {
    return 'La fecha de nacimiento es requerida';
  }
  
  const fechaNac = new Date(fecha);
  const hoy = new Date();
  
  // Verificar que la fecha no sea futura
  if (fechaNac > hoy) {
    return 'La fecha de nacimiento no puede ser en el futuro';
  }
  
  // Calcular edad
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  
  // Validar mayoría de edad
  if (edad < 18) {
    return 'Debes ser mayor de 18 años para registrarte';
  }
  
  // Validar edad máxima razonable
  if (edad > 120) {
    return 'La fecha de nacimiento no es válida';
  }
  
  return null;
};


/* Valida formulario completo de login*/
 
export const validarFormularioLogin = (
  email: string, 
  contrasena: string
): ValidationError[] => {
  const errores: ValidationError[] = [];
  
  const errorEmail = validarEmail(email);
  if (errorEmail) {
    errores.push({ field: 'email', message: errorEmail });
  }
  
  const errorContrasena = validarContrasena(contrasena);
  if (errorContrasena) {
    errores.push({ field: 'contrasena', message: errorContrasena });
  }
  
  return errores;
};

/**
 * Datos de registro para validación
 */
export interface DatosRegistroValidacion {
  run: string;
  nombre: string;
  email: string;
  contrasena: string;
  confirmarContrasena: string;
  telefono: string;
  genero: string;
  fechaNacimiento: string;
  region: string;
  comuna: string;
  direccion: string;
}

/**
 * Valida formulario completo de registro
 */
export const validarFormularioRegistro = (
  datos: DatosRegistroValidacion
): ValidationError[] => {
  const errores: ValidationError[] = [];
  
  // Validar RUT
  const errorRut = validarRUT(datos.run);
  if (errorRut) {
    errores.push({ field: 'run', message: errorRut });
  }
  
  // Validar nombre
  const errorNombre = validarNombre(datos.nombre);
  if (errorNombre) {
    errores.push({ field: 'nombre', message: errorNombre });
  }
  
  // Validar email
  const errorEmail = validarEmail(datos.email);
  if (errorEmail) {
    errores.push({ field: 'email', message: errorEmail });
  }
  
  // Validar contraseña
  const errorContrasena = validarContrasena(datos.contrasena);
  if (errorContrasena) {
    errores.push({ field: 'contrasena', message: errorContrasena });
  }
  
  // Validar confirmación de contraseña
  const errorConfirmacion = validarConfirmacionContrasena(
    datos.contrasena, 
    datos.confirmarContrasena
  );
  if (errorConfirmacion) {
    errores.push({ field: 'confirmarContrasena', message: errorConfirmacion });
  }
  
  // Validar teléfono
  const errorTelefono = validarRequerido(datos.telefono, 'El teléfono');
  if (errorTelefono) {
    errores.push({ field: 'telefono', message: errorTelefono });
  }
  
  // Validar género
  if (!datos.genero || datos.genero === '') {
    errores.push({ field: 'genero', message: 'Debe seleccionar un género' });
  }
  
  // Validar fecha de nacimiento
  const errorFecha = validarFechaNacimiento(datos.fechaNacimiento);
  if (errorFecha) {
    errores.push({ field: 'fechaNacimiento', message: errorFecha });
  }
  
  // Validar región
  if (!datos.region || datos.region === '') {
    errores.push({ field: 'region', message: 'Debe seleccionar una región' });
  }
  
  // Validar comuna
  const errorComuna = validarRequerido(datos.comuna, 'La comuna');
  if (errorComuna) {
    errores.push({ field: 'comuna', message: errorComuna });
  }
  
  // Validar dirección
  const errorDireccion = validarRequerido(datos.direccion, 'La dirección');
  if (errorDireccion) {
    errores.push({ field: 'direccion', message: errorDireccion });
  }
  
  return errores;
};
