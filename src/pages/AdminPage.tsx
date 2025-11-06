// Panel principal de administración

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import styles from './AdminPage.module.css';

interface MenuItem {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
  gradient: string;
}

export const AdminPage = () => {
  const { usuario } = useAuth();
  const [recentItems, setRecentItems] = useState<MenuItem[]>([]);

  const allMenuItems: MenuItem[] = [
    {
      title: 'Gestión de Productos',
      description: 'Agregar, editar o eliminar productos de la tienda',
      icon: 'bi-box-seam',
      link: '/admin/productos',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios del sistema',
      icon: 'bi-people',
      link: '/admin/usuarios',
      color: '#f093fb',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Gestión de Ventas',
      description: 'Ver y administrar pedidos y ventas realizadas',
      icon: 'bi-cart-check',
      link: '/admin/ventas',
      color: '#43e97b',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      title: 'Gestión de Blog',
      description: 'Crear y editar entradas del blog',
      icon: 'bi-journal-text',
      link: '/admin/blog',
      color: '#fd7e14',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      title: 'Vista Previa',
      description: 'Ver la tienda como visitante sin opciones de compra',
      icon: 'bi-eye',
      link: '/preview',
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  useEffect(() => {
    // Cargar últimos 3 usados desde localStorage
    const saved = localStorage.getItem('admin_recent_pages');
    if (saved) {
      const recentLinks = JSON.parse(saved);
      const recent = recentLinks
        .slice(0, 3)
        .map((link: string) => allMenuItems.find(item => item.link === link))
        .filter(Boolean);
      setRecentItems(recent);
    } else {
      // Por defecto mostrar los primeros 3
      setRecentItems(allMenuItems.slice(0, 3));
    }
  }, []);

  const handleItemClick = (link: string) => {
    // Guardar en historial de páginas recientes
    const saved = localStorage.getItem('admin_recent_pages');
    let recentLinks = saved ? JSON.parse(saved) : [];
    
    // Remover si ya existe y agregarlo al inicio
    recentLinks = recentLinks.filter((l: string) => l !== link);
    recentLinks.unshift(link);
    
    // Guardar solo los últimos 10
    recentLinks = recentLinks.slice(0, 10);
    localStorage.setItem('admin_recent_pages', JSON.stringify(recentLinks));
  };

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

      {/* Stats Cards - Acceso Rápido a todas las secciones */}
      <div className="row g-4 mb-5">
        {allMenuItems.map((item, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <Link 
              to={item.link} 
              className={styles.statCard}
              onClick={() => handleItemClick(item.link)}
            >
              <div className={styles.statIcon} style={{ background: item.gradient }}>
                <i className={`bi ${item.icon}`}></i>
              </div>
              <div className={styles.statContent}>
                <h3>{item.title.replace('Gestión de ', '')}</h3>
                <p className={styles.statNumber}>
                  {index === 0 ? 'Ver todos' : 
                   index === 1 ? 'Administrar' : 
                   index === 2 ? 'Gestionar' : 
                   index === 3 ? 'Editar entradas' : 
                   'Ver tienda'}
                </p>
              </div>
              <div className={styles.statArrow}>
                <i className="bi bi-arrow-right"></i>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Menu Grid - Últimas 3 páginas visitadas */}
      <section>
        <h2 className={styles.sectionTitle}>
          <i className="bi bi-clock-history me-2"></i>
          Acciones Rápidas
          <small className="text-muted ms-2" style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>
            (Últimas páginas visitadas)
          </small>
        </h2>
        <div className="row g-4">
          {recentItems.map((item, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <Link 
                to={item.link} 
                className={styles.menuCard}
                onClick={() => handleItemClick(item.link)}
              >
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
