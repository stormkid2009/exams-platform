
import React from "react";
import { UseFormRegister } from "react-hook-form";

interface OptionInputProps {
    register: UseFormRegister<any>;
    index: number;
    errorMessage?: string;
}

const OptionInput: React.FC<OptionInputProps> = ({
    register,
    index,
    errorMessage,
  }) => {
    return (
      <div className="flex items-center gap-4">
        <label className="w-1/4">Option {index + 1}</label>
        <div className="w-3/4">
          <input
            {...register(`options.${index}`)}
            className="w-full p-2 border rounded"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>
      </div>
    );
  };
  
  export default OptionInput;