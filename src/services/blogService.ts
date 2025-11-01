// SERVICIO DE BLOG Y CONTACTO

import type { ArticuloBlog, DatosContacto, CategoriaBlog, ApiResponse } from '../types';
import {
  obtenerArticulosBlog,
  obtenerArticuloPorId,
  filtrarArticulosPorCategoria,
  guardarContacto,
  obtenerContactos
} from '../data/database';

// Simula un delay de red
const simularDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// SERVICIO DE BLOG

// Obtiene todos los artículos del blog
export const obtenerArticulos = async (): Promise<ApiResponse<ArticuloBlog[]>> => {
  try {
    await simularDelay();
    
    const articulos = obtenerArticulosBlog();
    
    return {
      success: true,
      data: articulos,
      message: 'Artículos obtenidos exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al obtener artículos'
    };
  }
};

// Obtiene un artículo específico por ID
export const obtenerArticulo = async (id: number): Promise<ApiResponse<ArticuloBlog>> => {
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

// Filtra artículos por categoría
export const obtenerArticulosPorCategoria = async (
  categoria: CategoriaBlog | 'todos'
): Promise<ApiResponse<ArticuloBlog[]>> => {
  try {
    await simularDelay();
    
    const articulos = filtrarArticulosPorCategoria(categoria);
    
    return {
      success: true,
      data: articulos,
      message: `Artículos de ${categoria} obtenidos exitosamente`
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al filtrar artículos'
    };
  }
};

// Busca artículos por término
export const buscarArticulos = async (termino: string): Promise<ApiResponse<ArticuloBlog[]>> => {
  try {
    await simularDelay(300);
    
    const articulos = obtenerArticulosBlog();
    const terminoLower = termino.toLowerCase();
    
    const articulosFiltrados = articulos.filter(a =>
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

// SERVICIO DE CONTACTO

// Envía un mensaje de contacto
export const enviarMensajeContacto = async (
  datos: Omit<DatosContacto, 'fecha'>
): Promise<ApiResponse<DatosContacto>> => {
  try {
    await simularDelay(1000);
    
    // Validaciones
    if (!datos.nombre || !datos.correo || !datos.comentario) {
      return {
        success: false,
        error: 'Todos los campos son requeridos'
      };
    }
    
    if (!validarEmail(datos.correo)) {
      return {
        success: false,
        error: 'Email no válido'
      };
    }
    
    if (datos.comentario.length < 10) {
      return {
        success: false,
        error: 'El mensaje debe tener al menos 10 caracteres'
      };
    }
    
    const contacto = guardarContacto(datos);
    
    return {
      success: true,
      data: contacto,
      message: 'Mensaje enviado exitosamente. Te contactaremos pronto.'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al enviar el mensaje'
    };
  }
};

// Obtiene todos los mensajes de contacto (solo admin)
export const obtenerMensajesContacto = async (): Promise<ApiResponse<DatosContacto[]>> => {
  try {
    await simularDelay();
    
    const contactos = obtenerContactos();
    
    return {
      success: true,
      data: contactos,
      message: 'Mensajes obtenidos exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al obtener mensajes'
    };
  }
};

// FUNCIONES DE VALIDACIÓN

// Valida formato de email
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Valida longitud del mensaje
export const validarMensaje = (mensaje: string, minLength: number = 10): boolean => {
  return mensaje.trim().length >= minLength;
};

// FUNCIONES DE UTILIDAD

// Formatea fecha para mostrar
export const formatearFecha = (fecha: string): string => {
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Obtiene artículos recientes
export const obtenerArticulosRecientes = async (limite: number = 3): Promise<ArticuloBlog[]> => {
  const articulos = obtenerArticulosBlog();
  return articulos
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, limite);
};
