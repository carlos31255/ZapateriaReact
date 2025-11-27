// Custom hook para manejar productos usando servicios directamente

import { useState, useEffect } from 'react';
import { inventarioService } from '../services/inventarioService';
import type { Producto, TallaCalzado } from '../types';

export const useProducts = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const inventario = await inventarioService.getAllInventario();

      // Mapear inventario a productos
      const productosMap = new Map<number, Producto>();

      inventario.forEach(inv => {
        const modelo = inv.modelo;
        const idModelo = modelo.idModelo;

        if (!productosMap.has(idModelo)) {
          productosMap.set(idModelo, {
            id: idModelo,
            nombre: modelo.nombreModelo,
            precio: modelo.precioUnitario,
            imagen: modelo.imagenUrl,
            categoria: (modelo.categoria as 'hombre' | 'mujer' | 'niños') || 'hombre',
            descripcion: modelo.descripcion,
            stock: 0,
            stockPorTalla: [],
            marca: modelo.marca.nombreMarca,
            destacado: true // Temporal: Marcar todos como destacados
          });
        }

        const producto = productosMap.get(idModelo)!;
        producto.stock += inv.stockActual;
        producto.stockPorTalla?.push({
          talla: parseInt(inv.talla.numeroTalla) as TallaCalzado,
          stock: inv.stockActual,
          idInventario: inv.idInventario
        });
      });

      const nuevosProductos = Array.from(productosMap.values());
      setProductos(nuevosProductos);
      return nuevosProductos;
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar productos');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const obtenerProductoPorId = (id: number): Producto | undefined => {
    return productos.find(p => p.id === id);
  };

  const crearProducto = async (producto: Omit<Producto, 'id'>): Promise<Producto | null> => {
    try {
      const nuevoModelo = await inventarioService.createModelo({
        nombreModelo: producto.nombre,
        descripcion: producto.descripcion,
        precioUnitario: producto.precio,
        imagenUrl: producto.imagen,
        marca: { idMarca: 1, nombreMarca: '', descripcion: '', estado: 'activo' } as any,
        estado: 'activo'
      });

      // Crear inventario para cada talla
      if (producto.stockPorTalla && producto.stockPorTalla.length > 0) {
        for (const stockTalla of producto.stockPorTalla) {
          await inventarioService.createInventario({
            modelo: nuevoModelo,
            talla: { idTalla: stockTalla.talla, numeroTalla: stockTalla.talla.toString() } as any,
            stockActual: stockTalla.stock
          });
        }
      }

      await cargarProductos();
      return obtenerProductoPorId(nuevoModelo.idModelo) || null;
    } catch (err) {
      console.error('Error creando producto:', err);
      return null;
    }
  };

  const actualizarProducto = async (id: number, datos: Partial<Producto>): Promise<boolean> => {
    try {
      await inventarioService.updateModelo(id, {
        nombreModelo: datos.nombre,
        descripcion: datos.descripcion,
        precioUnitario: datos.precio,
        imagenUrl: datos.imagen
      });
      await cargarProductos();
      return true;
    } catch (err) {
      console.error('Error actualizando producto:', err);
      return false;
    }
  };

  const eliminarProducto = async (id: number): Promise<boolean> => {
    try {
      await inventarioService.deleteModelo(id);
      await cargarProductos();
      return true;
    } catch (err) {
      console.error('Error eliminando producto:', err);
      return false;
    }
  };

  return {
    productos,
    loading,
    error,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    recargarProductos: cargarProductos,
    // Aliases para compatibilidad con páginas existentes
    fetchProductos: cargarProductos,
    fetchProductosPorCategoria: async (categoria: string) => {
      const allProducts = await cargarProductos();
      if (categoria === 'todos') return allProducts;
      return allProducts.filter(p => p.categoria === categoria);
    },
    fetchCrearProducto: crearProducto,
    fetchActualizarProducto: actualizarProducto,
    fetchEliminarProducto: eliminarProducto
  };
};
