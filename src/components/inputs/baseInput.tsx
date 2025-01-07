import React from 'react';
import { UseFormRegister, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export interface BaseInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
  errorMessage?: string;
  type?: 'text' | 'textarea' | 'number' | 'select';
  rows?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  options?: { value: string ; label: string }[];
  registerOptions?: RegisterOptions<T>; // Add registerOptions prop
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BaseInput = <T extends FieldValues>({
  register,
  name,
  label,
  errorMessage,
  type = 'text',
  rows,
  min,
  max,
  placeholder,
  options = [],
  registerOptions, // Destructure registerOptions
  onChange,
}: BaseInputProps<T>) => {
  return (
    <div className="flex items-center gap-4">
      <label className="w-1/4">{label}</label>
      <div className="w-3/4">
        {type === 'textarea' ? (
          <textarea
            {...register(name, registerOptions)} // Pass registerOptions
            className="w-full p-2 border rounded"
            rows={rows}
            placeholder={placeholder}
            aria-label={label}
            aria-describedby={errorMessage ? `${name}-error` : undefined}
            onChange={onChange}
          />
        ) : type === 'select' ? (
          <select
            {...register(name, registerOptions)} // Pass registerOptions
            className="w-full p-2 border rounded"
            aria-label={label}
            aria-describedby={errorMessage ? `${name}-error` : undefined}
            onChange={onChange}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...register(name, registerOptions)} // Pass registerOptions
            type={type}
            className="w-full p-2 border rounded"
            min={min}
            max={max}
            placeholder={placeholder}
            aria-label={label}
            aria-describedby={errorMessage ? `${name}-error` : undefined}
            onChange={onChange}
          />
        )}
        {errorMessage && (
          <p id={`${name}-error`} className="text-red-500 text-sm">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(BaseInput) as typeof BaseInput;