// TIPOS Y INTERFACES PRINCIPALES DE LA APLICACIÓN

// ==========================================
// MODELOS DEL BACKEND
// ==========================================

// GEOGRAFIA SERVICE
export interface Region {
  idRegion: number;
  nombreRegion: string;
  codigoRegion: string;
}

export interface Comuna {
  idComuna: number;
  nombreComuna: string;
  region: Region;
}

export interface Ciudad {
  idCiudad: number;
  nombreCiudad: string;
  comuna: Comuna;
}

// USUARIO SERVICE
export interface Rol {
  idRol: number;
  nombreRol: string;
  descripcion: string;
}

export interface Persona {
  idPersona: number;
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  email: string;
  idComuna: number;
  calle: string;
  numeroPuerta: string;
  username: string;
  passHash: string;
  fechaRegistro: string;
  estado: string;
}

export interface UsuarioBackend {
  idPersona: number;
  persona: Persona;
  rol: Rol;
}

// INVENTARIO SERVICE
export interface Marca {
  idMarca: number;
  nombreMarca: string;
  descripcion: string;
  estado: string;
}

export interface Talla {
  idTalla: number;
  numeroTalla: string;
}

export interface ModeloZapato {
  idModelo: number;
  marca: Marca;
  nombreModelo: string;
  descripcion: string;
  precioUnitario: number;
  imagenUrl: string;
  estado: string;
  categoria?: string;
}

export interface Inventario {
  idInventario: number;
  modelo: ModeloZapato;
  talla: Talla;
  stockActual: number;
}

// VENTAS SERVICE
export interface Boleta {
  idBoleta: number;
  numeroBoleta: string;
  fecha: string;
  idVendedor?: number;
  idCliente: number;
  montoTotal: number;
  estado: string;
}

export interface DetalleBoleta {
  idDetalle: number;
  boleta: Boleta;
  idInventario: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// ENTREGAS SERVICE
export interface Entrega {
  idEntrega: number;
  idBoleta: number;
  idTransportista?: number;
  estadoEntrega: string;
  fechaAsignacion: string;
  fechaEntrega?: string;
  observacion?: string;
  direccionEntrega: string;
  idComuna: number;
}

// ==========================================
// TIPOS DEL FRONTEND (ADAPTADOS O LEGACY)
// ==========================================

// Tipos de roles de usuario disponibles en el sistema
export type RolUsuario = 'cliente' | 'administrador' | 'vendedor' | 'transportista';

// Tipos de categorías de productos (Mapeado a Marcas o lógica de negocio)
export type CategoriaProducto = 'hombre' | 'mujer' | 'niños' | 'deportivos';

// Tallas disponibles de calzado
export type TallaCalzado = 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45;

// Stock por talla
export interface StockTalla {
  talla: TallaCalzado;
  stock: number;
  idInventario?: number; // Optional - Added to link with backend
}

// Estados posibles de un pedido
export type EstadoPedido = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

// Categorías de artículos del blog
export type CategoriaBlog = 'tendencias' | 'cuidado' | 'consejos' | 'estilo';

// 
// INTERFACE DE USUARIO (FRONTEND)
// 

// Interfaz que representa un usuario en el sistema (Adaptada para compatibilidad)
export interface Usuario {
  id: string;
  run: string;
  nombre: string;
  email: string;
  contrasena?: string;
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
  idPersonaBackend?: number; // Reference to backend ID
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

// INTERFACE DE PRODUCTO (FRONTEND)

// Interfaz que representa un producto en la tienda
export interface Producto {
  id: number; // Maps to idModelo
  nombre: string;
  precio: number;
  imagen: string;
  categoria: CategoriaProducto;
  descripcion: string;
  stock: number; // Stock total (suma de todas las tallas)
  stockPorTalla?: StockTalla[]; // Stock detallado por talla
  destacado?: boolean;
  marca?: string;
}

// Producto en el carrito
export interface ProductoCarrito extends Producto {
  cantidad: number;
  tallaSeleccionada?: TallaCalzado; // Talla seleccionada en el carrito
  idInventario?: number; // ID especifico del inventario para esa talla
}

// Filtros para productos
export interface FiltrosProducto {
  categoria?: CategoriaProducto | 'todos';
  precioMaximo?: number;
  busqueda?: string;
}

// INTERFACE DE CARRITO

// Estado del carrito de compras
export interface Carrito {
  items: ProductoCarrito[];
  total: number;
  cantidadTotal: number;
}

// INTERFACE DE PEDIDO

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

// INTERFACE DE BLOG

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

// INTERFACE DE CONTACTO

// Datos del formulario de contacto
export interface DatosContacto {
  nombre: string;
  correo: string;
  comentario: string;
  fecha: string;
}

// INTERFACE DE REGIONES Y COMUNAS (UI HELPERS)

// Interfaz para comunas
export interface ComunaOption {
  value: string;
  label: string;
}

// Interfaz para regiones
export interface RegionOption {
  value: string;
  label: string;
  comunas: ComunaOption[];
}

// TIPOS DE RESPUESTA DE API

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
  token?: string;
}
