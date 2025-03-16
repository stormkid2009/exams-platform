import React from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import BaseInput from "./base-input"; // Import the BaseInput component
/**
 * OptionInput Component
 * 
 * This component renders an input field for entering an option value. 
 * It integrates with react-hook-form for form handling.
 * 
 * Props:
 * - register (function): The register function from react-hook-form for input registration.
 * - name (string): The name of the input field.
 * - label (string): The label for the input field.
 * - placeholder (string, optional): An optional placeholder for the input.
 * - errorMessage (string, optional): An optional error message to display below the input.
 * 
 * The component uses the BaseInput component to render the input field with a default validation rule 
 * to ensure the field is required.
 */

interface OptionInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>; // The name of the input field
  label: string; // The label for the input
  placeholder?: string; // Optional placeholder
  errorMessage?: string; // Optional error message
}

const OptionInput = <T extends FieldValues>({
  register,
  name,
  label,
  errorMessage,
}: OptionInputProps<T>) => {
  return (
    <BaseInput
      register={register}
      name={name}
      label={label}
      errorMessage={errorMessage}
      type="text"
      registerOptions={{ required: true }}
    />
  );
};

export default React.memo(OptionInput) as typeof OptionInput;
