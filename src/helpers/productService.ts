// Servicio de productos - Funciones auxiliares
// La lógica CRUD está en DatabaseContext

import type { Producto } from '../types';

export const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(precio);
};

export const buscarProductos = (productos: Producto[], termino: string): Producto[] => {
  if (!termino.trim()) return productos;
  const terminoLower = termino.toLowerCase();
  return productos.filter(p =>
    p.nombre.toLowerCase().includes(terminoLower) ||
    p.descripcion.toLowerCase().includes(terminoLower)
  );
};

export const ordenarPorPrecio = (productos: Producto[], orden: 'asc' | 'desc' = 'asc'): Producto[] => {
  return [...productos].sort((a, b) => {
    return orden === 'asc' ? a.precio - b.precio : b.precio - a.precio;
  });
};
