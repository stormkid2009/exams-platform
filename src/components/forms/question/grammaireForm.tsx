import React, { useState } from "react";
import { useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "src/components/ui/Toast";
import ContentInput from "src/components/inputs/contentInput";
import OptionInput from "src/components/inputs/optionInput";
import AnswerInput from "src/components/inputs/answerInput";
import {
  grammaireSchema,
  type GrammaireFormData,
} from "src/shared/schemas/grammaire.schema";

interface Props {
  handleSubmit: (data: GrammaireFormData) => void;
}

const GrammaireForm: React.FC<Props> = ({ handleSubmit }) => {
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    reset,
  } = useForm<GrammaireFormData>({
    resolver: zodResolver(grammaireSchema),
    defaultValues: {
      "options.0": "", // Initialize each option field
      "options.1": "",
      "options.2": "",
      "options.3": "",
      rightAnswer: 0,
    },
  });

  const onSubmit = async (data: GrammaireFormData) => {
    try {
      console.log("Form Data:", data); // Debug form data
    console.log("Form Errors:", errors); // Debug validation errors
      // Call the handleSubmit with the modified data
      await handleSubmit(data);

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
        <ContentInput<GrammaireFormData>
          register={register}
          name="content"
          label="Question Content"
          placeholder="Enter question content"
          errorMessage={errors.content?.message}
        />

        {/* Option Inputs */}
        {[0, 1, 2, 3].map((index) => (
  <OptionInput<GrammaireFormData>
    key={index}
    register={register}
    name={`options.${index}` as Path<GrammaireFormData>}
    label={`Option ${String.fromCharCode(65 + index)}`} // Use alphabetic labels
    errorMessage={errors[`options.${index}` as keyof typeof errors]?.message} // Use type assertion
  />
))}

        {/* Answer Input */}
        <AnswerInput<GrammaireFormData>
          register={register}
          name="rightAnswer"
          errorMessage={errors.rightAnswer?.message}
          maxOptions={4} // 4 options (A, B, C, D)
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

export default GrammaireForm;
