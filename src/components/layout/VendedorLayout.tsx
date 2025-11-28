// Layout específico para el panel de vendedor

import { VendedorHeader } from './VendedorHeader';
import styles from './AdminLayout.module.css'; // Reutilizamos estilos del admin

interface VendedorLayoutProps {
    children: React.ReactNode;
}

export const VendedorLayout = ({ children }: VendedorLayoutProps) => {
    return (
        <div className={styles.adminLayout}>
            <VendedorHeader />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};
