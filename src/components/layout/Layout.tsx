// LAYOUT PRINCIPAL CON HEADER Y FOOTER
// Envuelve todas las páginas con el header y footer común

import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      <main style={{ flex: '1' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
