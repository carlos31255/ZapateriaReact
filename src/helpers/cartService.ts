// Servicio de carrito - Funciones auxiliares
// La lógica del carrito está en CartContext

import type { ProductoCarrito } from '../types';

export const calcularSubtotal = (item: ProductoCarrito): number => {
  return item.precio * item.cantidad;
};

export const calcularTotal = (items: ProductoCarrito[]): number => {
  return items.reduce((total, item) => total + calcularSubtotal(item), 0);
};

export const calcularCantidadTotal = (items: ProductoCarrito[]): number => {
  return items.reduce((total, item) => total + item.cantidad, 0);
};

export const formatearTotalCarrito = (items: ProductoCarrito[]): string => {
  const total = calcularTotal(items);
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(total);
};
