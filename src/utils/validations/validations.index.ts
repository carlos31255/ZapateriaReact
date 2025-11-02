// Punto de entrada para todas las validaciones
// Tipos
export type { ValidationError, ValidationResult } from './types';

// Validaciones comunes
export {
  validarRequerido,
  validarSeleccion,
  validarLongitudMinima,
  validarLongitudMaxima,
  validarRango,
  validarEmail,
  validarTelefono,
  validarFechaNoFutura,
  validarSoloLetras,
  validarSoloNumeros
} from './common';

// Validaciones de autenticación
export {
  validarContrasena,
  validarConfirmacionContrasena,
  validarRUT,
  validarNombre,
  validarFechaNacimiento,
  validarFormularioLogin,
  validarFormularioRegistro,
  type DatosRegistroValidacion
} from './auth';
