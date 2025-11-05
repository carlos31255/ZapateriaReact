// Custom hook para manejar artículos de blog usando DatabaseContext

import { useDatabase } from '../context/DatabaseContext';
import type { ArticuloBlog, ApiResponse } from '../types';

// Simula un delay de red
const simularDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const useBlog = () => {
  const {
    articulosBlog,
    obtenerArticuloPorId,
    crearArticuloBlog,
    actualizarArticuloBlog,
    eliminarArticuloBlog
  } = useDatabase();

  // OPERACIONES DE LECTURA

  // Obtiene todos los artículos
  const fetchArticulos = async (): Promise<ApiResponse<ArticuloBlog[]>> => {
    try {
      await simularDelay();
      
      // Ordenar por fecha de publicación (más reciente primero)
      const articulosOrdenados = [...articulosBlog].sort((a, b) => {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });
      
      return {
        success: true,
        data: articulosOrdenados,
        message: 'Artículos obtenidos exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener artículos'
      };
    }
  };

  // Obtiene un artículo por ID
  const fetchArticuloPorId = async (id: number): Promise<ApiResponse<ArticuloBlog>> => {
    try {
      await simularDelay();
      
      const articulo = obtenerArticuloPorId(id);
      
      if (!articulo) {
        return {
          success: false,
          error: 'Artículo no encontrado'
        };
      }
      
      return {
        success: true,
        data: articulo,
        message: 'Artículo obtenido exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener el artículo'
      };
    }
  };

  // Obtiene artículos destacados (primeros 3 más recientes)
  const fetchArticulosDestacados = async (): Promise<ApiResponse<ArticuloBlog[]>> => {
    try {
      await simularDelay();
      
      const articulosDestacados = [...articulosBlog]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 3);
      
      return {
        success: true,
        data: articulosDestacados,
        message: 'Artículos destacados obtenidos exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener artículos destacados'
      };
    }
  };

  // Busca artículos por término
  const buscarArticulos = async (termino: string): Promise<ApiResponse<ArticuloBlog[]>> => {
    try {
      await simularDelay(300);
      
      const terminoLower = termino.toLowerCase();
      
      const articulosFiltrados = articulosBlog.filter(a =>
        a.titulo.toLowerCase().includes(terminoLower) ||
        a.resumen.toLowerCase().includes(terminoLower) ||
        a.contenido.toLowerCase().includes(terminoLower)
      );
      
      return {
        success: true,
        data: articulosFiltrados,
        message: `Se encontraron ${articulosFiltrados.length} artículos`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al buscar artículos'
      };
    }
  };

  // OPERACIONES DE ESCRITURA

  // Crea un nuevo artículo
  const fetchCrearArticulo = async (
    articulo: Omit<ArticuloBlog, 'id'>
  ): Promise<ApiResponse<ArticuloBlog>> => {
    try {
      await simularDelay(800);
      
      // Validaciones
      if (!articulo.titulo || !articulo.contenido || !articulo.autor) {
        return {
          success: false,
          error: 'Faltan datos requeridos'
        };
      }
      
      const nuevoArticulo = crearArticuloBlog(articulo);
      
      return {
        success: true,
        data: nuevoArticulo,
        message: 'Artículo creado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al crear el artículo'
      };
    }
  };

  // Actualiza un artículo existente
  const fetchActualizarArticulo = async (
    id: number,
    datosActualizados: Partial<ArticuloBlog>
  ): Promise<ApiResponse<boolean>> => {
    try {
      await simularDelay(800);
      
      const resultado = actualizarArticuloBlog(id, datosActualizados);
      
      if (!resultado) {
        return {
          success: false,
          error: 'Artículo no encontrado'
        };
      }
      
      return {
        success: true,
        data: true,
        message: 'Artículo actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al actualizar el artículo'
      };
    }
  };

  // Elimina un artículo
  const fetchEliminarArticulo = async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      await simularDelay(600);
      
      const resultado = eliminarArticuloBlog(id);
      
      if (!resultado) {
        return {
          success: false,
          error: 'Artículo no encontrado'
        };
      }
      
      return {
        success: true,
        data: true,
        message: 'Artículo eliminado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al eliminar el artículo'
      };
    }
  };

  return {
    // Data
    articulosBlog,
    
    // Operaciones
    fetchArticulos,
    fetchArticuloPorId,
    fetchArticulosDestacados,
    buscarArticulos,
    fetchCrearArticulo,
    fetchActualizarArticulo,
    fetchEliminarArticulo
  };
};
