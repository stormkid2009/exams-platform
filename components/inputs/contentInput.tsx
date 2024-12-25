
import React from "react";
import { UseFormRegister } from "react-hook-form";

interface ContentInputProps {
    name: string;
    register: UseFormRegister<any>;
    placeholder: string;
    label: string;
    errorMessage?: string;
    rows?: number;
}

const ContentInput: React.FC<ContentInputProps> = ({
    register,
    name,
    label,
    errorMessage,
    rows = 3,
  }) => {
    return (
      <div className="flex items-center gap-4">
        <label className="w-1/4">{label}</label>
        <div className="w-3/4">
          <textarea
            {...register(name)}
            className="w-full p-2 border rounded"
            rows={rows}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>
      </div>
    );
  };
  
  export default ContentInput;
