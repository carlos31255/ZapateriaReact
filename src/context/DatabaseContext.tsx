// CONTEXT SIMPLIFICADO - Solo para datos sin backend (Blog y Contactos)
// Los productos, usuarios y pedidos se gestionan directamente con los servicios

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ArticuloBlog, DatosContacto } from '../types';
import { articulosBlogIniciales } from '../data/database';

// TIPOS

interface DatabaseContextType {
  // Blog (contenido estático)
  articulosBlog: ArticuloBlog[];
  setArticulosBlog: (articulos: ArticuloBlog[]) => void;
  obtenerArticuloPorId: (id: number) => ArticuloBlog | undefined;
  crearArticuloBlog: (articulo: Omit<ArticuloBlog, 'id'>) => ArticuloBlog;
  actualizarArticuloBlog: (id: number, datos: Partial<ArticuloBlog>) => boolean;
  eliminarArticuloBlog: (id: number) => boolean;

  // Contactos (almacenamiento local temporal)
  contactos: DatosContacto[];
  setContactos: (contactos: DatosContacto[]) => void;
  guardarContacto: (contacto: Omit<DatosContacto, 'fecha'>) => DatosContacto;
}

// CREACIÓN DEL CONTEXT

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// PROVIDER DEL CONTEXT

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
  const [articulosBlog, setArticulosBlog] = useState<ArticuloBlog[]>(articulosBlogIniciales);
  const [contactos, setContactos] = useState<DatosContacto[]>([]);

  // ==================== FUNCIONES DE BLOG ====================

  const obtenerArticuloPorId = (id: number): ArticuloBlog | undefined => {
    return articulosBlog.find(a => a.id === id);
  };

  const crearArticuloBlog = (articulo: Omit<ArticuloBlog, 'id'>): ArticuloBlog => {
    const nuevoId = Math.max(...articulosBlog.map(a => a.id), 0) + 1;
    const nuevoArticulo: ArticuloBlog = {
      ...articulo,
      id: nuevoId
    };
    setArticulosBlog([...articulosBlog, nuevoArticulo]);
    return nuevoArticulo;
  };

  const actualizarArticuloBlog = (id: number, datos: Partial<ArticuloBlog>): boolean => {
    const index = articulosBlog.findIndex(a => a.id === id);
    if (index === -1) return false;

    const articulosActualizados = [...articulosBlog];
    articulosActualizados[index] = { ...articulosActualizados[index], ...datos };
    setArticulosBlog(articulosActualizados);
    return true;
  };

  const eliminarArticuloBlog = (id: number): boolean => {
    const articulosFiltrados = articulosBlog.filter(a => a.id !== id);
    if (articulosFiltrados.length === articulosBlog.length) return false;
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

    // TODO: En producción, enviar a servicio externo como EmailJS o Formspree
    console.log('Contacto guardado:', nuevoContacto);

    return nuevoContacto;
  };

  // ==================== VALOR DEL CONTEXT ====================

  const value: DatabaseContextType = {
    articulosBlog,
    setArticulosBlog,
    obtenerArticuloPorId,
    crearArticuloBlog,
    actualizarArticuloBlog,
    eliminarArticuloBlog,
    contactos,
    setContactos,
    guardarContacto
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};

// HOOK PERSONALIZADO

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase debe usarse dentro de DatabaseProvider');
  }
  return context;
};
