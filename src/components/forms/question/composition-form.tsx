import React, { useState } from "react";
import { useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "src/components/ui/Toast";
import ContentInput from "src/components/inputs/content-input";
import OptionInput from "src/components/inputs/option-input";
import OpenAnswerInput from "src/components/inputs/open-answer-input";
import {
  compositionSchema,
  type CompositionFormData,
} from "src/shared/schemas/composition.schema";

interface Props {
  handleSubmit: (data: CompositionFormData) => void;
}

const CompositionForm: React.FC<Props> = ({ handleSubmit }) => {
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    reset,
  } = useForm<CompositionFormData>({
    resolver: zodResolver(compositionSchema),
    defaultValues: {
      a: "",
      b: "",
      answer: "",
    },
  });

  const onSubmit = async (data: CompositionFormData) => {
    try {
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
        Composition Question
      </h2>

      {toast && (
        <Toast
          message={toast.text}
          type={toast.type}
          onDismiss={() => setToast(null)}
          duration={3000}
        />
      )}

      <form onSubmit={formSubmit(onSubmit)} className="space-y-6">
        {/* Content Input */}
        <div className="bg-white p-4 rounded shadow">
          <ContentInput<CompositionFormData>
            register={register}
            name="content"
            label="Question Content"
            placeholder="Enter question content"
            errorMessage={errors.content?.message}
          />
        </div>

        {/* Option Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["a", "b"].map((option, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <OptionInput<CompositionFormData>
                register={register}
                name={`${option}` as Path<CompositionFormData>}
                label={option.toUpperCase()}
                errorMessage={
                  errors[`options.${index}` as keyof typeof errors]?.message
                }
              />
            </div>
          ))}
        </div>

        {/* Answer Input */}
        <div className="bg-white p-4 rounded shadow">
          <OpenAnswerInput<CompositionFormData>
            register={register}
            name="answer"
            errorMessage={errors.answer?.message}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Create Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompositionForm;
