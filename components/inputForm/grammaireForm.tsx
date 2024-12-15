import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schema
const grammaireSchema = z.object({
  content: z.string().min(1, "Question content is required"),
  opt1: z.string().min(1, "Option 1 is required"),
  opt2: z.string().min(1, "Option 2 is required"),
  opt3: z.string().min(1, "Option 3 is required"),
  opt4: z.string().min(1, "Option 4 is required"),
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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    reset
  } = useForm<GrammaireFormData>({
    resolver: zodResolver(grammaireSchema)
  });

  const onSubmit = async (data: GrammaireFormData) => {
    try {
      await handleSubmit(data);
      setMessage({ type: 'success', text: 'Question created successfully!' });
      reset(); // Reset form fields
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create question. Please try again.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold text-center mb-6">Create Grammar Question</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={formSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Question Content</label>
          <textarea
            {...register("content")}
            className="w-full p-2 border rounded"
            rows={3}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        {[1, 2, 3, 4].map((num) => (
          <div key={num}>
            <label className="block mb-1">Option {num}</label>
            <input
              {...register(`opt${num}` as keyof GrammaireFormData)}
              className="w-full p-2 border rounded"
            />
            {errors[`opt${num}` as keyof GrammaireFormData] && (
              <p className="text-red-500 text-sm">
                {errors[`opt${num}` as keyof GrammaireFormData]?.message}
              </p>
            )}
          </div>
        ))}

        <div>
          <label className="block mb-1">Correct Answer Index (0-3)</label>
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default GrammaireForm;
