// VALIDACIONES COMUNES (reutilizables en varios formularios)


 /*Valida que un campo no esté vacío*/

export const validarRequerido = (valor: string, nombreCampo: string): string | null => {
  if (!valor.trim()) {
    return `${nombreCampo} es requerido`;
  }
  return null;
};

/* Valida que un campo select tenga un valor seleccionado */
export const validarSeleccion = (valor: string, nombreCampo: string): string | null => {
  if (!valor || valor === '') {
    return `Debe seleccionar ${nombreCampo}`;
  }
  return null;
};

/* Valida que un texto tenga una longitud mínima */
export const validarLongitudMinima = (
  valor: string, 
  minimo: number, 
  nombreCampo: string
): string | null => {
  if (valor.trim().length < minimo) {
    return `${nombreCampo} debe tener al menos ${minimo} caracteres`;
  }
  return null;
};

/* Valida que un texto tenga una longitud máxima */
export const validarLongitudMaxima = (
  valor: string, 
  maximo: number, 
  nombreCampo: string
): string | null => {
  if (valor.trim().length > maximo) {
    return `${nombreCampo} no puede tener más de ${maximo} caracteres`;
  }
  return null;
};

/* Valida que un valor esté dentro de un rango */
export const validarRango = (
  valor: number,
  minimo: number,
  maximo: number,
  nombreCampo: string
): string | null => {
  if (valor < minimo || valor > maximo) {
    return `${nombreCampo} debe estar entre ${minimo} y ${maximo}`;
  }
  return null;
};

/* Valida formato de email */
export const validarEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'El correo electrónico es requerido';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El formato del correo electrónico no es válido';
  }
  
  return null;
};

/* Valida teléfono chileno */
export const validarTelefono = (telefono: string): string | null => {
  if (!telefono.trim()) {
    return 'El teléfono es requerido';
  }
  
  // Limpiar el teléfono de caracteres no numéricos
  const telefonoLimpio = telefono.replace(/[^\d]/g, '');
  
  if (telefonoLimpio.length < 9) {
    return 'El teléfono debe tener al menos 9 dígitos';
  }
  
  if (telefonoLimpio.length > 15) {
    return 'El teléfono no puede tener más de 15 dígitos';
  }
  
  return null;
};

/*Valida que una fecha no sea futura */
export const validarFechaNoFutura = (fecha: string, nombreCampo: string): string | null => {
  if (!fecha) {
    return `${nombreCampo} es requerida`;
  }
  
  const fechaIngresada = new Date(fecha);
  const hoy = new Date();
  
  if (fechaIngresada > hoy) {
    return `${nombreCampo} no puede ser en el futuro`;
  }
  
  return null;
};

/* Valida que solo contenga letras y espacios */
export const validarSoloLetras = (valor: string, nombreCampo: string): string | null => {
  const regex = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/;
  if (!regex.test(valor)) {
    return `${nombreCampo} solo puede contener letras y espacios`;
  }
  return null;
};

/* Valida que solo contenga números */
export const validarSoloNumeros = (valor: string, nombreCampo: string): string | null => {
  const regex = /^\d+$/;
  if (!regex.test(valor)) {
    return `${nombreCampo} solo puede contener números`;
  }
  return null;
};
