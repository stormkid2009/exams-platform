import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "../ui/Toast";
import { SituationQuestion } from "src/types";

// Validation schema
const situationSchema = z.object({
  content: z.string().min(1, "Question content is required"),
  options: z.array(z.string().min(1, "Option is required")).length(5, "Exactly 5 options are required"),
  rightAnswers: z.array(z.number()
    .int()
    .min(0, "Answer index must be between 0 and 4")
    .max(4, "Answer index must be between 0 and 4")
  ).length(2, "Exactly 2 correct answers are required")
});

type SituationFormData = z.infer<typeof situationSchema>;

interface Props {
  handleSubmit: (data: SituationFormData) => void;
}

const SituationForm: React.FC<Props> = ({ handleSubmit }) => {
  const [toast, setToast] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    reset
  } = useForm<SituationFormData>({
    resolver: zodResolver(situationSchema),
    defaultValues: {
      options: ['', '', '', '', ''], // Initialize empty options array
      rightAnswers: [0, 1] // Default right answers
    }
  });

  const onSubmit = async (data: SituationFormData) => {
    try {
      await handleSubmit(data);
      setToast({ type: 'success', text: 'Question created successfully!' });
      reset();
    } catch (error) {
      setToast({ type: 'error', text: 'Failed to create question. Please try again.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 overflow-y-auto max-h-[calc(100vh-2rem)]">
      <h2 className="text-xl font-bold text-center mb-6">Create Situation Question</h2>
      
      {toast && (
        <Toast
          message={toast.text}
          type={toast.type}
          onDismiss={() => setToast(null)}
          duration={3000}
        />
      )}
      
      <form onSubmit={formSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="w-1/4">Question Content</label>
          <div className="w-3/4">
            <textarea
              {...register("content")}
              className="w-full p-2 border rounded"
              rows={3}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>
        </div>

        {[0, 1, 2, 3, 4].map((index) => (
          <div key={index} className="flex items-center gap-4">
            <label className="w-1/4">Option {index + 1}</label>
            <div className="w-3/4">
              <input
                {...register(`options.${index}`)}
                className="w-full p-2 border rounded"
              />
              {errors.options?.[index] && (
                <p className="text-red-500 text-sm">
                  {errors.options[index]?.message}
                </p>
              )}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-4">
          <label className="w-1/4">Correct Answer Indices (0-4)</label>
          <div className="w-3/4 flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                {...register("rightAnswers.0", { valueAsNumber: true })}
                className="w-full p-2 border rounded"
                min={0}
                max={4}
                placeholder="First correct answer"
              />
              {errors.rightAnswers?.[0] && (
                <p className="text-red-500 text-sm">{errors.rightAnswers[0].message}</p>
              )}
            </div>
            <div className="flex-1">
              <input
                type="number"
                {...register("rightAnswers.1", { valueAsNumber: true })}
                className="w-full p-2 border rounded"
                min={0}
                max={4}
                placeholder="Second correct answer"
              />
              {errors.rightAnswers?.[1] && (
                <p className="text-red-500 text-sm">{errors.rightAnswers[1].message}</p>
              )}
            </div>
          </div>
        </div>

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

export default SituationForm;
