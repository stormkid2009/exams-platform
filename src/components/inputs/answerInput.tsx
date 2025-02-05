import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import BaseInput from './baseInput'; // Import the BaseInput component

interface AnswerInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>; // The name of the input field
  errorMessage?: string; // Optional error message
  maxOptions: number; // The maximum number of options (4 or 5)
}

const AnswerInput = <T extends FieldValues>({
  register,
  name,
  errorMessage,
  maxOptions,
}: AnswerInputProps<T>) => {
  const validatedMaxOptions = maxOptions === 5 ? 5 : 4;

  // Generate options based on validatedMaxOptions
  const options = Array.from({ length: validatedMaxOptions }, (_, index) => ({
    value: String.fromCharCode(97 + index), // Use 97 (ASCII for 'a') to get 'a', 'b', 'c', etc.
    label: String.fromCharCode(65 + index), // Labels are "A", "B", "C", "D", and "E" (if 5 options)
  }));

  return (
    <BaseInput
      register={register}
      name={name}
      label="Correct Answer" // Set the label to "Correct Answer"
      errorMessage={errorMessage}
      type="select" // Use "select" type for dropdown list
      options={options} // Pass the dynamic options
      registerOptions={{ required: true }}
    />
  );
};

export default React.memo(AnswerInput) as typeof AnswerInput;