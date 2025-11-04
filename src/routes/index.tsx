// CONFIGURACIÓN PRINCIPAL DE RUTAS

import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from '../components/layout/layout-components.index';

// Páginas públicas
import { HomePage } from '../pages/HomePage';
import { ProductosPage } from '../pages/ProductosPage';
import { BlogPage } from '../pages/BlogPage';
import { NosotrosPage } from '../pages/NosotrosPage';
import { ContactoPage } from '../pages/ContactoPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

// Páginas protegidas
import { CarritoPage } from '../pages/CarritoPage';
import { PerfilPage } from '../pages/PerfilPage';

export const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
      {/* ==================== RUTAS PÚBLICAS ==================== */}
      
      {/* Página principal */}
      <Route path="/" element={<HomePage />} />
      
      {/* Productos */}
      <Route path="/productos" element={<ProductosPage />} />
      
      {/* Blog */}
      <Route path="/blog" element={<BlogPage />} />
      
      {/* Nosotros */}
      <Route path="/nosotros" element={<NosotrosPage />} />
      
      {/* Contacto */}
      <Route path="/contacto" element={<ContactoPage />} />

      {/* Autenticación */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* ==================== RUTAS PROTEGIDAS ==================== */}
      
      {/* Carrito - requiere autenticación */}
      <Route 
        path="/carrito" 
        element={
          <ProtectedRoute>
            <CarritoPage />
          </ProtectedRoute>
        } 
      />

      {/* Perfil - requiere autenticación */}
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <PerfilPage />
          </ProtectedRoute>
        } 
      />

      {/* ==================== RUTAS NO ENCONTRADAS ==================== */}
      
      {/* Redirigir rutas no encontradas al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Layout>
  );
};
