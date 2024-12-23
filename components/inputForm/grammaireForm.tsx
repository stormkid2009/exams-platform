import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "../ui/Toast";

// Validation schema
const grammaireSchema = z.object({
  content: z.string().min(1, "Question content is required"),
  options: z.array(z.string().min(1, "Option is required")).length(4, "Exactly 4 options are required"),
  rightAnswer: z.number()
    .int()
    .min(0, "Answer index must be between 0 and 3")
    .max(3, "Answer index must be between 0 and 3"),
});

type GrammaireFormData = z.infer<typeof grammaireSchema>;

interface Props {
  handleSubmit: (data: GrammaireFormData) => void;
}

const GrammaireForm: React.FC<Props> = ({ handleSubmit }) => {
  const [toast, setToast] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    reset
  } = useForm<GrammaireFormData>({
    resolver: zodResolver(grammaireSchema),
    defaultValues: {
      options: ['', '', '', ''], // Initialize empty options array
      rightAnswer: 0
    }
  });

  const onSubmit = async (data: GrammaireFormData) => {
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
      <h2 className="text-xl font-bold text-center mb-6">Create Grammar Question</h2>
      
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

        {[0, 1, 2, 3].map((index) => (
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
          <label className="w-1/4">Correct Answer Index (0-3)</label>
          <div className="w-3/4">
            <input
              type="number"
              {...register("rightAnswer", { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              min={0}
              max={3}
            />
            {errors.rightAnswer && (
              <p className="text-red-500 text-sm">{errors.rightAnswer.message}</p>
            )}
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

export default GrammaireForm;
