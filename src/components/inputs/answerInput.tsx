import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import BaseInput from './baseInput';

interface AnswerInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>; // Use Path<T> instead of string
  label: string;
  errorMessage?: string;
  maxOptions: number;
}

const AnswerInput = <T extends FieldValues>({
  register,
  name,
  label,
  errorMessage,
  maxOptions,
}: AnswerInputProps<T>) => {
  return (
    <BaseInput
      register={register}
      name={name} // Pass name of type Path<T>
      label={label}
      errorMessage={errorMessage}
      type="number"
      min={1}
      max={maxOptions}
      onChange={(e) => {
        const value = parseInt(e.target.value, 10);
        e.target.value = (value - 1).toString();
      }}
    />
  );
};

export default React.memo(AnswerInput) as typeof AnswerInput;