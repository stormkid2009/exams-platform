import React, { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "src/components/ui/Toast";
import RelatedQuestionForm from "./related-question-form";
import ContentInput from "src/components/inputs/content-input";
import {
  passageSchema,
  type PassageFormData,
} from "src/shared/schemas/passage.schema";

interface Props {
  handleSubmit: (data: PassageFormData) => void;
}

const PassageForm: React.FC<Props> = ({ handleSubmit }) => {
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const methods = useForm<PassageFormData>({
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

  const { control, reset } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "relatedQuestions",
  });

  const onSubmit = async (data: PassageFormData) => {
    try {
      await handleSubmit(data);
      console.log(data);
      setToast({
        type: "success",
        text: "Passage questions created successfully!",
      });
      reset();
    } catch (error) {
      setToast({
        type: "error",
        text: "Failed to create passage questions. Please try again.",
      });
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
    <div className="flex gap-4">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Questions</h3>
        <div className="space-y-2 mb-4">
          {fields.map((field, index) => (
            <button
              key={field.id}
              onClick={() => removeQuestion(index)}
              className="w-full text-left px-3 py-2 border rounded hover:bg-gray-100"
            >
              Question {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={addQuestion}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Add Question
        </button>
      </div>

      {/* Main Form */}
      <div className="flex-1">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <ContentInput
                register={methods.register}
                name="passage"
                label="Passage Text"
                placeholder="Enter the passage text here..."
                errorMessage={methods.formState.errors.passage?.message}
              />
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-white p-6 shadow-lg rounded-lg"
                >
                  <RelatedQuestionForm
                    index={index}
                    onRemove={() => removeQuestion(index)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
              >
                Create Passage Questions
              </button>
            </div>
          </form>
        </FormProvider>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4">
          <Toast
            type={toast.type}
            message={toast.text}
            onDismiss={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
};

export default PassageForm;
