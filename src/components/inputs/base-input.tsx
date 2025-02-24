import React from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

export interface BaseInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
  errorMessage?: string;
  type?: "text" | "textarea" | "number" | "select";
  rows?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  options?: { value: string; label: string }[];
  registerOptions?: RegisterOptions<T>;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const inputClass =
  "w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-colors";

const BaseInput = <T extends FieldValues>({
  register,
  name,
  label,
  errorMessage,
  type = "text",
  rows,
  min,
  max,
  placeholder,
  options = [],
  registerOptions,
  onChange,
}: BaseInputProps<T>) => {
  return (
    <div className="flex items-center gap-4">
      <label className="w-1/4 bg-slate-600 text-white text-center font-semibold text-lg p-1 rounded">
        {label}
      </label>
      <div className="w-3/4">
        {type === "textarea" ? (
          <textarea
            {...register(name, registerOptions)}
            className={inputClass}
            rows={rows}
            placeholder={placeholder}
            aria-label={label}
            aria-describedby={errorMessage ? `${name}-error` : undefined}
            onChange={onChange}
          />
        ) : type === "select" ? (
          <select
            {...register(name, registerOptions)}
            className={inputClass}
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
            {...register(name, registerOptions)}
            type={type}
            className={inputClass}
            min={min}
            max={max}
            placeholder={placeholder}
            aria-label={label}
            aria-describedby={errorMessage ? `${name}-error` : undefined}
            onChange={onChange}
          />
        )}
        {errorMessage && (
          <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(BaseInput) as typeof BaseInput;
