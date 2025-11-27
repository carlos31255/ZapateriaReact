// Custom hook para manejar pedidos usando servicios directamente

import { useState, useEffect } from 'react';
import { ventasService } from '../services/ventasService';
import { useAuth } from '../context/AuthContext';
import type { Pedido, CategoriaProducto } from '../types';

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
      const boletas = await ventasService.getBoletasByCliente(usuario.idPersonaBackend);

      // Mapear boletas a pedidos
      const pedidosMapeados: Pedido[] = await Promise.all(
        boletas.map(async (boleta) => {
          const detalles = await ventasService.getDetallesByBoleta(boleta.idBoleta);

          // Calcular subtotal y total
          const subtotal = detalles.reduce((sum, d) => sum + (d.precioUnitario * d.cantidad), 0);
          const descuento = 0; // TODO: Implementar descuentos

          return {
            id: boleta.idBoleta.toString(),
            usuarioId: usuario.id,
            nombreUsuario: usuario.nombre,
            emailUsuario: usuario.email,
            fecha: new Date().toISOString(), // TODO: Usar fecha real cuando esté disponible
            estado: boleta.estado as 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado',
            items: detalles.map(d => ({
              // Propiedades de Producto
              id: d.idInventario,
              productoId: d.idInventario,
              nombre: `Producto ${d.idInventario}`, // TODO: Obtener nombre real
              descripcion: '', // TODO: Obtener descripción real
              imagen: '', // TODO: Obtener imagen real
              precio: d.precioUnitario,
              categoria: 'hombre' as CategoriaProducto, // TODO: Obtener categoría real
              stock: 0, // TODO: Obtener stock real
              stockPorTalla: [],
              destacado: false,
              // Propiedades de ProductoCarrito
              cantidad: d.cantidad,
              tallaSeleccionada: undefined, // TODO: Obtener talla real
              idInventario: d.idInventario
            })),
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
        idVendedor: 1 // TODO: Vendedor por defecto
      });

      // Crear detalles de boleta
      for (const item of pedido.items) {
        await ventasService.addDetalle({
          boleta: nuevaBoleta,
          idInventario: item.idInventario || item.id,
          cantidad: item.cantidad,
          precioUnitario: item.precio
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
