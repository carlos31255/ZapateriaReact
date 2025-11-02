// Componente de campo de formulario reutilizable para inputs y selects

// Props del componente FormField
interface FormFieldProps {
  label: string;         // Etiqueta del campo
  id: string;            // ID único del campo
  name: string;          // Nombre del campo para el formulario
  type?: string;         // Tipo de input 
  value: string;         // Valor actual del campo
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; // Handler de cambio
  required?: boolean;    // Si el campo es obligatorio
  disabled?: boolean;    // Si el campo está deshabilitado
  placeholder?: string;  // Texto placeholder
  minLength?: number;    // Longitud mínima del valor
  options?: { value: string; label: string }[]; // Opciones para select dropdown
}

export const FormField = ({ 
  label, 
  id, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false,
  disabled = false,
  placeholder = '',
  minLength,
  options
}: FormFieldProps) => {
  // Si se proporcionan opciones, renderizar un select dropdown
  if (options) {
    return (
      <div className="mb-3">
        {/* Label con asterisco rojo si es requerido */}
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        {/* Select con opciones predefinidas */}
        <select
          className="form-select"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
        >
          {/* Opción por defecto vacía */}
          <option value="">Seleccionar...</option>
          {/* Mapear opciones proporcionadas */}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  // Si no hay opciones, renderizar un input estándar
  return (
    <div className="mb-3">
      {/* Label con asterisco rojo si es requerido */}
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {/* Input con todas las props configurables */}
      <input
        type={type}
        className="form-control"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        minLength={minLength}
      />
    </div>
  );
};
