import React from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import BaseInput from "./base-input"; // Import the BaseInput component

interface AnswerInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>; // The name of the input field
  errorMessage?: string; // Optional error message
  maxOptions: 4 | 5; // Maximum number of options (only 4 or 5 allowed)
  label?: string; // Optional label
  placeholder?: string; // Optional placeholder
  options?: { value: string; label: string }[]; // Optional custom options
  registerOptions?: RegisterOptions<T>; // Optional custom validation rules
}

const AnswerInput = <T extends FieldValues>({
  register,
  name,
  errorMessage,
  maxOptions,
  label = "Correct Answer", // Default label
  options: customOptions, // Custom options
  registerOptions = { required: true }, // Default validation rules
}: AnswerInputProps<T>) => {
  if (![4, 5].includes(maxOptions)) {
    throw new Error("Invalid maxOptions value. Must be 4 or 5.");
  }

  const validatedMaxOptions = maxOptions;

  const defaultOptions = React.useMemo(
    () =>
      Array.from({ length: validatedMaxOptions }, (_, index) => ({
        value: String.fromCharCode(97 + index), // 'a', 'b', 'c', etc.
        label: String.fromCharCode(65 + index), // 'A', 'B', 'C', etc.
      })),
    [validatedMaxOptions]
  );

  const finalOptions = customOptions || defaultOptions;

  return (
    <BaseInput
      register={register}
      name={name}
      label={label}
      errorMessage={errorMessage}
      type="select"
      options={finalOptions}
      registerOptions={registerOptions}
    />
  );
};

export default React.memo(AnswerInput) as typeof AnswerInput;
