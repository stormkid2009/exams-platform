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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <h1 className="text-3xl font-bold">Create Passage Questions</h1>
      </header>

      <div className="flex flex-1">
        {/* Side Navigation */}
        <aside className="w-64 bg-white shadow p-4 space-y-4 overflow-y-auto">
          <h3 className="text-xl font-semibold border-b pb-2">Questions</h3>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <button
                key={field.id}
                onClick={() => removeQuestion(index)}
                className="w-full text-left px-3 py-2 border rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Question {index + 1}
              </button>
            ))}
          </div>
          <div className="border-t pt-4">
            <button
              onClick={addQuestion}
              className="w-full px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              + Add Question
            </button>
          </div>
        </aside>

        {/* Main Form */}
        <main className="flex-1 p-8 overflow-y-auto">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Passage Text */}
              <div className="bg-white p-6 shadow rounded">
                <ContentInput
                  register={methods.register}
                  name="passage"
                  label="Passage Text"
                  placeholder="Enter the passage text here..."
                  errorMessage={methods.formState.errors.passage?.message}
                />
              </div>

              {/* Related Questions */}
              <div className="space-y-8">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="bg-white p-6 shadow rounded border"
                  >
                    <RelatedQuestionForm
                      index={index}
                      onRemove={() => removeQuestion(index)}
                    />
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Passage Questions
                </button>
              </div>
            </form>
          </FormProvider>
        </main>
      </div>

      {/* Toast Notification */}
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
