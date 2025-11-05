// COMPONENTE PRINCIPAL DE LA APLICACIÓN

import { BrowserRouter } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppRoutes } from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
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
