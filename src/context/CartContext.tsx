// CONTEXT DE CARRITO DE COMPRAS
// Gestiona el carrito con useState

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Carrito, TallaCalzado, ProductoCarrito } from '../types';
import { useDatabase } from './DatabaseContext';

// TIPOS

interface CartContextType {
  carrito: Carrito;
  agregarProducto: (productoId: number, cantidad?: number, talla?: TallaCalzado) => void;
  actualizarCantidad: (productoId: number, cantidad: number, talla?: TallaCalzado) => void;
  eliminarProducto: (productoId: number, talla?: TallaCalzado) => void;
  vaciarCarrito: () => void;
  obtenerCantidadTotal: () => number;
  obtenerTotal: () => number;
}

// CREACIÓN DEL CONTEXT

const CartContext = createContext<CartContextType | undefined>(undefined);

// PROVIDER DEL CONTEXT

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { obtenerProductoPorId } = useDatabase();

  // Estado del carrito
  const [carrito, setCarrito] = useState<Carrito>(() => {
    // Intentar cargar desde localStorage
    const saved = localStorage.getItem('carrito');
    if (saved) {
      try {
        const items = JSON.parse(saved);
        const total = items.reduce((sum: number, item: ProductoCarrito) => sum + (item.precio * item.cantidad), 0);
        const cantidadTotal = items.reduce((sum: number, item: ProductoCarrito) => sum + item.cantidad, 0);
        return { items, total, cantidadTotal };
      } catch {
        return { items: [], total: 0, cantidadTotal: 0 };
      }
    }
    return { items: [], total: 0, cantidadTotal: 0 };
  });

  // Sincronizar con localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito.items));
  }, [carrito]);

  // Agrega un producto al carrito
  const agregarProducto = (productoId: number, cantidad: number = 1, talla?: TallaCalzado): void => {
    const producto = obtenerProductoPorId(productoId);
    if (!producto) {
      console.error('Producto no encontrado');
      return;
    }

    // Determinar el stock disponible y el idInventario según si hay talla o no
    let stockDisponible = producto.stock;
    let idInventario: number | undefined;

    if (talla && producto.stockPorTalla) {
      const stockTalla = producto.stockPorTalla.find(st => st.talla === talla);
      if (stockTalla) {
        stockDisponible = stockTalla.stock;
        idInventario = stockTalla.idInventario;
      }
    }

    if (stockDisponible < cantidad) {
      console.error('Stock insuficiente');
      return;
    }

    // Buscar item existente con la misma talla
    const itemExistente = carrito.items.find(item =>
      item.id === productoId && item.tallaSeleccionada === talla
    );

    if (itemExistente) {
      // Actualizar cantidad del item existente
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (nuevaCantidad > stockDisponible) {
        console.error('Stock insuficiente');
        return;
      }

      const nuevosItems = carrito.items.map(item =>
        item.id === productoId && item.tallaSeleccionada === talla
          ? { ...item, cantidad: nuevaCantidad }
          : item
      );

      const total = nuevosItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      const cantidadTotal = nuevosItems.reduce((sum, item) => sum + item.cantidad, 0);

      setCarrito({ items: nuevosItems, total, cantidadTotal });
    } else {
      // Agregar nuevo item
      const nuevoItem: ProductoCarrito = {
        ...producto,
        cantidad,
        tallaSeleccionada: talla,
        idInventario // Add idInventario
      };

      const nuevosItems = [...carrito.items, nuevoItem];
      const total = nuevosItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      const cantidadTotal = nuevosItems.reduce((sum, item) => sum + item.cantidad, 0);

      setCarrito({ items: nuevosItems, total, cantidadTotal });
    }
  };

  // Actualiza la cantidad de un producto
  const actualizarCantidad = (productoId: number, cantidad: number, talla?: TallaCalzado): void => {
    if (cantidad <= 0) {
      eliminarProducto(productoId, talla);
      return;
    }

    const producto = obtenerProductoPorId(productoId);
    if (!producto) {
      console.error('Producto no encontrado');
      return;
    }

    // Determinar el stock disponible según si hay talla o no
    let stockDisponible = producto.stock;
    if (talla && producto.stockPorTalla) {
      const stockTalla = producto.stockPorTalla.find(st => st.talla === talla);
      if (stockTalla) {
        stockDisponible = stockTalla.stock;
      }
    }

    if (cantidad > stockDisponible) {
      console.error('Stock insuficiente');
      return;
    }

    const nuevosItems = carrito.items.map(item =>
      item.id === productoId && item.tallaSeleccionada === talla
        ? { ...item, cantidad }
        : item
    );

    const total = nuevosItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const cantidadTotal = nuevosItems.reduce((sum, item) => sum + item.cantidad, 0);

    setCarrito({ items: nuevosItems, total, cantidadTotal });
  };

  // Elimina un producto del carrito
  const eliminarProducto = (productoId: number, talla?: TallaCalzado): void => {
    const nuevosItems = carrito.items.filter(item =>
      !(item.id === productoId && item.tallaSeleccionada === talla)
    );

    const total = nuevosItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const cantidadTotal = nuevosItems.reduce((sum, item) => sum + item.cantidad, 0);

    setCarrito({ items: nuevosItems, total, cantidadTotal });
  };

  // Vacía el carrito
  const vaciarCarrito = (): void => {
    setCarrito({ items: [], total: 0, cantidadTotal: 0 });
  };

  // Obtiene la cantidad total de productos
  const obtenerCantidadTotal = (): number => {
    return carrito.cantidadTotal;
  };

  // Obtiene el total del carrito
  const obtenerTotal = (): number => {
    return carrito.total;
  };

  const value: CartContextType = {
    carrito,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    obtenerCantidadTotal,
    obtenerTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// HOOK PERSONALIZADO

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }

  return context;
};
