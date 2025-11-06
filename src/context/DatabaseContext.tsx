// CONTEXT DE BASE DE DATOS
// Reemplaza localStorage con useState para gestión de datos en memoria

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Producto, Usuario, ArticuloBlog, DatosContacto, Pedido } from '../types';
import { 
  productosIniciales, 
  usuariosIniciales, 
  articulosBlogIniciales 
} from '../data/database';

// TIPOS

interface DatabaseContextType {
  // Productos
  productos: Producto[];
  setProductos: (productos: Producto[]) => void;
  obtenerProductoPorId: (id: number) => Producto | undefined;
  crearProducto: (producto: Omit<Producto, 'id'>) => Producto;
  actualizarProducto: (id: number, datos: Partial<Producto>) => boolean;
  eliminarProducto: (id: number) => boolean;
  
  // Usuarios
  usuarios: Usuario[];
  setUsuarios: (usuarios: Usuario[]) => void;
  obtenerUsuarioPorEmail: (email: string) => Usuario | undefined;
  obtenerUsuarioPorId: (id: string) => Usuario | undefined;
  crearUsuario: (usuario: Omit<Usuario, 'id' | 'fechaRegistro'>) => Usuario;
  actualizarUsuario: (id: string, datos: Partial<Usuario>) => boolean;
  eliminarUsuario: (id: string) => boolean;
  
  // Blog
  articulosBlog: ArticuloBlog[];
  setArticulosBlog: (articulos: ArticuloBlog[]) => void;
  obtenerArticuloPorId: (id: number) => ArticuloBlog | undefined;
  crearArticuloBlog: (articulo: Omit<ArticuloBlog, 'id'>) => ArticuloBlog;
  actualizarArticuloBlog: (id: number, datos: Partial<ArticuloBlog>) => boolean;
  eliminarArticuloBlog: (id: number) => boolean;
  
  // Contactos
  contactos: DatosContacto[];
  setContactos: (contactos: DatosContacto[]) => void;
  guardarContacto: (contacto: Omit<DatosContacto, 'fecha'>) => DatosContacto;
  
  // Pedidos
  pedidos: Pedido[];
  setPedidos: (pedidos: Pedido[]) => void;
  crearPedido: (pedido: Omit<Pedido, 'id' | 'fecha'>) => Pedido;
  actualizarPedido: (id: string, datos: Partial<Pedido>) => boolean;
  
  // Utilidades
  resetearDatos: () => void;
}

