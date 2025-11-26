// CONTEXT DE BASE DE DATOS
// Reemplaza localStorage con llamadas a API

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Producto, Usuario, ArticuloBlog, DatosContacto, Pedido, RegionOption, ComunaOption } from '../types';
import { inventarioService } from '../services/inventarioService';
import { geografiaService } from '../services/geografiaService';
import { ventasService } from '../services/ventasService';
import { entregasService } from '../services/entregasService';
import { articulosBlogIniciales } from '../data/database'; // Mantener blog mockeado por ahora

// TIPOS

interface DatabaseContextType {
  // Productos
  productos: Producto[];
  setProductos: (productos: Producto[]) => void;
  obtenerProductoPorId: (id: number) => Producto | undefined;
  crearProducto: (producto: Omit<Producto, 'id'>) => Promise<Producto>;
  actualizarProducto: (id: number, datos: Partial<Producto>) => Promise<boolean>;
  eliminarProducto: (id: number) => Promise<boolean>;

  // Usuarios (Solo lectura para admin, gestión real en AuthContext)
  usuarios: Usuario[];
  setUsuarios: (usuarios: Usuario[]) => void;
  obtenerUsuarioPorEmail: (email: string) => Usuario | undefined;
  obtenerUsuarioPorId: (id: string) => Usuario | undefined;
  crearUsuario: (usuario: Omit<Usuario, 'id' | 'fechaRegistro'>) => Usuario; // Deprecated, use AuthContext
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
  crearPedido: (pedido: Omit<Pedido, 'id' | 'fecha'>) => Promise<Pedido>;
  actualizarPedido: (id: string, datos: Partial<Pedido>) => Promise<boolean>;

  // Geografía
  regiones: RegionOption[];
  comunas: ComunaOption[];

  // Utilidades
  resetearDatos: () => void;
  recargarProductos: () => Promise<void>;
}

