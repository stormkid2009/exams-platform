import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form'; // Import Path

interface BaseInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>; // Use Path<T> instead of string
  label: string;
  errorMessage?: string;
  type?: string;
  rows?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  onChange,
}: BaseInputProps<T>) => {
  return (
    <div className="flex items-center gap-4">
      <label className="w-1/4">{label}</label>
      <div className="w-3/4">
        {type === 'textarea' ? (
          <textarea
            {...register(name)} // Use name of type Path<T>
            className="w-full p-2 border rounded"
            rows={rows}
            placeholder={placeholder}
            aria-label={label}
            aria-describedby={errorMessage ? `${name}-error` : undefined}
            onChange={onChange}
          />
        ) : (
          <input
            {...register(name)} // Use name of type Path<T>
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