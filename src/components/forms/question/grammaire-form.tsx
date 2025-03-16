import React, { useState } from "react";
import { useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "src/components/ui/toast";
import ContentInput from "src/components/inputs/content-input";
import OptionInput from "src/components/inputs/option-input";
import AnswerInput from "src/components/inputs/answer-input";
import HomeBtn from "src/components/buttons/home";
import {
  grammaireSchema,
  type GrammaireFormData,
} from "src/shared/schemas/grammaire.schema";
/**
 * GrammaireForm Component
 * 
 * This component renders a form for creating a grammar question. 
 * It includes inputs for the question content, options, and the correct answer.
 * 
 * Props:
 * - handleSubmit (function): A callback function that is called with the form data 
 *   when the form is submitted successfully.
 * 
 * The form includes:
 * - ContentInput for the question content.
 * - OptionInput for four options (a, b, c, d).
 * - AnswerInput for the correct answer.
 * - A submit button to create the question and a Home button for navigation.
 */
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
      a: "",
      b: "",
      c: "",
      d: "",
      rightAnswer: "a",
    },
  });

  const onSubmit = async (data: GrammaireFormData) => {
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
    <div className="max-w-2xl mx-auto p-6 overflow-y-auto max-h-[calc(100vh-2rem)]">
      <h2 className="text-2xl font-bold text-center mb-6">Grammar Question</h2>

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
        <div className="bg-white p-4 rounded-lg shadow">
          <ContentInput<GrammaireFormData>
            register={register}
            name="content"
            label="Question Content"
            placeholder="Enter question content"
            errorMessage={errors.content?.message}
          />
        </div>

        {/* Option Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["a", "b", "c", "d"].map((option, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <OptionInput<GrammaireFormData>
                register={register}
                name={`${option}` as Path<GrammaireFormData>}
                label={option.toUpperCase()}
                errorMessage={
                  errors[`options.${index}` as keyof typeof errors]?.message
                }
              />
            </div>
          ))}
        </div>

        {/* Answer Input */}
        <div className="bg-white p-4 rounded-lg shadow">
          <AnswerInput<GrammaireFormData>
            register={register}
            name="rightAnswer"
            errorMessage={errors.rightAnswer?.message}
            maxOptions={4}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <HomeBtn />
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

export default GrammaireForm;
