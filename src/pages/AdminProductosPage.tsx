// Página de gestión de productos para administradores

import { useState, useEffect } from 'react';
import { useProducts } from '../hooks';
import type { Producto, CategoriaProducto, TallaCalzado, StockTalla } from '../types';
import styles from './AdminProductosPage.module.css';

const TALLAS_DISPONIBLES: TallaCalzado[] = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

export const AdminProductosPage = () => {
  const { productos, loading, crearProducto, actualizarProducto, eliminarProducto } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    imagen: '',
    categoria: 'hombre' as CategoriaProducto,
    descripcion: '',
    destacado: false
  });
  const [stockPorTalla, setStockPorTalla] = useState<StockTalla[]>(
    TALLAS_DISPONIBLES.map(talla => ({ talla, stock: 0 }))
  );

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string>('');

  useEffect(() => {
    // Registrar visita a esta página
    const link = '/admin/productos';
    const saved = localStorage.getItem('admin_recent_pages');
    let recentLinks = saved ? JSON.parse(saved) : [];
    recentLinks = recentLinks.filter((l: string) => l !== link);
    recentLinks.unshift(link);
    recentLinks = recentLinks.slice(0, 10);
    localStorage.setItem('admin_recent_pages', JSON.stringify(recentLinks));
  }, []);


  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Manejar cambios en el archivo de imagen
  const handleImagenFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  // Abrir modal para nuevo producto
  const abrirModalNuevo = () => {
    setProductoEditar(null);
    setFormData({
      nombre: '',
      precio: '',
      imagen: '',
      categoria: 'hombre',
      descripcion: '',
      destacado: false
    });
    setStockPorTalla(TALLAS_DISPONIBLES.map(talla => ({ talla, stock: 0 })));
    setImagenFile(null);
    setImagenPreview('');
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
      destacado: producto.destacado || false
    });
    // Cargar stock por talla existente o crear uno vacío
    const tallasExistentes = producto.stockPorTalla || [];
    const tallasCompletas = TALLAS_DISPONIBLES.map(talla => {
      const tallaExistente = tallasExistentes.find(t => t.talla === talla);
      return tallaExistente || { talla, stock: 0 };
    });
    setStockPorTalla(tallasCompletas);
    setShowModal(true);
  };

  const handleStockTallaChange = (talla: TallaCalzado, stock: number) => {
    setStockPorTalla(prev =>
      prev.map(item =>
        item.talla === talla ? { ...item, stock: Math.max(0, stock) } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Calcular stock total
      const stockTotal = stockPorTalla.reduce((sum, item) => sum + item.stock, 0);

      const productoData = {
        nombre: formData.nombre,
        precio: Number(formData.precio),
        imagen: formData.imagen,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        stock: stockTotal,
        stockPorTalla: stockPorTalla,
        destacado: formData.destacado
      };

      if (productoEditar) {
        // Actualizar producto existente
        await actualizarProducto(productoEditar.id, productoData);
      } else {
        // Agregar nuevo producto
        await crearProducto(productoData);
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await eliminarProducto(id);
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

                {/* Stock por Tallas */}
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>
                    <i className="bi bi-rulers me-2"></i>
                    Stock por Talla *
                    <small className="text-muted ms-2">
                      (Total: {stockPorTalla.reduce((sum, item) => sum + item.stock, 0)} unidades)
                    </small>
                  </label>
                  <div className={styles.tallasGrid}>
                    {stockPorTalla.map((item) => (
                      <div key={item.talla} className={styles.tallaItem}>
                        <label className={styles.tallaLabel}>
                          Talla {item.talla}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={item.stock}
                          onChange={(e) => handleStockTallaChange(item.talla, Number(e.target.value))}
                          className={styles.tallaInput}
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label>
                    <i className="bi bi-image me-2"></i>
                    Imagen del Producto *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagenFileChange}
                    style={{
                      padding: '10px',
                      border: '2px dashed #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  />
                  {imagenPreview && (
                    <div style={{ marginTop: '15px', textAlign: 'center' }}>
                      <img
                        src={imagenPreview}
                        alt="Preview"
                        style={{
                          maxWidth: '300px',
                          maxHeight: '300px',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                  )}
                  <small className="text-muted d-block mt-2">
                    Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                  </small>
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
