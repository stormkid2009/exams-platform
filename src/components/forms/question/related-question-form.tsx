import React from "react";
import { useFormContext, Path } from "react-hook-form";
import ContentInput from "src/components/inputs/content-input";
import OptionInput from "src/components/inputs/option-input";
import AnswerInput from "src/components/inputs/answer-input";
import { PassageFormData } from "src/shared/schemas/passage.schema";

interface RelatedQuestionProps {
  index: number;
  onRemove: () => void;
}

const RelatedQuestionForm: React.FC<RelatedQuestionProps> = ({
  index,
  onRemove,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<PassageFormData>();

  // Define the type for relatedQuestionErrors
  type RelatedQuestionError = {
    content?: { message: string };
    a?: { message: string };
    b?: { message: string };
    c?: { message: string };
    d?: { message: string };
    rightAnswer?: { message: string };
  };

  // Safely cast errors.relatedQuestions?.[index] to the correct type
  const relatedQuestionErrors = errors.relatedQuestions?.[index] as
    | RelatedQuestionError
    | undefined;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      {/* Header with Remove Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Question {index + 1}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="bg-red-500 text-white p-2  rounded hover:text-red-700"
        >
          - Remove Question
        </button>
      </div>

      {/* Content Input */}
      <ContentInput
        register={register}
        name={`relatedQuestions.${index}.content` as Path<PassageFormData>}
        label="Question Text"
        placeholder="Enter your question here..."
        errorMessage={relatedQuestionErrors?.content?.message}
      />

      {/* Option Inputs */}
      {["a", "b", "c", "d"].map((option) => {
        // Explicitly type `option` as a key of `RelatedQuestionError`
        const optionKey = option as keyof Omit<
          RelatedQuestionError,
          "content" | "rightAnswer"
        >;

        return (
          <OptionInput
            key={option}
            register={register}
            name={
              `relatedQuestions.${index}.${option}` as Path<PassageFormData>
            }
            label={`Option ${option.toUpperCase()}`}
            placeholder={`Enter option ${option.toUpperCase()}`}
            errorMessage={relatedQuestionErrors?.[optionKey]?.message}
          />
        );
      })}

      {/* Answer Input */}
      <AnswerInput
        register={register}
        name={`relatedQuestions.${index}.rightAnswer` as Path<PassageFormData>}
        errorMessage={relatedQuestionErrors?.rightAnswer?.message}
        maxOptions={4} // 4 options (A, B, C, D)
      />
    </div>
  );
};

export default RelatedQuestionForm;
