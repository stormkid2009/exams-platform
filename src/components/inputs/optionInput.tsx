import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import BaseInput from './baseInput';

interface OptionInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>; // Use Path<T> for type safety
  label: string;
  errorMessage?: string;
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
    />
  );
};

export default React.memo(OptionInput) as typeof OptionInput;