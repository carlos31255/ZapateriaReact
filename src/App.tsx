// COMPONENTE PRINCIPAL DE LA APLICACIÓN

import { BrowserRouter } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppRoutes } from './routes';

function App() {
  console.log('🚀 App iniciando...');
  
  return (
    <BrowserRouter>
      <DatabaseProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </DatabaseProvider>
    </BrowserRouter>
  );
}

export default App;
