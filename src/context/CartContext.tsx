// ============================================
// CONTEXT DE CARRITO DE COMPRAS
// ============================================
// Este context maneja el estado global del carrito de compras

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ProductoCarrito, Carrito } from '../types';
import {
  axiosObtenerCarrito,
  axiosAgregarAlCarrito,
  axiosActualizarCantidad,
  axiosEliminarDelCarrito,
  axiosVaciarCarrito
} from '../services/cartService';

// ============================================
// TIPOS
// ============================================

interface CartContextType {
  carrito: Carrito;
  cargando: boolean;
  error: string | null;
  agregarProducto: (productoId: number, cantidad?: number) => Promise<void>;
  actualizarCantidad: (productoId: number, cantidad: number) => Promise<void>;
  eliminarProducto: (productoId: number) => Promise<void>;
  vaciarCarrito: () => Promise<void>;
  recargarCarrito: () => Promise<void>;
  limpiarError: () => void;
}

// ============================================
// CREACIÓN DEL CONTEXT
// ============================================

const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================
// PROVIDER DEL CONTEXT
// ============================================

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [carrito, setCarrito] = useState<Carrito>({
    items: [],
    total: 0,
    cantidadTotal: 0
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga el carrito al montar el componente
  useEffect(() => {
    cargarCarrito();
  }, []);

  // Función para cargar el carrito
  const cargarCarrito = async () => {
    try {
      setCargando(true);
      const carritoActual = await axiosObtenerCarrito();
      setCarrito(carritoActual);
    } catch (err) {
      console.error('Error al cargar carrito:', err);
      setError('Error al cargar el carrito');
    } finally {
      setCargando(false);
    }
  };

  // Agrega un producto al carrito
  const agregarProducto = async (productoId: number, cantidad: number = 1): Promise<void> => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await axiosAgregarAlCarrito(productoId, cantidad);

      if (respuesta.success && respuesta.data) {
        setCarrito(respuesta.data);
      } else {
        throw new Error(respuesta.error || 'Error al agregar producto');
      }
    } catch (err: any) {
      const mensajeError = err.message || 'Error al agregar producto al carrito';
      setError(mensajeError);
      throw new Error(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  // Actualiza la cantidad de un producto en el carrito
  const actualizarCantidad = async (productoId: number, cantidad: number): Promise<void> => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await axiosActualizarCantidad(productoId, cantidad);

      if (respuesta.success && respuesta.data) {
        setCarrito(respuesta.data);
      } else {
        throw new Error(respuesta.error || 'Error al actualizar cantidad');
      }
    } catch (err: any) {
      const mensajeError = err.message || 'Error al actualizar la cantidad';
      setError(mensajeError);
      throw new Error(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  // Elimina un producto del carrito
  const eliminarProducto = async (productoId: number): Promise<void> => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await axiosEliminarDelCarrito(productoId);

      if (respuesta.success && respuesta.data) {
        setCarrito(respuesta.data);
      } else {
        throw new Error(respuesta.error || 'Error al eliminar producto');
      }
    } catch (err: any) {
      const mensajeError = err.message || 'Error al eliminar producto del carrito';
      setError(mensajeError);
      throw new Error(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  // Vacía el carrito completamente
  const vaciarCarrito = async (): Promise<void> => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await axiosVaciarCarrito();

      if (respuesta.success && respuesta.data) {
        setCarrito(respuesta.data);
      } else {
        throw new Error(respuesta.error || 'Error al vaciar carrito');
      }
    } catch (err: any) {
      const mensajeError = err.message || 'Error al vaciar el carrito';
      setError(mensajeError);
      throw new Error(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  // Recarga el carrito desde localStorage
  const recargarCarrito = async (): Promise<void> => {
    await cargarCarrito();
  };

  // Limpia el error
  const limpiarError = () => {
    setError(null);
  };

  const value: CartContextType = {
    carrito,
    cargando,
    error,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    recargarCarrito,
    limpiarError
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ============================================
// HOOK PERSONALIZADO
// ============================================

// Hook para usar el context del carrito
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  
  return context;
};
