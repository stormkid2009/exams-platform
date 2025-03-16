import React, { useState, useMemo } from "react";
import { useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "src/components/ui/toast";
import {
  situationSchema,
  type SituationFormData,
} from "src/shared/schemas/situation.schema";
import ContentInput from "src/components/inputs/content-input";
import OptionInput from "src/components/inputs/option-input";
import AnswerInput from "src/components/inputs/answer-input";
import HomeBtn from "src/components/buttons/home";

/**
 * SituationForm Component
 * 
 * This component renders a form for creating a situation question. 
 * It includes inputs for the question content, options, and the correct answers.
 * 
 * Props:
 * - handleSubmit (function): A callback function that is called with the form data 
 *   when the form is submitted successfully.
 * 
 * The form includes:
 * - ContentInput for the question content.
 * - OptionInput for five options (a, b, c, d, e).
 * - AnswerInput for two correct answers.
 * - A submit button to create the question and a Home button for navigation.
 */
const OPTIONS = ["a", "b", "c", "d", "e"] as const;
const ANSWERS = ["firstAnswer", "secondAnswer"];

interface Props {
  handleSubmit: (data: SituationFormData) => void;
}

const SituationForm: React.FC<Props> = ({ handleSubmit }) => {
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    reset,
  } = useForm<SituationFormData>({
    resolver: zodResolver(situationSchema),
    defaultValues: {
      content: "",
      a: "",
      b: "",
      c: "",
      d: "",
      e: "",
      firstAnswer: "a",
      secondAnswer: "b",
    },
  });

  const answerOptions = useMemo(
    () => [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B" },
      { value: "c", label: "Option C" },
      { value: "d", label: "Option D" },
      { value: "e", label: "Option E" },
    ],
    []
  );

  const onSubmit = async (data: SituationFormData) => {
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
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 shadow rounded overflow-y-auto max-h-[calc(100vh-2rem)]">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Situation Question
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
        <div className="bg-white p-4 rounded-lg shadow">
          <ContentInput
            register={register}
            placeholder="Enter question content"
            name="content"
            label="Content"
            errorMessage={errors.content?.message}
          />
        </div>

        {/* Options Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPTIONS.map((option) => (
            <div key={option} className="bg-white p-4 rounded-lg shadow">
              <OptionInput<SituationFormData>
                register={register}
                label={option.toUpperCase()}
                name={option as Path<SituationFormData>}
                errorMessage={errors[option]?.message}
              />
            </div>
          ))}
        </div>

        {/* Answer Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ANSWERS.map((answer) => (
            <div key={answer} className="bg-white p-4 rounded-lg shadow">
              <AnswerInput<SituationFormData>
                register={register}
                name={answer as Path<SituationFormData>}
                maxOptions={OPTIONS.length}
                options={answerOptions}
                errorMessage={
                  errors[answer as keyof SituationFormData]?.message
                }
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <HomeBtn />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded"
          >
            Create Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default SituationForm;
