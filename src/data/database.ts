// ============================================
// DATOS INICIALES SOLO PARA BLOG
// Productos, usuarios y pedidos ahora vienen del backend
// ============================================

import type { ArticuloBlog } from '../types';

// ==================== DATOS INICIALES - ARTÍCULOS BLOG ====================

export const articulosBlogIniciales: ArticuloBlog[] = [
  {
    id: 1,
    titulo: "Tendencias Otoño 2025",
    resumen: "Los estilos que marcarán esta temporada.",
    categoria: "tendencias",
    fecha: "2025-09-20",
    imagen: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600",
    contenido: "Este otoño trae botines con texturas, colores tierra y materiales sustentables que están dominando las tendencias de calzado.",
    autor: "María González"
  },
  {
    id: 2,
    titulo: "Cuidar Zapatos de Cuero",
    resumen: "Mantén tus zapatos como nuevos.",
    categoria: "cuidado",
    fecha: "2025-09-18",
    imagen: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600",
    contenido: "El cuero requiere cuidados específicos. Limpia, nutre y protege tus zapatos regularmente para que duren años.",
    autor: "Carlos Rodríguez"
  },
  {
    id: 3,
    titulo: "5 Zapatos Esenciales",
    resumen: "Los básicos que no pueden faltar.",
    categoria: "consejos",
    fecha: "2025-09-15",
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    contenido: "Sneakers blancos, zapatos oxford, botines versátiles, sandalias cómodas y zapatos deportivos. Estos cinco tipos cubren todas las ocasiones.",
    autor: "Ana Martínez"
  },
  {
    id: 4,
    titulo: "Combinar con Estilo",
    resumen: "Aprende las reglas básicas del matching.",
    categoria: "estilo",
    fecha: "2025-09-12",
    imagen: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600",
    contenido: "La combinación correcta de zapatos puede transformar cualquier outfit. Conoce las reglas fundamentales y cuándo romperlas.",
    autor: "Luis Torres"
  }
];