// CREACIÓN DEL CONTEXT

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// PROVIDER DEL CONTEXT

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
  // Estados para cada entidad
  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Se podría cargar desde backend si hay endpoint
  const [articulosBlog, setArticulosBlog] = useState<ArticuloBlog[]>(articulosBlogIniciales);
  const [contactos, setContactos] = useState<DatosContacto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [regiones, setRegiones] = useState<RegionOption[]>([]);
  const [comunas, setComunas] = useState<ComunaOption[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      await Promise.all([
        cargarProductos(),
        cargarGeografia()
      ]);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
  };

  const cargarProductos = async () => {
    try {
      const inventario = await inventarioService.getAllInventario();
      // Transformar inventario a formato Producto del frontend
      // Agrupar por modelo
      const modelosMap = new Map<number, Producto>();

      inventario.forEach(item => {
        const modelo = item.modelo;
        if (!modelosMap.has(modelo.idModelo)) {
          modelosMap.set(modelo.idModelo, {
            id: modelo.idModelo,
            nombre: modelo.nombreModelo,
            precio: modelo.precioUnitario,
            imagen: modelo.imagenUrl || '/placeholder.jpg',
            categoria: 'hombre', // TODO: Mapear desde backend o agregar campo
            descripcion: modelo.descripcion,
            stock: 0,
            stockPorTalla: [],
            marca: modelo.marca.nombreMarca
          });
        }

        const producto = modelosMap.get(modelo.idModelo)!;
        producto.stock += item.stockActual;
        producto.stockPorTalla?.push({
          talla: parseInt(item.talla.numeroTalla) as any,
          stock: item.stockActual,
          idInventario: item.idInventario
        });
      });

      setProductos(Array.from(modelosMap.values()));
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const cargarGeografia = async () => {
    try {
      const regionesData = await geografiaService.getAllRegiones();
      const comunasData = await geografiaService.getAllComunas();

      const regionesOptions: RegionOption[] = regionesData.map(r => ({
        value: r.idRegion.toString(),
        label: r.nombreRegion,
        comunas: []
      }));

      const comunasOptions: ComunaOption[] = comunasData.map(c => ({
        value: c.idComuna.toString(),
        label: c.nombreComuna
      }));

      // Asignar comunas a regiones
      comunasData.forEach(c => {
        const regionOpt = regionesOptions.find(r => r.value === c.region.idRegion.toString());
        if (regionOpt) {
          regionOpt.comunas.push({
            value: c.idComuna.toString(),
            label: c.nombreComuna
          });
        }
      });

      setRegiones(regionesOptions);
      setComunas(comunasOptions);
    } catch (error) {
      console.error('Error cargando geografía:', error);
    }
  };

  // ==================== FUNCIONES DE PRODUCTOS ====================

  const obtenerProductoPorId = (id: number): Producto | undefined => {
    return productos.find(p => p.id === id);
  };

  const crearProducto = async (_producto: Omit<Producto, 'id'>): Promise<Producto> => {
    // Implementación pendiente en backend (InventarioService)
    console.warn('Crear producto no implementado en backend');
    return {} as Producto;
  };

  const actualizarProducto = async (_id: number, _datosActualizados: Partial<Producto>): Promise<boolean> => {
    // Implementación pendiente en backend
    console.warn('Actualizar producto no implementado en backend');
    return false;
  };

  const eliminarProducto = async (_id: number): Promise<boolean> => {
    // Implementación pendiente en backend
    console.warn('Eliminar producto no implementado en backend');
    return false;
  };

  // ==================== FUNCIONES DE USUARIOS ====================

  const obtenerUsuarioPorEmail = (email: string): Usuario | undefined => {
    return usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const obtenerUsuarioPorId = (id: string): Usuario | undefined => {
    return usuarios.find(u => u.id === id);
  };

  const crearUsuario = (_usuario: Omit<Usuario, 'id' | 'fechaRegistro'>): Usuario => {
    // Legacy support
    return {} as Usuario;
  };

  const actualizarUsuario = (_id: string, _datosActualizados: Partial<Usuario>): boolean => {
    return false;
  };

  const eliminarUsuario = (_id: string): boolean => {
    return false;
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

  const crearPedido = async (pedido: Omit<Pedido, 'id' | 'fecha'>): Promise<Pedido> => {
    try {
      // 1. Crear Boleta
      const nuevaBoleta = await ventasService.createBoleta({
        idCliente: parseInt(pedido.usuarioId),
        montoTotal: pedido.total,
        estado: 'emitida',
        fecha: new Date().toISOString()
      });

      // 2. Crear Detalles
      for (const item of pedido.items) {
        if (!item.idInventario) {
          console.warn('Item sin idInventario, saltando:', item);
          continue;
        }

        await ventasService.addDetalle({
          boleta: nuevaBoleta,
          idInventario: item.idInventario,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotal: item.precio * item.cantidad
        });
      }

      // 3. Crear Entrega (si aplica)
      if (pedido.direccionEnvio) {
        const idComunaDefecto = 1;

        await entregasService.createEntrega({
          idBoleta: nuevaBoleta.idBoleta,
          direccionEntrega: pedido.direccionEnvio,
          estadoEntrega: 'pendiente',
          fechaAsignacion: new Date().toISOString(),
          idComuna: idComunaDefecto
        });
      }

      const nuevoPedido: Pedido = {
        ...pedido,
        id: nuevaBoleta.idBoleta.toString(),
        fecha: nuevaBoleta.fecha
      };
      setPedidos([...pedidos, nuevoPedido]);
      return nuevoPedido;
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  };

  const actualizarPedido = async (_id: string, _datosActualizados: Partial<Pedido>): Promise<boolean> => {
    // Implementación pendiente
    return true;
  };

  // ==================== UTILIDADES ====================

  const resetearDatos = () => {
    setProductos([]);
    setUsuarios([]);
    setPedidos([]);
    localStorage.clear();
    cargarDatos();
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

    // Geografía
    regiones,
    comunas,

    // Utilidades
    resetearDatos,
    recargarProductos: cargarProductos
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
