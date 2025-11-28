// Página de visualización de productos para vendedores (Solo Lectura)

import { useState, useEffect } from 'react';
import { useProducts } from '../hooks';
import styles from './AdminProductosPage.module.css'; // Reutilizamos estilos del admin

export const VendedorProductosPage = () => {
    const { productos, loading } = useProducts();
    const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');

    useEffect(() => {
        // Registrar visita a esta página
        const link = '/vendedor/productos';
        const saved = localStorage.getItem('vendedor_recent_pages');
        let recentLinks = saved ? JSON.parse(saved) : [];
        recentLinks = recentLinks.filter((l: string) => l !== link);
        recentLinks.unshift(link);
        recentLinks = recentLinks.slice(0, 10);
        localStorage.setItem('vendedor_recent_pages', JSON.stringify(recentLinks));
    }, []);

    const productosFiltrados = filtroCategoria === 'todos'
        ? productos
        : productos.filter(p => p.categoria === filtroCategoria);

    return (
        <div className="container py-5">
            {/* Header */}
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        <i className="bi bi-box-seam me-3"></i>
                        Catálogo de Productos
                    </h1>
                    <p className={styles.subtitle}>
                        Visualiza el inventario y detalles de productos
                    </p>
                </div>
            </header>

            {/* Filtros */}
            <div className="mb-4">
                <select
                    className="form-select w-auto"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                    <option value="todos">Todas las categorías</option>
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="niños">Niños</option>
                    <option value="deportivos">Deportivos</option>
                </select>
            </div>

            {/* Tabla de productos */}
            <div className={styles.tableContainer}>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock Total</th>
                                <th>Detalle Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.id}</td>
                                    <td>
                                        <img src={producto.imagen} alt={producto.nombre} className={styles.productImage} />
                                    </td>
                                    <td className={styles.productName}>
                                        {producto.nombre}
                                        {producto.destacado && <i className="bi bi-star-fill text-warning ms-2" title="Destacado"></i>}
                                    </td>
                                    <td>
                                        <span className={styles.categoryBadge}>{producto.categoria}</span>
                                    </td>
                                    <td className={styles.price}>${producto.precio.toLocaleString()}</td>
                                    <td>
                                        {(() => {
                                            const stockTotal = producto.stockPorTalla?.reduce((sum, t) => sum + t.stock, 0) || 0;
                                            return (
                                                <span className={`${styles.stockBadge} ${stockTotal === 0 ? styles.outOfStock : stockTotal < 10 ? styles.lowStock : styles.inStock}`}>
                                                    {stockTotal} unidades
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td>
                                        <div className="d-flex flex-wrap gap-1">
                                            {producto.stockPorTalla?.map(t => (
                                                <span key={t.talla} className="badge bg-light text-dark border" title={`Talla ${t.talla}: ${t.stock}`}>
                                                    {t.talla}: {t.stock}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
