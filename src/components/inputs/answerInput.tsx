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
  // Generate dynamic options for the dropdown list with alphabetic labels
  const options = Array.from({ length: maxOptions }, (_, index) => ({
    value: (index + 1).toString(), // Values start from 1
    label: String.fromCharCode(65 + index), // Labels start from "A" (ASCII 65)
  }));

  return (
    <BaseInput
      register={register}
      name={name}
      label="Correct Answer" // Set the label to "Correct Answer"
      errorMessage={errorMessage}
      type="select" // Use "select" type for dropdown list
      options={options} // Pass the dynamic options
      registerOptions={{ valueAsNumber: true }} // Convert the value to a number
    />
  );
};

export default React.memo(AnswerInput) as typeof AnswerInput;