// Layout específico para el panel de administración

import { AdminHeader } from './AdminHeader';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className={styles.adminLayout}>
      <AdminHeader />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};
