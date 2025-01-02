import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface BaseInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>; // The name of the input field
  label: string; // The label for the input
  errorMessage?: string; // Optional error message
  type?: 'text' | 'textarea' | 'number' | 'select'; // Add 'select' as a type
  rows?: number; // Optional number of rows for textarea
  min?: number; // Optional minimum value for number inputs
  max?: number; // Optional maximum value for number inputs
  placeholder?: string; // Optional placeholder text
  options?: { value: string; label: string }[]; // Options for the dropdown list
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; // Optional onChange handler
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
  options = [], // Default to an empty array for options
  onChange,
}: BaseInputProps<T>) => {
  return (
    <div className="flex items-center gap-4">
      <label className="w-1/4">{label}</label>
      <div className="w-3/4">
        {type === 'textarea' ? (
          <textarea
            {...register(name)}
            className="w-full p-2 border rounded"
            rows={rows}
            placeholder={placeholder}
            aria-label={label}
            aria-describedby={errorMessage ? `${name}-error` : undefined}
            onChange={onChange}
          />
        ) : type === 'select' ? (
          <select
            {...register(name)}
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
            {...register(name)}
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