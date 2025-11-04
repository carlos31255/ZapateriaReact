// SERVICIO DE PRODUCTOS CON FETCH API

import type { Producto, CategoriaProducto, ApiResponse } from '../types';
import {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductosDestacados,
  filtrarProductosPorCategoria,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarStock
} from '../data/database';

// Simula un delay de red para hacer más realista la experiencia
const simularDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// OPERACIONES DE LECTURA (GET)

// Obtiene todos los productos usando Fetch API simulado
export const fetchProductos = async (): Promise<ApiResponse<Producto[]>> => {
  try {
    // Simular llamada API con delay
    await simularDelay();
    
    const productos = obtenerProductos();
    
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

// Obtiene un producto por ID usando Fetch API simulado
export const fetchProductoPorId = async (id: number): Promise<ApiResponse<Producto>> => {
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
export const fetchProductosDestacados = async (): Promise<ApiResponse<Producto[]>> => {
  try {
    await simularDelay();
    
    const productos = obtenerProductosDestacados();
    
    return {
      success: true,
      data: productos,
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
export const fetchProductosPorCategoria = async (
  categoria: CategoriaProducto | 'todos'
): Promise<ApiResponse<Producto[]>> => {
  try {
    await simularDelay();
    
    const productos = filtrarProductosPorCategoria(categoria);
    
    return {
      success: true,
      data: productos,
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
export const buscarProductos = async (termino: string): Promise<ApiResponse<Producto[]>> => {
  try {
    await simularDelay(300);
    
    const productos = obtenerProductos();
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

// OPERACIONES DE ESCRITURA (POST, PUT, DELETE)

// Crea un nuevo producto
export const fetchCrearProducto = async (
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
export const fetchActualizarProducto = async (
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
export const fetchEliminarProducto = async (id: number): Promise<ApiResponse<boolean>> => {
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

// Actualiza el stock de un producto
export const fetchActualizarStock = async (
  id: number,
  cantidad: number
): Promise<ApiResponse<boolean>> => {
  try {
    await simularDelay(400);
    
    if (cantidad < 0) {
      return {
        success: false,
        error: 'El stock no puede ser negativo'
      };
    }
    
    const resultado = actualizarStock(id, cantidad);
    
    if (!resultado) {
      return {
        success: false,
        error: 'Producto no encontrado'
      };
    }
    
    return {
      success: true,
      data: true,
      message: 'Stock actualizado exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al actualizar el stock'
    };
  }
};

// FUNCIONES DE UTILIDAD

// Verifica si un producto está disponible
export const productoDisponible = (producto: Producto): boolean => {
  return producto.stock > 0;
};

// Calcula precio con descuento
export const calcularPrecioConDescuento = (precio: number, descuento: number): number => {
  return precio - (precio * descuento / 100);
};

// Formatea precio a formato chileno
export const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(precio);
};
