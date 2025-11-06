import { useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import type { Pedido } from '../types';

export const usePedidos = () => {
  const context = useContext(DatabaseContext);
  
  if (!context) {
    throw new Error('usePedidos debe ser usado dentro de un DatabaseProvider');
  }

  const {
    pedidos,
    crearPedido,
    actualizarPedido,
  } = context;

  // Obtener todos los pedidos
  const fetchPedidos = async () => {
    return pedidos;
  };

  // Obtener pedido por ID
  const fetchPedidoPorId = async (id: string) => {
    return pedidos.find((p: Pedido) => p.id === id);
  };

  // Obtener pedidos de un usuario
  const fetchPedidosPorUsuario = async (usuarioId: string) => {
    return pedidos.filter((p: Pedido) => p.usuarioId === usuarioId);
  };

  // Crear nuevo pedido
  const fetchCrearPedido = async (pedido: Omit<Pedido, 'id' | 'fecha'>) => {
    return crearPedido(pedido);
  };

  // Actualizar estado de un pedido
  const fetchActualizarEstadoPedido = async (id: string, nuevoEstado: Pedido['estado']) => {
    return actualizarPedido(id, { estado: nuevoEstado });
  };

  // Calcular estadísticas de ventas
  const calcularEstadisticas = () => {
    const totalVentas = pedidos.reduce((sum: number, pedido: Pedido) => {
      if (pedido.estado !== 'cancelado') {
        return sum + pedido.total;
      }
      return sum;
    }, 0);

    const ventasCompletadas = pedidos.filter(
      (p: Pedido) => p.estado === 'entregado'
    ).length;

    const ventasPendientes = pedidos.filter(
      (p: Pedido) => p.estado === 'pendiente' || p.estado === 'procesando'
    ).length;

    const ventasCanceladas = pedidos.filter(
      (p: Pedido) => p.estado === 'cancelado'
    ).length;

    return {
      totalVentas,
      ventasCompletadas,
      ventasPendientes,
      ventasCanceladas,
      totalPedidos: pedidos.length,
    };
  };

  return {
    pedidos,
    fetchPedidos,
    fetchPedidoPorId,
    fetchPedidosPorUsuario,
    fetchCrearPedido,
    fetchActualizarEstadoPedido,
    calcularEstadisticas,
  };
};
