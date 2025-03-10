import React from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import BaseInput from "./base-input"; // Import the BaseInput component

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
