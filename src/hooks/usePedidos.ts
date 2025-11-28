// Custom hook para manejar pedidos usando servicios directamente

import { useState, useEffect } from 'react';
import { ventasService } from '../services/ventasService';
import { inventarioService } from '../services/inventarioService';
import { useAuth } from '../context/AuthContext';
import type { Pedido, CategoriaProducto, TallaCalzado } from '../types';

export const usePedidos = () => {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarPedidos = async () => {
    if (!usuario?.idPersonaBackend) {
      setPedidos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Si es admin o vendedor, cargar TODAS las boletas
      // Si es cliente, cargar solo sus boletas
      let boletas;
      if (usuario.rol === 'administrador' || usuario.rol === 'vendedor') {
        console.log('Cargando TODAS las boletas (admin/vendedor)');
        boletas = await ventasService.getAllBoletas();
      } else {
        console.log('Cargando pedidos para cliente:', usuario.idPersonaBackend);
        boletas = await ventasService.getBoletasByCliente(usuario.idPersonaBackend);
      }

      console.log('Boletas encontradas:', boletas);

      // Mapear boletas a pedidos
      const pedidosMapeados: Pedido[] = await Promise.all(
        boletas.map(async (boleta) => {
          const detalles = await ventasService.getDetallesByBoleta(boleta.idBoleta);

          // Calcular subtotal y total
          const subtotal = detalles.reduce((sum, d) => sum + (d.precioUnitario * d.cantidad), 0);
          const descuento = 0; // Implementar descuentos

          // Obtener datos reales de los productos desde el inventario
          const items = await Promise.all(
            detalles.map(async (d) => {
              try {
                const inventario = await inventarioService.getInventarioById(d.idInventario);

                return {
                  // Propiedades de Producto
                  id: d.idInventario,
                  productoId: d.idInventario,
                  nombre: inventario.modelo?.nombreModelo || `Producto ${d.idInventario}`,
                  descripcion: inventario.modelo?.descripcion || '',
                  imagen: inventario.modelo?.imagenUrl || '',
                  precio: d.precioUnitario,
                  categoria: (inventario.modelo?.categoria || 'hombre') as CategoriaProducto,
                  stock: inventario.stockActual || 0,
                  stockPorTalla: [],
                  destacado: false,
                  // Propiedades de ProductoCarrito
                  cantidad: d.cantidad,
                  tallaSeleccionada: inventario.talla?.numeroTalla ? Number(inventario.talla.numeroTalla) as TallaCalzado : undefined,
                  idInventario: d.idInventario
                };
              } catch (error) {
                console.error(`Error cargando producto ${d.idInventario}:`, error);
                // Retornar datos por defecto si falla
                return {
                  id: d.idInventario,
                  productoId: d.idInventario,
                  nombre: `Producto ${d.idInventario}`,
                  descripcion: '',
                  imagen: '',
                  precio: d.precioUnitario,
                  categoria: 'hombre' as CategoriaProducto,
                  stock: 0,
                  stockPorTalla: [],
                  destacado: false,
                  cantidad: d.cantidad,
                  tallaSeleccionada: undefined,
                  idInventario: d.idInventario
                };
              }
            })
          );

          return {
            id: boleta.idBoleta.toString(),
            usuarioId: usuario.id,
            nombreUsuario: usuario.nombre,
            emailUsuario: usuario.email,
            fecha: new Date().toISOString(), // Usar fecha real cuando esté disponible
            estado: boleta.estado as 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado',
            items,
            subtotal,
            descuento,
            total: subtotal - descuento,
            direccionEnvio: usuario.direccion || '',
            metodoPago: 'Transferencia'
          };
        })
      );

      setPedidos(pedidosMapeados);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      setError('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, [usuario]);

  const crearPedido = async (pedido: Omit<Pedido, 'id' | 'fecha'>): Promise<Pedido | null> => {
    if (!usuario?.idPersonaBackend) {
      console.error('Usuario no autenticado');
      return null;
    }

    try {
      // Crear boleta
      const nuevaBoleta = await ventasService.createBoleta({
        idCliente: usuario.idPersonaBackend,
        idVendedor: 1 // Vendedor por defecto
      });

      // Crear detalles de boleta
      for (const item of pedido.items) {
        const precioUnitario = Math.round(item.precio);
        const subtotal = Math.round(item.precio * item.cantidad);

        await ventasService.addDetalle({
          boleta: { idBoleta: nuevaBoleta.idBoleta },
          inventario: { idInventario: item.idInventario || item.id },
          cantidad: item.cantidad,
          precioUnitario: precioUnitario,
          subtotal: subtotal
        });
      }

      await cargarPedidos();

      return {
        id: nuevaBoleta.idBoleta.toString(),
        ...pedido,
        fecha: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error creando pedido:', err);
      return null;
    }
  };

  const actualizarPedido = async (id: string, datos: Partial<Pedido>): Promise<boolean> => {
    try {
      if (datos.estado) {
        await ventasService.updateBoletaEstado(parseInt(id), datos.estado);
      }
      await cargarPedidos();
      return true;
    } catch (err) {
      console.error('Error actualizando pedido:', err);
      return false;
    }
  };

  const actualizarEstadoPedido = async (id: string, estado: Pedido['estado']): Promise<boolean> => {
    return await actualizarPedido(id, { estado });
  };

  const calcularEstadisticas = () => {
    const totalVentas = pedidos.reduce((sum, p) => sum + p.total, 0);
    const totalPedidos = pedidos.length;
    const ventasCompletadas = pedidos.filter(p => p.estado === 'entregado').length;
    const ventasPendientes = pedidos.filter(p => p.estado === 'pendiente').length;

    return {
      totalVentas,
      totalPedidos,
      ventasCompletadas,
      ventasPendientes
    };
  };

  return {
    pedidos,
    loading,
    error,
    crearPedido,
    actualizarPedido,
    recargarPedidos: cargarPedidos,
    // Aliases para compatibilidad
    fetchPedidos: cargarPedidos,
    fetchActualizarEstadoPedido: actualizarEstadoPedido,
    calcularEstadisticas
  };
};
