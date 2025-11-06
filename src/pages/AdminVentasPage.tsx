import { useState, useEffect } from 'react';
import { usePedidos } from '../hooks';
import type { Pedido } from '../types';
import styles from './AdminVentasPage.module.css';

export const AdminVentasPage = () => {
  const { pedidos, fetchPedidos, fetchActualizarEstadoPedido, calcularEstadisticas } = usePedidos();
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Pedido[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Cargar pedidos al iniciar
  useEffect(() => {
    // Registrar visita a esta página
    const link = '/admin/ventas';
    const saved = localStorage.getItem('admin_recent_pages');
    let recentLinks = saved ? JSON.parse(saved) : [];
    recentLinks = recentLinks.filter((l: string) => l !== link);
    recentLinks.unshift(link);
    recentLinks = recentLinks.slice(0, 10);
    localStorage.setItem('admin_recent_pages', JSON.stringify(recentLinks));

    cargarPedidos();
  }, []);

  // Filtrar pedidos cuando cambia el filtro o los pedidos
  useEffect(() => {
    filtrarPedidos();
  }, [filtroEstado, pedidos]);

  const cargarPedidos = async () => {
    await fetchPedidos();
  };

  const filtrarPedidos = () => {
    if (filtroEstado === 'todos') {
      setPedidosFiltrados(pedidos);
    } else {
      setPedidosFiltrados(pedidos.filter((pedido: Pedido) => pedido.estado === filtroEstado));
    }
  };

  const abrirDetalle = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPedidoSeleccionado(null);
  };

  const handleCambiarEstado = async (pedidoId: string, nuevoEstado: Pedido['estado']) => {
    if (window.confirm(`¿Deseas cambiar el estado del pedido a "${nuevoEstado}"?`)) {
      await fetchActualizarEstadoPedido(pedidoId, nuevoEstado);
      await cargarPedidos();
      
      // Actualizar pedido seleccionado si está abierto
      if (pedidoSeleccionado && pedidoSeleccionado.id === pedidoId) {
        const pedidoActualizado = pedidos.find((p: Pedido) => p.id === pedidoId);
        if (pedidoActualizado) {
          setPedidoSeleccionado(pedidoActualizado);
        }
      }
    }
  };

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return styles.estadoPendiente;
      case 'procesando':
        return styles.estadoProcesando;
      case 'enviado':
        return styles.estadoEnviado;
      case 'entregado':
        return styles.estadoEntregado;
      case 'cancelado':
        return styles.estadoCancelado;
      default:
        return '';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bi-clock-history';
      case 'procesando':
        return 'bi-arrow-repeat';
      case 'enviado':
        return 'bi-truck';
      case 'entregado':
        return 'bi-check-circle';
      case 'cancelado':
        return 'bi-x-circle';
      default:
        return 'bi-circle';
    }
  };

  const estadisticas = calcularEstadisticas();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>
            <i className="bi bi-cart-check"></i> Gestión de Ventas
          </h1>
          <p className={styles.subtitle}>
            Administra y visualiza todas las ventas realizadas
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Ventas</span>
            <span className={styles.statValue}>${estadisticas.totalVentas.toLocaleString('es-CL')}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <i className="bi bi-receipt"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Pedidos</span>
            <span className={styles.statValue}>{estadisticas.totalPedidos}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <i className="bi bi-check-circle"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Completados</span>
            <span className={styles.statValue}>{estadisticas.ventasCompletadas}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <i className="bi bi-clock-history"></i>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Pendientes</span>
            <span className={styles.statValue}>{estadisticas.ventasPendientes}</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="filtroEstado">
            <i className="bi bi-funnel"></i> Filtrar por estado:
          </label>
          <select
            id="filtroEstado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="procesando">Procesando</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((pedido) => (
              <tr key={pedido.id}>
                <td>
                  <span className={styles.pedidoId}>#{pedido.id.slice(0, 8)}</span>
                </td>
                <td>
                  <div className={styles.clienteInfo}>
                    <span className={styles.clienteNombre}>{pedido.nombreUsuario}</span>
                    <span className={styles.clienteEmail}>{pedido.emailUsuario}</span>
                  </div>
                </td>
                <td>
                  {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td>
                  <span className={styles.itemsCount}>{pedido.items.length} items</span>
                </td>
                <td>
                  <span className={styles.total}>${pedido.total.toLocaleString('es-CL')}</span>
                </td>
                <td>
                  <span className={`${styles.estadoBadge} ${getEstadoBadgeClass(pedido.estado)}`}>
                    <i className={getEstadoIcon(pedido.estado)}></i>
                    {pedido.estado}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => abrirDetalle(pedido)}
                    className={styles.detailButton}
                    title="Ver detalles"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pedidosFiltrados.length === 0 && (
          <div className={styles.emptyState}>
            <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
            <p>No hay pedidos {filtroEstado !== 'todos' ? `en estado "${filtroEstado}"` : 'registrados'}</p>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {modalAbierto && pedidoSeleccionado && (
        <>
          <div className={styles.overlay} onClick={cerrarModal}></div>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>
                <i className="bi bi-receipt-cutoff"></i> Detalle del Pedido
              </h2>
              <button onClick={cerrarModal} className={styles.closeButton}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className={styles.modalContent}>
              {/* Información del pedido */}
              <div className={styles.infoSection}>
                <h3>Información General</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>ID Pedido:</span>
                    <span className={styles.infoValue}>#{pedidoSeleccionado.id}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Fecha:</span>
                    <span className={styles.infoValue}>
                      {new Date(pedidoSeleccionado.fecha).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Cliente:</span>
                    <span className={styles.infoValue}>{pedidoSeleccionado.nombreUsuario}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>{pedidoSeleccionado.emailUsuario}</span>
                  </div>
                  {pedidoSeleccionado.direccionEnvio && (
                    <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
                      <span className={styles.infoLabel}>Dirección de Envío:</span>
                      <span className={styles.infoValue}>{pedidoSeleccionado.direccionEnvio}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Productos */}
              <div className={styles.productsSection}>
                <h3>Productos</h3>
                <div className={styles.productsList}>
                  {pedidoSeleccionado.items.map((item, index) => (
                    <div key={index} className={styles.productItem}>
                      <img src={item.imagen} alt={item.nombre} className={styles.productImage} />
                      <div className={styles.productInfo}>
                        <span className={styles.productName}>{item.nombre}</span>
                        <span className={styles.productDetails}>
                          {item.tallaSeleccionada && `Talla: ${item.tallaSeleccionada} | `}
                          Cantidad: {item.cantidad}
                        </span>
                      </div>
                      <span className={styles.productPrice}>
                        ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen de pago */}
              <div className={styles.summarySection}>
                <h3>Resumen de Pago</h3>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>${pedidoSeleccionado.subtotal.toLocaleString('es-CL')}</span>
                </div>
                {pedidoSeleccionado.descuento > 0 && (
                  <div className={styles.summaryRow}>
                    <span>Descuento:</span>
                    <span className={styles.discount}>
                      -${pedidoSeleccionado.descuento.toLocaleString('es-CL')}
                    </span>
                  </div>
                )}
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total:</span>
                  <span>${pedidoSeleccionado.total.toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Cambiar estado */}
              <div className={styles.statusSection}>
                <h3>Estado del Pedido</h3>
                <div className={styles.statusControls}>
                  <span className={`${styles.estadoBadge} ${getEstadoBadgeClass(pedidoSeleccionado.estado)}`}>
                    <i className={getEstadoIcon(pedidoSeleccionado.estado)}></i>
                    {pedidoSeleccionado.estado}
                  </span>
                  <div className={styles.statusButtons}>
                    {pedidoSeleccionado.estado !== 'procesando' && pedidoSeleccionado.estado !== 'cancelado' && (
                      <button
                        onClick={() => handleCambiarEstado(pedidoSeleccionado.id, 'procesando')}
                        className={styles.statusButton}
                      >
                        <i className="bi bi-arrow-repeat"></i> Procesar
                      </button>
                    )}
                    {pedidoSeleccionado.estado !== 'enviado' && pedidoSeleccionado.estado !== 'cancelado' && (
                      <button
                        onClick={() => handleCambiarEstado(pedidoSeleccionado.id, 'enviado')}
                        className={styles.statusButton}
                      >
                        <i className="bi bi-truck"></i> Enviar
                      </button>
                    )}
                    {pedidoSeleccionado.estado !== 'entregado' && pedidoSeleccionado.estado !== 'cancelado' && (
                      <button
                        onClick={() => handleCambiarEstado(pedidoSeleccionado.id, 'entregado')}
                        className={styles.statusButton}
                      >
                        <i className="bi bi-check-circle"></i> Entregar
                      </button>
                    )}
                    {pedidoSeleccionado.estado !== 'cancelado' && pedidoSeleccionado.estado !== 'entregado' && (
                      <button
                        onClick={() => handleCambiarEstado(pedidoSeleccionado.id, 'cancelado')}
                        className={`${styles.statusButton} ${styles.cancelButton}`}
                      >
                        <i className="bi bi-x-circle"></i> Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