// CREACIÓN DEL CONTEXT

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// PROVIDER DEL CONTEXT

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
  // Estados para cada entidad
  const [productos, setProductos] = useState<Producto[]>(() => {
    // Intentar cargar desde localStorage para migración gradual
    const saved = localStorage.getItem('productos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return productosIniciales;
      }
    }
    return productosIniciales;
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const saved = localStorage.getItem('usuarios');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return usuariosIniciales;
      }
    }
    return usuariosIniciales;
  });

  const [articulosBlog, setArticulosBlog] = useState<ArticuloBlog[]>(() => {
    const saved = localStorage.getItem('articulosBlog');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return articulosBlogIniciales;
      }
    }
    return articulosBlogIniciales;
  });

  const [contactos, setContactos] = useState<DatosContacto[]>(() => {
    const saved = localStorage.getItem('contactos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    const saved = localStorage.getItem('pedidos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Sincronizar con localStorage solo para persistencia (opcional)
  // Puedes comentar estos useEffect si no quieres persistencia
  useEffect(() => {
    localStorage.setItem('productos', JSON.stringify(productos));
  }, [productos]);

  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('articulosBlog', JSON.stringify(articulosBlog));
  }, [articulosBlog]);

  useEffect(() => {
    localStorage.setItem('contactos', JSON.stringify(contactos));
  }, [contactos]);

  useEffect(() => {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
  }, [pedidos]);

  // ==================== FUNCIONES DE PRODUCTOS ====================

  const obtenerProductoPorId = (id: number): Producto | undefined => {
    return productos.find(p => p.id === id);
  };

  const crearProducto = (producto: Omit<Producto, 'id'>): Producto => {
    const nuevoId = Math.max(0, ...productos.map(p => p.id)) + 1;
    const nuevoProducto = { ...producto, id: nuevoId };
    setProductos([...productos, nuevoProducto]);
    return nuevoProducto;
  };

  const actualizarProducto = (id: number, datosActualizados: Partial<Producto>): boolean => {
    const indice = productos.findIndex(p => p.id === id);
    if (indice === -1) return false;
    
    const nuevosProductos = [...productos];
    nuevosProductos[indice] = { ...nuevosProductos[indice], ...datosActualizados };
    setProductos(nuevosProductos);
    return true;
  };

  const eliminarProducto = (id: number): boolean => {
    const productosFiltrados = productos.filter(p => p.id !== id);
    if (productos.length === productosFiltrados.length) return false;
    
    setProductos(productosFiltrados);
    return true;
  };

  // ==================== FUNCIONES DE USUARIOS ====================

  const obtenerUsuarioPorEmail = (email: string): Usuario | undefined => {
    return usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const obtenerUsuarioPorId = (id: string): Usuario | undefined => {
    return usuarios.find(u => u.id === id);
  };

  const crearUsuario = (usuario: Omit<Usuario, 'id' | 'fechaRegistro'>): Usuario => {
    const nuevoId = (Math.max(0, ...usuarios.map(u => parseInt(u.id) || 0)) + 1).toString();
    const nuevoUsuario: Usuario = {
      ...usuario,
      id: nuevoId,
      fechaRegistro: new Date().toISOString()
    };
    setUsuarios([...usuarios, nuevoUsuario]);
    return nuevoUsuario;
  };

  const actualizarUsuario = (id: string, datosActualizados: Partial<Usuario>): boolean => {
    const indice = usuarios.findIndex(u => u.id === id);
    if (indice === -1) return false;
    
    const nuevosUsuarios = [...usuarios];
    nuevosUsuarios[indice] = { ...nuevosUsuarios[indice], ...datosActualizados };
    setUsuarios(nuevosUsuarios);
    return true;
  };

  const eliminarUsuario = (id: string): boolean => {
    const usuariosFiltrados = usuarios.filter(u => u.id !== id);
    if (usuarios.length === usuariosFiltrados.length) return false;
    
    setUsuarios(usuariosFiltrados);
    return true;
  };

  // ==================== FUNCIONES DE BLOG ====================

  const obtenerArticuloPorId = (id: number): ArticuloBlog | undefined => {
    return articulosBlog.find(a => a.id === id);
  };

  const crearArticuloBlog = (articulo: Omit<ArticuloBlog, 'id'>): ArticuloBlog => {
    const nuevoId = Math.max(0, ...articulosBlog.map(a => a.id)) + 1;
    const nuevoArticulo = { ...articulo, id: nuevoId };
    setArticulosBlog([...articulosBlog, nuevoArticulo]);
    return nuevoArticulo;
  };

  const actualizarArticuloBlog = (id: number, datosActualizados: Partial<ArticuloBlog>): boolean => {
    const indice = articulosBlog.findIndex(a => a.id === id);
    if (indice === -1) return false;
    
    const nuevosArticulos = [...articulosBlog];
    nuevosArticulos[indice] = { ...nuevosArticulos[indice], ...datosActualizados };
    setArticulosBlog(nuevosArticulos);
    return true;
  };

  const eliminarArticuloBlog = (id: number): boolean => {
    const articulosFiltrados = articulosBlog.filter(a => a.id !== id);
    if (articulosBlog.length === articulosFiltrados.length) return false;
    
    setArticulosBlog(articulosFiltrados);
    return true;
  };

  // ==================== FUNCIONES DE CONTACTOS ====================

  const guardarContacto = (contacto: Omit<DatosContacto, 'fecha'>): DatosContacto => {
    const nuevoContacto: DatosContacto = {
      ...contacto,
      fecha: new Date().toISOString()
    };
    setContactos([...contactos, nuevoContacto]);
    return nuevoContacto;
  };

  // ==================== FUNCIONES DE PEDIDOS ====================

  const crearPedido = (pedido: Omit<Pedido, 'id' | 'fecha'>): Pedido => {
    const nuevoId = `PED-${Date.now()}`;
    const nuevoPedido: Pedido = {
      ...pedido,
      id: nuevoId,
      fecha: new Date().toISOString()
    };
    setPedidos([...pedidos, nuevoPedido]);
    return nuevoPedido;
  };

  const actualizarPedido = (id: string, datosActualizados: Partial<Pedido>): boolean => {
    const indice = pedidos.findIndex(p => p.id === id);
    if (indice === -1) return false;
    
    const nuevosPedidos = [...pedidos];
    nuevosPedidos[indice] = { ...nuevosPedidos[indice], ...datosActualizados };
    setPedidos(nuevosPedidos);
    return true;
  };

  // ==================== UTILIDADES ====================

  const resetearDatos = () => {
    setProductos(productosIniciales);
    setUsuarios(usuariosIniciales);
    setArticulosBlog(articulosBlogIniciales);
    setContactos([]);
    setPedidos([]);
    
    // Limpiar localStorage también
    localStorage.clear();
  };

  const value: DatabaseContextType = {
    // Productos
    productos,
    setProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    
    // Usuarios
    usuarios,
    setUsuarios,
    obtenerUsuarioPorEmail,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    
    // Blog
    articulosBlog,
    setArticulosBlog,
    obtenerArticuloPorId,
    crearArticuloBlog,
    actualizarArticuloBlog,
    eliminarArticuloBlog,
    
    // Contactos
    contactos,
    setContactos,
    guardarContacto,
    
    // Pedidos
    pedidos,
    setPedidos,
    crearPedido,
    actualizarPedido,
    
    // Utilidades
    resetearDatos
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};

// HOOK PERSONALIZADO

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  
  if (context === undefined) {
    throw new Error('useDatabase debe ser usado dentro de un DatabaseProvider');
  }
  
  return context;
};
