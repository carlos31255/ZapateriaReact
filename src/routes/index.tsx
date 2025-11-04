// CONFIGURACIÓN PRINCIPAL DE RUTAS

import { Routes, Route, Navigate } from 'react-router-dom';
import { RoleRoute } from './RoleRoute';
import { PublicRoute } from './PublicSiteRoute';
import { Layout } from '../components/layout/layout-components.index';
import { AdminLayout } from '../components/layout/layout-components.index';
import { PreviewLayout } from '../components/layout/layout-components.index';

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
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

// Páginas de administrador
import { AdminPage } from '../pages/AdminPage';
import { AdminProductosPage } from '../pages/AdminProductosPage';
import { AdminUsuariosPage } from '../pages/AdminUsuariosPage';

// Páginas de vista previa
import { PreviewProductosPage } from '../pages/PreviewProductosPage';

export const AppRoutes = () => {
  return (
    <>
      {/* ==================== RUTAS NORMALES CON LAYOUT COMPLETO ==================== */}
      <Routes>
        {/* ==================== RUTAS PÚBLICAS ==================== */}
        
        {/* Página principal - bloqueada para admin */}
        <Route 
          path="/" 
          element={
            <Layout>
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            </Layout>
          } 
        />
        
        {/* Productos - bloqueada para admin */}
        <Route 
          path="/productos" 
          element={
            <Layout>
              <PublicRoute>
                <ProductosPage />
              </PublicRoute>
            </Layout>
          } 
        />
        
        {/* Blog - bloqueada para admin */}
        <Route 
          path="/blog" 
          element={
            <Layout>
              <PublicRoute>
                <BlogPage />
              </PublicRoute>
            </Layout>
          } 
        />
        
        {/* Nosotros - bloqueada para admin */}
        <Route 
          path="/nosotros" 
          element={
            <Layout>
              <PublicRoute>
                <NosotrosPage />
              </PublicRoute>
            </Layout>
          } 
        />
        
        {/* Contacto - bloqueada para admin */}
        <Route 
          path="/contacto" 
          element={
            <Layout>
              <PublicRoute>
                <ContactoPage />
              </PublicRoute>
            </Layout>
          } 
        />

        {/* Autenticación */}
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/registro" element={<Layout><RegisterPage /></Layout>} />
        
        {/* Página de acceso denegado */}
        <Route path="/unauthorized" element={<Layout><UnauthorizedPage /></Layout>} />

        {/* ==================== RUTAS PROTEGIDAS ==================== */}
        
        {/* Carrito - solo para clientes y vendedores */}
        <Route 
          path="/carrito" 
          element={
            <Layout>
              <RoleRoute rolesPermitidos={['cliente', 'vendedor']}>
                <CarritoPage />
              </RoleRoute>
            </Layout>
          } 
        />

        {/* Perfil - solo para clientes y vendedores */}
        <Route 
          path="/perfil" 
          element={
            <Layout>
              <RoleRoute rolesPermitidos={['cliente', 'vendedor']}>
                <PerfilPage />
              </RoleRoute>
            </Layout>
          } 
        />

        {/* ==================== RUTAS DE ADMINISTRADOR ==================== */}
        
        {/* Panel de administración - solo administradores */}
        <Route 
          path="/admin" 
          element={
            <AdminLayout>
              <RoleRoute rolesPermitidos={['administrador']}>
                <AdminPage />
              </RoleRoute>
            </AdminLayout>
          } 
        />

        {/* Gestión de productos - solo administradores */}
        <Route 
          path="/admin/productos" 
          element={
            <AdminLayout>
              <RoleRoute rolesPermitidos={['administrador']}>
                <AdminProductosPage />
              </RoleRoute>
            </AdminLayout>
          } 
        />

        {/* Gestión de usuarios - solo administradores */}
        <Route 
          path="/admin/usuarios" 
          element={
            <AdminLayout>
              <RoleRoute rolesPermitidos={['administrador']}>
                <AdminUsuariosPage />
              </RoleRoute>
            </AdminLayout>
          } 
        />

        {/* ==================== RUTAS DE VISTA PREVIA (SOLO LECTURA) ==================== */}
        
        {/* Página principal preview */}
        <Route 
          path="/preview" 
          element={
            <RoleRoute rolesPermitidos={['administrador']}>
              <PreviewLayout>
                <HomePage />
              </PreviewLayout>
            </RoleRoute>
          } 
        />

        {/* Productos preview */}
        <Route 
          path="/preview/productos" 
          element={
            <RoleRoute rolesPermitidos={['administrador']}>
              <PreviewLayout>
                <PreviewProductosPage />
              </PreviewLayout>
            </RoleRoute>
          } 
        />

        {/* Blog preview */}
        <Route 
          path="/preview/blog" 
          element={
            <RoleRoute rolesPermitidos={['administrador']}>
              <PreviewLayout>
                <BlogPage />
              </PreviewLayout>
            </RoleRoute>
          } 
        />

        {/* Nosotros preview */}
        <Route 
          path="/preview/nosotros" 
          element={
            <RoleRoute rolesPermitidos={['administrador']}>
              <PreviewLayout>
                <NosotrosPage />
              </PreviewLayout>
            </RoleRoute>
          } 
        />

        {/* Contacto preview */}
        <Route 
          path="/preview/contacto" 
          element={
            <RoleRoute rolesPermitidos={['administrador']}>
              <PreviewLayout>
                <ContactoPage />
              </PreviewLayout>
            </RoleRoute>
          } 
        />

        {/* ==================== RUTAS NO ENCONTRADAS ==================== */}
        
        {/* Redirigir rutas no encontradas al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
