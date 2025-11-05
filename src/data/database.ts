// ============================================
// DATOS INICIALES PARA LA BASE DE DATOS
// Solo contiene datos estáticos
// Las funciones CRUD están en DatabaseContext
// ============================================

import type { Producto, Usuario, ArticuloBlog, Region } from '../types';

// ==================== DATOS INICIALES - PRODUCTOS ====================

export const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: "Zapatos Oxford Clásicos",
    precio: 89990,
    imagen: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400",
    categoria: "hombre",
    descripcion: "Elegantes zapatos Oxford de cuero genuino para hombre",
    stock: 15,
    destacado: true,
    stockPorTalla: [
      { talla: 39, stock: 3 },
      { talla: 40, stock: 4 },
      { talla: 41, stock: 5 },
      { talla: 42, stock: 3 }
    ]
  },
  {
    id: 2,
    nombre: "Tacones Elegantes",
    precio: 75990,
    imagen: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
    categoria: "mujer",
    descripcion: "Tacones altos elegantes para ocasiones especiales",
    stock: 5,
    destacado: true,
    stockPorTalla: [
      { talla: 35, stock: 1 },
      { talla: 36, stock: 2 },
      { talla: 37, stock: 2 }
    ]
  },
  {
    id: 3,
    nombre: "Zapatillas Deportivas",
    precio: 65990,
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    categoria: "deportivos",
    descripcion: "Zapatillas deportivas cómodas para running",
    stock: 20,
    destacado: true,
    stockPorTalla: [
      { talla: 38, stock: 4 },
      { talla: 39, stock: 5 },
      { talla: 40, stock: 6 },
      { talla: 41, stock: 5 }
    ]
  },
  {
    id: 4,
    nombre: "Botas de Cuero",
    precio: 125990,
    imagen: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400",
    categoria: "hombre",
    descripcion: "Botas robustas de cuero para uso diario",
    stock: 12,
    destacado: false,
    stockPorTalla: [
      { talla: 40, stock: 3 },
      { talla: 41, stock: 4 },
      { talla: 42, stock: 3 },
      { talla: 43, stock: 2 }
    ]
  },
  {
    id: 5,
    nombre: "Sandalias de Verano",
    precio: 45990,
    imagen: "https://images.unsplash.com/photo-1603808033176-e2f2d3a00645?w=400",
    categoria: "mujer",
    descripcion: "Sandalias cómodas para el verano",
    stock: 25,
    destacado: false
  },
  {
    id: 6,
    nombre: "Zapatos Escolares",
    precio: 35990,
    imagen: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
    categoria: "niños",
    descripcion: "Zapatos escolares resistentes y cómodos",
    stock: 0,
    destacado: false
  },
  {
    id: 7,
    nombre: "Zapatillas Casual",
    precio: 55990,
    imagen: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
    categoria: "mujer",
    descripcion: "Zapatillas casuales para uso diario",
    stock: 18,
    destacado: true,
    stockPorTalla: [
      { talla: 35, stock: 4 },
      { talla: 36, stock: 5 },
      { talla: 37, stock: 5 },
      { talla: 38, stock: 4 }
    ]
  },
  {
    id: 8,
    nombre: "Zapatos de Vestir",
    precio: 95990,
    imagen: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400",
    categoria: "hombre",
    descripcion: "Zapatos formales para eventos especiales",
    stock: 10,
    destacado: false
  }
];

// ==================== DATOS INICIALES - USUARIOS ====================

export const usuariosIniciales: Usuario[] = [
  {
    id: '1',
    run: '11111111-1',
    nombre: 'Administrador Sistema',
    email: 'admin@stepstyle.cl',
    contrasena: 'admin123',
    rol: 'administrador',
    fechaRegistro: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    run: '33333333-3',
    nombre: 'Cliente Demo',
    email: 'cliente@gmail.com',
    contrasena: 'cliente123',
    rol: 'cliente',
    genero: 'masculino',
    fechaNacimiento: '1990-01-01',
    region: 'Metropolitana de Santiago',
    comuna: 'Santiago',
    direccion: 'Calle Falsa 123',
    telefono: '+56912345678',
    fechaRegistro: '2025-01-15T00:00:00.000Z'
  }
];

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

// ==================== REGIONES Y COMUNAS DE CHILE ====================

export const regionesComunas: Region[] = [
  {
    value: "Metropolitana de Santiago",
    label: "Metropolitana de Santiago",
    comunas: [
      { value: "Santiago", label: "Santiago" },
      { value: "Providencia", label: "Providencia" },
      { value: "Las Condes", label: "Las Condes" },
      { value: "Ñuñoa", label: "Ñuñoa" },
      { value: "Maipú", label: "Maipú" },
      { value: "La Florida", label: "La Florida" },
      { value: "Puente Alto", label: "Puente Alto" }
    ]
  },
  {
    value: "Valparaíso",
    label: "Valparaíso",
    comunas: [
      { value: "Valparaíso", label: "Valparaíso" },
      { value: "Viña del Mar", label: "Viña del Mar" },
      { value: "Quilpué", label: "Quilpué" },
      { value: "Villa Alemana", label: "Villa Alemana" }
    ]
  },
  {
    value: "Biobío",
    label: "Biobío",
    comunas: [
      { value: "Concepción", label: "Concepción" },
      { value: "Talcahuano", label: "Talcahuano" },
      { value: "Los Ángeles", label: "Los Ángeles" },
      { value: "Chillán", label: "Chillán" }
    ]
  }
];
