import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import BaseInput from './baseInput';

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