// Botón flotante de edición para vista previa

import { Link } from 'react-router-dom';
import styles from './EditButton.module.css';

interface EditButtonProps {
  editPath: string;
  label: string;
}

export const EditButton = ({ editPath, label }: EditButtonProps) => {
  return (
    <Link to={editPath} className={styles.editButton} title={`Editar ${label}`}>
      <i className="bi bi-pencil-square"></i>
      <span>Editar {label}</span>
    </Link>
  );
};
