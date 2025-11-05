// ============================================
// SERVICIO DE VALIDACIONES
// Solo contiene funciones de validación puras
// ============================================

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

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

export const formatearRUT = (rut: string): string => {
  const rutLimpio = rut.replace(/[.-]/g, '');
  if (rutLimpio.length < 2) return rut;
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);
  let cuerpoFormateado = '';
  let contador = 0;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    if (contador === 3) {
      cuerpoFormateado = '.' + cuerpoFormateado;
      contador = 0;
    }
    cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    contador++;
  }
  return `${cuerpoFormateado}-${dv}`;
};
