import React, { useState } from "react";
import { useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "src/components/ui/Toast";
import ContentInput from "src/components/inputs/contentInput";
import OptionInput from "src/components/inputs/optionInput";
import OpenAnswerInput from "src/components/inputs/openAnswerInput";
import {
  openEndedSchema,
  type OpenEndedFormData,
} from "src/shared/schemas/openEnded.schema";

interface Props {
  handleSubmit: (data: OpenEndedFormData) => void;
}

const OpenEndedForm: React.FC<Props> = ({ handleSubmit }) => {
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    reset,
  } = useForm<OpenEndedFormData>({
    resolver: zodResolver(openEndedSchema),
    defaultValues: {
      a: "", // Initialize each option field
      b: "",
      answer: "",
    },
  });

  const onSubmit = async (data: OpenEndedFormData) => {
    
    try {
      // Call the handleSubmit with the modified data
      await handleSubmit(data);
      //console.log(data);
      setToast({ type: "success", text: "Question created successfully!" });
      reset();
    } catch (error) {
      setToast({
        type: "error",
        text: "Failed to create question. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 overflow-y-auto max-h-[calc(100vh-2rem)]">
      <h2 className="text-xl font-bold text-center mb-6">
        Create Grammar Question
      </h2>

      {toast && (
        <Toast
          message={toast.text}
          type={toast.type}
          onDismiss={() => setToast(null)}
          duration={3000}
        />
      )}

      <form onSubmit={formSubmit(onSubmit)} className="space-y-4">
        {/* Content Input */}
        <ContentInput<OpenEndedFormData>
          register={register}
          name="content"
          label="Question Content"
          placeholder="Enter question content"
          errorMessage={errors.content?.message}
        />

        {/* Option Inputs */}
        {['a', 'b'].map((option,index) => (
          <OptionInput<OpenEndedFormData>
            key={index}
            register={register}
            name={`${option}` as Path<OpenEndedFormData>}
            label={`Option:  ${option}`} 
            errorMessage={
              errors[`options.${index}` as keyof typeof errors]?.message
            } // Use type assertion
          />
        ))}

        {/* Answer Input */}
        <OpenAnswerInput<OpenEndedFormData>
  register={register}
  name="answer"
  errorMessage={errors.answer?.message}
/>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Question
          </button>
        </div>
      </form>
      
    </div>
  );
};

export default OpenEndedForm;
