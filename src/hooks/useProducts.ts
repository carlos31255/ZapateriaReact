// Custom hook para manejar productos usando DatabaseContext

import { useDatabase } from '../context/DatabaseContext';
import type { Producto, CategoriaProducto, ApiResponse } from '../types';

// Simula un delay de red para hacer más realista la experiencia
const simularDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const useProducts = () => {
  const {
    productos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
  } = useDatabase();

  // OPERACIONES DE LECTURA

  // Obtiene todos los productos
  const fetchProductos = async (): Promise<ApiResponse<Producto[]>> => {
    try {
      await simularDelay();
      
      return {
        success: true,
        data: productos,
        message: 'Productos obtenidos exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener productos'
      };
    }
  };

  // Obtiene un producto por ID
  const fetchProductoPorId = async (id: number): Promise<ApiResponse<Producto>> => {
    try {
      await simularDelay();
      
      const producto = obtenerProductoPorId(id);
      
      if (!producto) {
        return {
          success: false,
          error: 'Producto no encontrado'
        };
      }
      
      return {
        success: true,
        data: producto,
        message: 'Producto obtenido exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener el producto'
      };
    }
  };

  // Obtiene productos destacados
  const fetchProductosDestacados = async (): Promise<ApiResponse<Producto[]>> => {
    try {
      await simularDelay();
      
      const productosDestacados = productos.filter(p => p.destacado);
      
      return {
        success: true,
        data: productosDestacados,
        message: 'Productos destacados obtenidos exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener productos destacados'
      };
    }
  };

  // Filtra productos por categoría
  const fetchProductosPorCategoria = async (
    categoria: CategoriaProducto | 'todos'
  ): Promise<ApiResponse<Producto[]>> => {
    try {
      await simularDelay();
      
      const productosFiltrados = categoria === 'todos'
        ? productos
        : productos.filter(p => p.categoria === categoria);
      
      return {
        success: true,
        data: productosFiltrados,
        message: `Productos de categoría ${categoria} obtenidos exitosamente`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al filtrar productos'
      };
    }
  };

  // Busca productos por nombre
  const buscarProductos = async (termino: string): Promise<ApiResponse<Producto[]>> => {
    try {
      await simularDelay(300);
      
      const terminoLower = termino.toLowerCase();
      
      const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(terminoLower) ||
        p.descripcion.toLowerCase().includes(terminoLower)
      );
      
      return {
        success: true,
        data: productosFiltrados,
        message: `Se encontraron ${productosFiltrados.length} productos`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al buscar productos'
      };
    }
  };

  // OPERACIONES DE ESCRITURA

  // Crea un nuevo producto
  const fetchCrearProducto = async (
    producto: Omit<Producto, 'id'>
  ): Promise<ApiResponse<Producto>> => {
    try {
      await simularDelay(800);
      
      // Validaciones
      if (!producto.nombre || !producto.precio || !producto.categoria) {
        return {
          success: false,
          error: 'Faltan datos requeridos'
        };
      }
      
      if (producto.precio <= 0) {
        return {
          success: false,
          error: 'El precio debe ser mayor a 0'
        };
      }
      
      if (producto.stock < 0) {
        return {
          success: false,
          error: 'El stock no puede ser negativo'
        };
      }
      
      const nuevoProducto = crearProducto(producto);
      
      return {
        success: true,
        data: nuevoProducto,
        message: 'Producto creado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al crear el producto'
      };
    }
  };

  // Actualiza un producto existente
  const fetchActualizarProducto = async (
    id: number,
    datosActualizados: Partial<Producto>
  ): Promise<ApiResponse<boolean>> => {
    try {
      await simularDelay(800);
      
      // Validaciones
      if (datosActualizados.precio !== undefined && datosActualizados.precio <= 0) {
        return {
          success: false,
          error: 'El precio debe ser mayor a 0'
        };
      }
      
      if (datosActualizados.stock !== undefined && datosActualizados.stock < 0) {
        return {
          success: false,
          error: 'El stock no puede ser negativo'
        };
      }
      
      const resultado = actualizarProducto(id, datosActualizados);
      
      if (!resultado) {
        return {
          success: false,
          error: 'Producto no encontrado'
        };
      }
      
      return {
        success: true,
        data: true,
        message: 'Producto actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al actualizar el producto'
      };
    }
  };

  // Elimina un producto
  const fetchEliminarProducto = async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      await simularDelay(600);
      
      const resultado = eliminarProducto(id);
      
      if (!resultado) {
        return {
          success: false,
          error: 'Producto no encontrado'
        };
      }
      
      return {
        success: true,
        data: true,
        message: 'Producto eliminado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al eliminar el producto'
      };
    }
  };

  // FUNCIONES DE UTILIDAD

  // Verifica si un producto está disponible (con stock en alguna talla)
  const productoDisponible = (producto: Producto): boolean => {
    if (producto.stockPorTalla && producto.stockPorTalla.length > 0) {
      return producto.stockPorTalla.some(t => t.stock > 0);
    }
    return false;
  };

  // Calcula precio con descuento
  const calcularPrecioConDescuento = (precio: number, descuento: number): number => {
    return precio - (precio * descuento / 100);
  };

  // Formatea precio a formato chileno
  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  return {
    // Data
    productos,
    
    // Operaciones
    fetchProductos,
    fetchProductoPorId,
    fetchProductosDestacados,
    fetchProductosPorCategoria,
    buscarProductos,
    fetchCrearProducto,
    fetchActualizarProducto,
    fetchEliminarProducto,
    
    // Utilidades
    productoDisponible,
    calcularPrecioConDescuento,
    formatearPrecio
  };
};
