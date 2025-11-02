// Componente de campo de formulario reutilizable

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  minLength?: number;
  options?: { value: string; label: string }[];
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
  if (options) {
    return (
      <div className="mb-3">
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        <select
          className="form-select"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
        >
          <option value="">Seleccionar...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
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
