import React from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import BaseInput from "./base-input";

/**
 * ContentInput Component
 * 
 * This component renders a textarea input for entering content. 
 * It integrates with react-hook-form for form handling.
 * 
 * Props:
 * - register (function): The register function from react-hook-form for input registration.
 * - name (string): The name of the input field.
 * - label (string): The label for the input field.
 * - placeholder (string, optional): An optional placeholder for the input.
 * - errorMessage (string, optional): An optional error message to display below the input.
 * - rows (number, optional): The number of rows for the textarea (default is 3).
 * 
 * The component uses the BaseInput component to render the textarea and 
 * applies default validation rules to ensure the field is required.
 */
interface ContentInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>; // Use Path<T> instead of string
  label: string;
  placeholder?: string;
  errorMessage?: string;
  rows?: number;
}

const ContentInput = <T extends FieldValues>({
  register,
  name,
  label,
  placeholder,
  errorMessage,
  rows = 3,
}: ContentInputProps<T>) => {
  return (
    <BaseInput
      register={register}
      name={name} // Pass name of type Path<T>
      label={label}
      placeholder={placeholder}
      errorMessage={errorMessage}
      type="textarea"
      rows={rows}
      registerOptions={{ required: true }}
    />
  );
};

export default React.memo(ContentInput) as typeof ContentInput;
