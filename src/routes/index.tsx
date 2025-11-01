// CONFIGURACIÓN PRINCIPAL DE RUTAS

import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Páginas públicas
import { HomePage } from '../pages/HomePage';
import { ProductosPage } from '../pages/ProductosPage';
import { BlogPage } from '../pages/BlogPage';
import { NosotrosPage } from '../pages/NosotrosPage';
import { ContactoPage } from '../pages/ContactoPage';

// Páginas protegidas
import { CarritoPage } from '../pages/CarritoPage';

export const AppRoutes = () => {
  return (
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

      {/* ==================== RUTAS NO ENCONTRADAS ==================== */}
      
      {/* Redirigir rutas no encontradas al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
