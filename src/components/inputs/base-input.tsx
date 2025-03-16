import React from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

/**
 * BaseInput Component
 * 
 * This component renders a customizable input field that can be used for various types of inputs,
 * including text, textarea, number, and select. It integrates with react-hook-form for form handling.
 * 
 * Props:
 * - register (function): The register function from react-hook-form for input registration.
 * - name (string): The name of the input field.
 * - label (string): The label for the input field.
 * - errorMessage (string, optional): An optional error message to display below the input.
 * - type (string, optional): The type of input (default is "text"). Can be "text", "textarea", "number", or "select".
 * - rows (number, optional): The number of rows for textarea inputs.
 * - min (number, optional): The minimum value for number inputs.
 * - max (number, optional): The maximum value for number inputs.
 * - placeholder (string, optional): An optional placeholder for the input.
 * - options (array, optional): An optional array of options for select inputs.
 * - registerOptions (object, optional): Custom validation rules for the input.
 * - onChange (function, optional): A callback function to handle changes to the input value.
 * 
 * The component displays the label, input field, and any error messages, 
 * and it is memoized to optimize performance by preventing unnecessary re-renders.
 */
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
  registerOptions?: RegisterOptions<T, Path<T>>;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const inputClass =
  "w-full p-2 border border-gray-300 bg-slate-200 rounded focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-colors";

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

export default React.memo(BaseInput) as <T extends FieldValues>(props: BaseInputProps<T>) => React.ReactElement;
