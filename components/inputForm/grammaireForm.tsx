import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "../ui/Toast";
import ContentInput from '../inputs/contentInput';
import OptionInput from '../inputs/optionInput';
import AnswerInput from '../inputs/answerInput';

// we duplication in grammaireSchema as we defined it in zodValidation for api validation
// we need to take alook on types as we duplicate the types of questions after we used zod which can do the job
//what we have to do : clean the mess up and focus on using zod for cleaner code  
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
        <ContentInput
          register={register}
          name="content"
          label="Question Content"
          placeholder="Enter question content"
          errorMessage={errors.content?.message}
        />

{[0, 1, 2, 3].map((index) => (
  <OptionInput
    key={index}
    register={register}
    index={index}
    errorMessage={errors.options?.[index]?.message}
  />
))}

<AnswerInput
  register={register}
  errorMessage={errors.rightAnswer?.message}
/>

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
