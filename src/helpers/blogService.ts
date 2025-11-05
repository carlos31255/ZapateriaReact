// Servicio de blog - Funciones auxiliares
// La lógica CRUD está en DatabaseContext

import type { ArticuloBlog } from '../types';

export const formatearFecha = (fecha: string): string => {
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const buscarArticulos = (articulos: ArticuloBlog[], termino: string): ArticuloBlog[] => {
  if (!termino.trim()) return articulos;
  const terminoLower = termino.toLowerCase();
  return articulos.filter(a =>
    a.titulo.toLowerCase().includes(terminoLower) ||
    a.resumen.toLowerCase().includes(terminoLower) ||
    a.contenido.toLowerCase().includes(terminoLower)
  );
};

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
