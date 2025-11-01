// ============================================
// TIPOS Y INTERFACES PRINCIPALES DE LA APLICACIÓN
// ============================================

// Tipos de roles de usuario disponibles en el sistema
export type RolUsuario = 'cliente' | 'vendedor' | 'administrador';

// Tipos de categorías de productos
export type CategoriaProducto = 'hombre' | 'mujer' | 'niños' | 'deportivos';

// Estados posibles de un pedido
export type EstadoPedido = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

// Categorías de artículos del blog
export type CategoriaBlog = 'tendencias' | 'cuidado' | 'consejos' | 'estilo';

// ============================================
// INTERFACE DE USUARIO
// ============================================

// Interfaz que representa un usuario en el sistema
export interface Usuario {
  id: string;
  run: string;
  nombre: string;
  email: string;
  contrasena: string;
  rol: RolUsuario;
  genero?: string;
  fechaNacimiento?: string;
  region?: string;
  comuna?: string;
  direccion?: string;
  telefono?: string;
  fechaRegistro: string;
}

// Usuario autenticado (sin contraseña)
export interface UsuarioAutenticado extends Omit<Usuario, 'contrasena'> {
  logueado: boolean;
}

// Datos para registro de nuevo usuario
export interface DatosRegistro {
  run: string;
  nombre: string;
  email: string;
  contrasena: string;
  confirmarContrasena: string;
  genero: string;
  fechaNacimiento: string;
  region: string;
  comuna: string;
  direccion: string;
  telefono: string;
  rol?: RolUsuario;
}

// Credenciales para login
export interface CredencialesLogin {
  email: string;
  contrasena: string;
}

// ============================================
// INTERFACE DE PRODUCTO
// ============================================

// Interfaz que representa un producto en la tienda
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: CategoriaProducto;
  descripcion: string;
  stock: number;
  destacado?: boolean;
}

// Producto en el carrito
export interface ProductoCarrito extends Producto {
  cantidad: number;
}

// Filtros para productos
export interface FiltrosProducto {
  categoria?: CategoriaProducto | 'todos';
  precioMaximo?: number;
  busqueda?: string;
}

// ============================================
// INTERFACE DE CARRITO
// ============================================

// Estado del carrito de compras
export interface Carrito {
  items: ProductoCarrito[];
  total: number;
  cantidadTotal: number;
}

// ============================================
// INTERFACE DE PEDIDO
// ============================================

// Interfaz que representa un pedido
export interface Pedido {
  id: string;
  usuarioId: string;
  nombreUsuario: string;
  emailUsuario: string;
  items: ProductoCarrito[];
  subtotal: number;
  descuento: number;
  total: number;
  estado: EstadoPedido;
  fecha: string;
  direccionEnvio?: string;
}

// ============================================
// INTERFACE DE BLOG
// ============================================

// Interfaz que representa un artículo del blog
export interface ArticuloBlog {
  id: number;
  titulo: string;
  resumen: string;
  categoria: CategoriaBlog;
  fecha: string;
  imagen: string;
  contenido: string;
  autor?: string;
}

// ============================================
// INTERFACE DE CONTACTO
// ============================================

// Datos del formulario de contacto
export interface DatosContacto {
  nombre: string;
  correo: string;
  comentario: string;
  fecha: string;
}

// ============================================
// INTERFACE DE REGIONES Y COMUNAS
// ============================================

// Interfaz para comunas
export interface Comuna {
  value: string;
  label: string;
}

// Interfaz para regiones
export interface Region {
  value: string;
  label: string;
  comunas: Comuna[];
}

// ============================================
// TIPOS DE RESPUESTA DE API
// ============================================

// Respuesta genérica de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Respuesta de autenticación
export interface AuthResponse {
  success: boolean;
  usuario?: UsuarioAutenticado;
  message?: string;
  error?: string;
}
