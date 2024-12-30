import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface AnswerInputProps {
  register: UseFormRegister<any>; // Adjust the type as needed
  name: string;
  errorMessage?: string;
}

const AnswerInput: React.FC<AnswerInputProps> = ({
  register,
  name, // Ensure name is destructured
  errorMessage,
}) => {
  return (
    <div className="flex items-center gap-4">
      <label className="w-1/4">Correct Answer Index (0-4)</label>
      <div className="w-3/4">
        <input
          type="number"
          {...register(name,{valueAsNumber: true})} // Correctly register the input with the name prop
          className="w-full p-2 border rounded"
          min={0}
          max={4}
        />
        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default AnswerInput;