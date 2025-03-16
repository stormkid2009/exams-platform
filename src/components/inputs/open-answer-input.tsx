import React from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import BaseInput from "./base-input"; // Import the BaseInput component
/**
 * OpenAnswerInput Component
 * 
 * This component renders a textarea input for users to provide an open-ended answer. 
 * It integrates with react-hook-form for form handling.
 * 
 * Props:
 * - register (function): The register function from react-hook-form for input registration.
 * - name (string): The name of the input field.
 * - errorMessage (string, optional): An optional error message to display below the input.
 * 
 * The component uses the BaseInput component to render the textarea with a default label "Open Answer" 
 * and a placeholder for user guidance.
 */

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
