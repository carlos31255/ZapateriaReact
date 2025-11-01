// SERVICIO DE CARRITO CON AXIOS

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { ProductoCarrito, Carrito, ApiResponse } from '../types';
import { obtenerProductoPorId } from '../data/database';
import { getStorageKeys } from '../data/database';

const STORAGE_KEYS = getStorageKeys();

// Configuración de Axios simulado - En producción, esto apuntaría a una API real
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Simula respuestas de API localmente
const simularRespuestaAxios = async <T>(
  data: T,
  delay: number = 500
): Promise<AxiosResponse<ApiResponse<T>>> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return {
    data: {
      success: true,
      data,
      message: 'Operación exitosa'
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      headers: {} as any
    }
  };
};

// FUNCIONES DE CARRITO

// Obtiene los items del carrito desde localStorage
const obtenerItemsCarrito = (): ProductoCarrito[] => {
  const carritoStr = localStorage.getItem(STORAGE_KEYS.CARRITO);
  if (!carritoStr) return [];
  
  try {
    return JSON.parse(carritoStr);
  } catch {
    return [];
  }
};

// Guarda los items del carrito en localStorage
const guardarItemsCarrito = (items: ProductoCarrito[]): void => {
  localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify(items));
};

// Calcula el total del carrito
const calcularTotal = (items: ProductoCarrito[]): number => {
  return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
};

// Calcula la cantidad total de items
const calcularCantidadTotal = (items: ProductoCarrito[]): number => {
  return items.reduce((total, item) => total + item.cantidad, 0);
};

// OPERACIONES DEL CARRITO CON AXIOS

// Obtiene el carrito completo usando Axios simulado
export const axiosObtenerCarrito = async (): Promise<Carrito> => {
  try {
    const items = obtenerItemsCarrito();
    const response = await simularRespuestaAxios<ProductoCarrito[]>(items);
    
    const carrito: Carrito = {
      items: response.data.data || [],
      total: calcularTotal(response.data.data || []),
      cantidadTotal: calcularCantidadTotal(response.data.data || [])
    };
    
    return carrito;
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    return {
      items: [],
      total: 0,
      cantidadTotal: 0
    };
  }
};

// Agrega un producto al carrito usando Axios
export const axiosAgregarAlCarrito = async (
  productoId: number,
  cantidad: number = 1
): Promise<ApiResponse<Carrito>> => {
  try {
    // Obtener producto de la base de datos
    const producto = obtenerProductoPorId(productoId);
    
    if (!producto) {
      return {
        success: false,
        error: 'Producto no encontrado'
      };
    }
    
    if (producto.stock < cantidad) {
      return {
        success: false,
        error: 'Stock insuficiente'
      };
    }
    
    if (cantidad <= 0) {
      return {
        success: false,
        error: 'La cantidad debe ser mayor a 0'
      };
    }
    
    // Obtener items actuales del carrito
    const items = obtenerItemsCarrito();
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = items.find(item => item.id === productoId);
    
    if (itemExistente) {
      // Verificar stock disponible
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (nuevaCantidad > producto.stock) {
        return {
          success: false,
          error: 'No hay suficiente stock disponible'
        };
      }
      
      // Actualizar cantidad
      itemExistente.cantidad = nuevaCantidad;
    } else {
      // Agregar nuevo item
      const nuevoItem: ProductoCarrito = {
        ...producto,
        cantidad
      };
      items.push(nuevoItem);
    }
    
    // Guardar carrito actualizado
    guardarItemsCarrito(items);
    
    // Simular respuesta de Axios
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const carrito: Carrito = {
      items,
      total: calcularTotal(items),
      cantidadTotal: calcularCantidadTotal(items)
    };
    
    return {
      success: true,
      data: carrito,
      message: 'Producto agregado al carrito'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al agregar producto al carrito'
    };
  }
};

// Actualiza la cantidad de un item en el carrito usando Axios
export const axiosActualizarCantidad = async (
  productoId: number,
  cantidad: number
): Promise<ApiResponse<Carrito>> => {
  try {
    if (cantidad < 0) {
      return {
        success: false,
        error: 'La cantidad no puede ser negativa'
      };
    }
    
    const items = obtenerItemsCarrito();
    const item = items.find(i => i.id === productoId);
    
    if (!item) {
      return {
        success: false,
        error: 'Producto no encontrado en el carrito'
      };
    }
    
    // Verificar stock disponible
    const producto = obtenerProductoPorId(productoId);
    if (producto && cantidad > producto.stock) {
      return {
        success: false,
        error: 'Stock insuficiente'
      };
    }
    
    if (cantidad === 0) {
      // Si la cantidad es 0, eliminar el item
      return await axiosEliminarDelCarrito(productoId);
    }
    
    // Actualizar cantidad
    item.cantidad = cantidad;
    guardarItemsCarrito(items);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const carrito: Carrito = {
      items,
      total: calcularTotal(items),
      cantidadTotal: calcularCantidadTotal(items)
    };
    
    return {
      success: true,
      data: carrito,
      message: 'Cantidad actualizada'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al actualizar cantidad'
    };
  }
};

// Elimina un producto del carrito usando Axios
export const axiosEliminarDelCarrito = async (
  productoId: number
): Promise<ApiResponse<Carrito>> => {
  try {
    let items = obtenerItemsCarrito();
    const itemIndex = items.findIndex(i => i.id === productoId);
    
    if (itemIndex === -1) {
      return {
        success: false,
        error: 'Producto no encontrado en el carrito'
      };
    }
    
    // Eliminar item
    items = items.filter(i => i.id !== productoId);
    guardarItemsCarrito(items);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const carrito: Carrito = {
      items,
      total: calcularTotal(items),
      cantidadTotal: calcularCantidadTotal(items)
    };
    
    return {
      success: true,
      data: carrito,
      message: 'Producto eliminado del carrito'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al eliminar producto del carrito'
    };
  }
};

// Vacía el carrito completamente usando Axios
export const axiosVaciarCarrito = async (): Promise<ApiResponse<Carrito>> => {
  try {
    guardarItemsCarrito([]);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const carritoVacio: Carrito = {
      items: [],
      total: 0,
      cantidadTotal: 0
    };
    
    return {
      success: true,
      data: carritoVacio,
      message: 'Carrito vaciado'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al vaciar el carrito'
    };
  }
};

// FUNCIONES DE UTILIDAD

// Obtiene el número de items en el carrito
export const obtenerContadorCarrito = (): number => {
  const items = obtenerItemsCarrito();
  return calcularCantidadTotal(items);
};

// Calcula subtotal sin descuentos
export const calcularSubtotal = (items: ProductoCarrito[]): number => {
  return calcularTotal(items);
};

// Aplica descuento al total
export const aplicarDescuento = (total: number, porcentaje: number): number => {
  return total * (1 - porcentaje / 100);
};

// Verifica si el carrito está vacío
export const carritoVacio = (): boolean => {
  const items = obtenerItemsCarrito();
  return items.length === 0;
};

// Formatea precio chileno
export const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(precio);
};
