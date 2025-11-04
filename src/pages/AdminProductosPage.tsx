// Página de gestión de productos para administradores

import { useState, useEffect } from 'react';
import { fetchProductos } from '../services/productService';
import { crearProducto, actualizarProducto, eliminarProducto } from '../data/database';
import type { Producto, CategoriaProducto } from '../types';
import styles from './AdminProductosPage.module.css';

export const AdminProductosPage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    imagen: '',
    categoria: 'hombre' as CategoriaProducto,
    descripcion: '',
    stock: '',
    destacado: false
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await fetchProductos();
      if (response.success && response.data) {
        setProductos(response.data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const abrirModalNuevo = () => {
    setProductoEditar(null);
    setFormData({
      nombre: '',
      precio: '',
      imagen: '',
      categoria: 'hombre',
      descripcion: '',
      stock: '',
      destacado: false
    });
    setShowModal(true);
  };

  const abrirModalEditar = (producto: Producto) => {
    setProductoEditar(producto);
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
      imagen: producto.imagen,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      stock: producto.stock.toString(),
      destacado: producto.destacado || false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productoData = {
        nombre: formData.nombre,
        precio: Number(formData.precio),
        imagen: formData.imagen,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        stock: Number(formData.stock),
        destacado: formData.destacado
      };

      if (productoEditar) {
        // Actualizar producto existente
        actualizarProducto(productoEditar.id, productoData);
      } else {
        // Agregar nuevo producto (crearProducto genera el ID automáticamente)
        crearProducto(productoData);
      }

      setShowModal(false);
      cargarProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleEliminar = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        eliminarProducto(id);
        cargarProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <i className="bi bi-box-seam me-3"></i>
            Gestión de Productos
          </h1>
          <p className={styles.subtitle}>
            Administra el catálogo de productos de la tienda
          </p>
        </div>
        <button className={styles.addButton} onClick={abrirModalNuevo}>
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Producto
        </button>
      </header>

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
                <th>Stock</th>
                <th>Destacado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>
                    <img src={producto.imagen} alt={producto.nombre} className={styles.productImage} />
                  </td>
                  <td className={styles.productName}>{producto.nombre}</td>
                  <td>
                    <span className={styles.categoryBadge}>{producto.categoria}</span>
                  </td>
                  <td className={styles.price}>${producto.precio.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.stockBadge} ${producto.stock === 0 ? styles.outOfStock : producto.stock < 5 ? styles.lowStock : styles.inStock}`}>
                      {producto.stock} unidades
                    </span>
                  </td>
                  <td>
                    {producto.destacado && <i className="bi bi-star-fill text-warning"></i>}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => abrirModalEditar(producto)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleEliminar(producto.id)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para agregar/editar producto */}
      {showModal && (
        <>
          <div className={styles.overlay} onClick={() => setShowModal(false)}></div>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{productoEditar ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Zapatos Oxford Clásicos"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Precio *</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="Ej: 89990"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Categoría *</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="niños">Niños</option>
                    <option value="deportivos">Deportivos</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="Ej: 15"
                  />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>URL de Imagen *</label>
                  <input
                    type="url"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleInputChange}
                    required
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>Descripción *</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Descripción del producto..."
                  />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="destacado"
                      checked={formData.destacado}
                      onChange={handleInputChange}
                    />
                    <span>Producto Destacado</span>
                  </label>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton}>
                  <i className="bi bi-check-lg me-2"></i>
                  {productoEditar ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
