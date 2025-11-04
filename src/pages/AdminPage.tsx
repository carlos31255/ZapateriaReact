// Panel principal de administración

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AdminPage.module.css';

export const AdminPage = () => {
  const { usuario } = useAuth();

  const menuItems = [
    {
      title: 'Gestión de Productos',
      description: 'Agregar, editar o eliminar productos de la tienda',
      icon: 'bi-box-seam',
      link: '/admin/productos',
      color: '#0d6efd'
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios del sistema',
      icon: 'bi-people',
      link: '/admin/usuarios',
      color: '#198754'
    },
    {
      title: 'Vista Previa',
      description: 'Ver la tienda como visitante sin opciones de compra',
      icon: 'bi-eye',
      link: '/preview',
      color: '#6f42c1'
    }
  ];

  return (
    <div className="container py-5">
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <i className="bi bi-speedometer2 me-3"></i>
            Panel de Administración
          </h1>
          <p className={styles.subtitle}>
            Bienvenido, <strong>{usuario?.nombre}</strong>
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <i className="bi bi-box-seam"></i>
            </div>
            <div className={styles.statContent}>
              <h3>Productos</h3>
              <p className={styles.statNumber}>Ver todos</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <i className="bi bi-people"></i>
            </div>
            <div className={styles.statContent}>
              <h3>Usuarios</h3>
              <p className={styles.statNumber}>Administrar</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <i className="bi bi-eye"></i>
            </div>
            <div className={styles.statContent}>
              <h3>Vista Previa</h3>
              <p className={styles.statNumber}>Ver tienda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <section>
        <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
        <div className="row g-4">
          {menuItems.map((item, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <Link to={item.link} className={styles.menuCard}>
                <div className={styles.menuIcon} style={{ color: item.color }}>
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <h3 className={styles.menuTitle}>{item.title}</h3>
                <p className={styles.menuDescription}>{item.description}</p>
                <div className={styles.menuArrow}>
                  <i className="bi bi-arrow-right"></i>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
