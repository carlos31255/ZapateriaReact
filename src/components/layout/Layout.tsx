// LAYOUT PRINCIPAL CON HEADER
// Envuelve todas las páginas con el header común

import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 80px)' }}>
        {children}
      </main>
    </>
  );
};
