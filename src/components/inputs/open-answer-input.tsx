import React from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import BaseInput from "./base-input"; // Import the BaseInput component

interface OpenAnswerInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>; // The name of the input field
  errorMessage?: string; // Optional error message
}

const OpenAnswerInput = <T extends FieldValues>({
  register,
  name,
  errorMessage,
}: OpenAnswerInputProps<T>) => {
  return (
    <BaseInput
      register={register}
      name={name}
      label="Open Answer"
      errorMessage={errorMessage}
      type="textarea" // Set type to textarea
      rows={4} // Set the number of rows for the textarea
      placeholder="Enter your answer here"
    />
  );
};

export default OpenAnswerInput;
