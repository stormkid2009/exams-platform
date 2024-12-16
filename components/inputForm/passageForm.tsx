import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "../ui/Toast";

// Validation schema for each question
const questionSchema = z.object({
  content: z.string().min(1, "Question content is required"),
  options: z.array(z.string().min(1, "Option is required")).length(4, "Exactly 4 options are required"),
  rightAnswer: z.number()
    .int()
    .min(0, "Answer index must be between 0 and 3")
    .max(3, "Answer index must be between 0 and 3"),
});

// Validation schema for the entire form
const passageSchema = z.object({
  passage: z.string().min(1, "Passage text is required"),
  relatedQuestions: z.array(questionSchema).min(1, "At least one question is required"),
});

type PassageFormData = z.infer<typeof passageSchema>;

interface Props {
  handleSubmit: (data: PassageFormData) => void;
}

const PassageForm: React.FC<Props> = ({ handleSubmit }) => {
  const [toast, setToast] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const {
    register,
    handleSubmit: formSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<PassageFormData>({
    resolver: zodResolver(passageSchema),
    defaultValues: {
      passage: "",
      relatedQuestions: [
        {
          content: "",
          options: ["", "", "", ""],
          rightAnswer: 0
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "relatedQuestions"
  });

  const onSubmit = async (data: PassageFormData) => {
    try {
      await handleSubmit(data);
      setToast({ type: 'success', text: 'Passage questions created successfully!' });
      reset();
    } catch (error) {
      setToast({ type: 'error', text: 'Failed to create passage questions. Please try again.' });
    }
  };

  const addQuestion = () => {
    append({
      content: "",
      options: ["", "", "", ""],
      rightAnswer: 0
    });
    setActiveQuestionIndex(fields.length); // Switch to the new question
  };

  const removeQuestion = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      setActiveQuestionIndex(Math.min(activeQuestionIndex, fields.length - 2));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Side Navigation */}
      <div className="w-64 bg-white shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">Questions</h3>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <button
              key={field.id}
              onClick={() => setActiveQuestionIndex(index)}
              className={`w-full text-left p-2 rounded ${
                activeQuestionIndex === index
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
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
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Create Passage Questions</h2>
        <form onSubmit={formSubmit(onSubmit)} className="space-y-6">
          {/* Passage Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passage Text
            </label>
            <textarea
              {...register("passage")}
              className="w-full h-40 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the passage text here..."
            />
            {errors.passage && (
              <p className="mt-1 text-sm text-red-600">{errors.passage.message}</p>
            )}
          </div>

          {/* Active Question Form */}
          {fields[activeQuestionIndex] && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Question {activeQuestionIndex + 1}</h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(activeQuestionIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Question
                  </button>
                )}
              </div>

              {/* Question Content */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text
                </label>
                <textarea
                  {...register(`relatedQuestions.${activeQuestionIndex}.content`)}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your question here..."
                />
                {errors.relatedQuestions?.[activeQuestionIndex]?.content && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.relatedQuestions[activeQuestionIndex]?.content?.message}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Options</label>
                {[0, 1, 2, 3].map((optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      {...register(`relatedQuestions.${activeQuestionIndex}.rightAnswer`)}
                      value={optionIndex}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <input
                      type="text"
                      {...register(`relatedQuestions.${activeQuestionIndex}.options.${optionIndex}`)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="flex-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
                {errors.relatedQuestions?.[activeQuestionIndex]?.options && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.relatedQuestions[activeQuestionIndex]?.options?.message}
                  </p>
                )}
              </div>
            </div>
          )}

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
            text={toast.text}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PassageForm;
