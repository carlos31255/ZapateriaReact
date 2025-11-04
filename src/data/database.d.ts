// DECLARACIONES DE TIPOS PARA database.js
// Este archivo proporciona tipos TypeScript para el archivo JavaScript database.js

import type {
  Usuario,
  Producto,
  ArticuloBlog,
  DatosContacto,
  Pedido,
  Region,
  CategoriaProducto,
  CategoriaBlog,
  EstadoPedido
} from '../types';

// ==================== DATOS INICIALES ====================

export const productosIniciales: Producto[];
export const usuariosIniciales: Usuario[];
export const articulosBlogIniciales: ArticuloBlog[];
export const regionesComunas: Region[];

// ==================== FUNCIONES DE INICIALIZACIÓN ====================

export function inicializarDatos(): void;
export function resetearDatos(): void;

// ==================== CRUD - PRODUCTOS ====================

export function obtenerProductos(): Producto[];
export function obtenerProductoPorId(id: number): Producto | undefined;
export function obtenerProductosDestacados(): Producto[];
export function filtrarProductosPorCategoria(categoria: CategoriaProducto | 'todos'): Producto[];
export function crearProducto(producto: Omit<Producto, 'id'>): Producto;
export function actualizarProducto(id: number, datosActualizados: Partial<Producto>): boolean;
export function eliminarProducto(id: number): boolean;
export function actualizarStock(id: number, cantidad: number): boolean;

// ==================== CRUD - USUARIOS ====================

export function obtenerUsuarios(): Usuario[];
export function obtenerUsuarioPorEmail(email: string): Usuario | undefined;
export function obtenerUsuarioPorId(id: string): Usuario | undefined;
export function crearUsuario(usuario: Omit<Usuario, 'id' | 'fechaRegistro'>): Usuario;
export function actualizarUsuario(id: string, datosActualizados: Partial<Usuario>): boolean;
export function eliminarUsuario(id: string): boolean;

// ==================== CRUD - ARTÍCULOS BLOG ====================

export function obtenerArticulosBlog(): ArticuloBlog[];
export function obtenerArticuloPorId(id: number): ArticuloBlog | undefined;
export function filtrarArticulosPorCategoria(categoria: CategoriaBlog | 'todos'): ArticuloBlog[];
export function crearArticuloBlog(articulo: Omit<ArticuloBlog, 'id'>): ArticuloBlog;
export function actualizarArticuloBlog(id: number, datosActualizados: Partial<ArticuloBlog>): boolean;
export function eliminarArticuloBlog(id: number): boolean;

// ==================== CRUD - CONTACTOS ====================

export function obtenerContactos(): DatosContacto[];
export function guardarContacto(contacto: Omit<DatosContacto, 'fecha'>): DatosContacto;
export function eliminarContacto(indice: number): boolean;

// ==================== CRUD - PEDIDOS ====================

export function obtenerPedidos(): Pedido[];
export function obtenerPedidosPorUsuario(usuarioId: string): Pedido[];
export function obtenerPedidoPorId(id: string): Pedido | undefined;
export function crearPedido(pedido: Omit<Pedido, 'id' | 'fecha'>): Pedido;
export function actualizarEstadoPedido(id: string, estado: EstadoPedido): boolean;
export function actualizarPedido(id: string, datosActualizados: Partial<Pedido>): boolean;
export function eliminarPedido(id: string): boolean;

// ==================== FUNCIONES DE UTILIDAD ====================

export function getStorageKeys(): {
  readonly USUARIOS: 'usuarios';
  readonly PRODUCTOS: 'productos';
  readonly ARTICULOS_BLOG: 'articulosBlog';
  readonly CONTACTOS: 'contactos';
  readonly PEDIDOS: 'pedidos';
  readonly USUARIO_ACTUAL: 'usuarioActual';
  readonly CARRITO: 'carrito';
};

export function exportarDatos(): {
  productos: Producto[];
  usuarios: Usuario[];
  articulos: ArticuloBlog[];
  contactos: DatosContacto[];
  pedidos: Pedido[];
};

export function importarDatos(datos: {
  productos?: Producto[];
  usuarios?: Usuario[];
  articulos?: ArticuloBlog[];
  contactos?: DatosContacto[];
  pedidos?: Pedido[];
}): void;

export function obtenerEstadisticas(): {
  totalProductos: number;
  totalUsuarios: number;
  totalArticulos: number;
  totalContactos: number;
  totalPedidos: number;
  productosDestacados: number;
  productosSinStock: number;
};
