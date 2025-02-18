import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "src/components/ui/Toast";
import RelatedQuestionForm from "./relatedQuestionForm"; // Import the new component
import ContentInput from "src/components/inputs/contentInput";
import { passageSchema, type PassageFormData } from "src/shared/schemas/passage.schema";

interface Props {
  handleSubmit: (data: PassageFormData) => void;
}

const PassageForm: React.FC<Props> = ({ handleSubmit }) => {
  const [toast, setToast] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const {
    register,
    handleSubmit: formSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PassageFormData>({
    resolver: zodResolver(passageSchema),
    defaultValues: {
      passage: "",
      relatedQuestions: [
        {
          content: "",
          a: "",
          b: "",
          c: "",
          d: "",
          rightAnswer: "a",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "relatedQuestions",
  });

  const onSubmit = async (data: PassageFormData) => {
    try {
      await handleSubmit(data);
      console.log(data);
      setToast({ type: 'success', text: 'Passage questions created successfully!' });
      reset();
    } catch (error) {
      setToast({ type: 'error', text: 'Failed to create passage questions. Please try again.' });
    }
  };

  const addQuestion = () => {
    append({
      content: "",
      a: "",
      b: "",
      c: "",
      d: "",
      rightAnswer: "a",
    });
  };

  const removeQuestion = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Side Navigation */}
      <div className="w-64 bg-white shadow-md p-4 h-screen-minus-2rem overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Questions</h3>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <button
              key={field.id}
              onClick={() => removeQuestion(index)}
              className="w-full text-left p-2 rounded hover:bg-gray-100"
            >
              Question {index + 1}
            </button>
          ))}
          <button
            onClick={addQuestion}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Add Question
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-2rem)]">
        <h2 className="text-2xl font-bold text-center mb-6">Create Passage Questions</h2>
        <form onSubmit={formSubmit(onSubmit)} className="space-y-6">
          {/* Passage Text */}
          <ContentInput
            register={register}
            name="passage"
            label="Passage Text"
            placeholder="Enter the passage text here..."
            errorMessage={errors.passage?.message}
          />

          {/* Related Questions */}
          {fields.map((field, index) => (
            <RelatedQuestionForm
              key={field.id}
              index={index}
              onRemove={() => removeQuestion(index)}
            />
          ))}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Passage Questions
            </button>
          </div>
        </form>

        {/* Toast Notification */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.text}
            onDismiss={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PassageForm;