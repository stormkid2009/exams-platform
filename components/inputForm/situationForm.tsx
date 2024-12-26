import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "../ui/Toast";
import { situationSchema , type SituationFormData} from 'src/zodValidation/situationSchema';
import ContentInput from '../inputs/contentInput';
import OptionInput from '../inputs/optionInput';
import AnswerInput from '../inputs/answerInput';


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
        <ContentInput
          register={register}
          placeholder="Enter question content"
          name="content"
          label="Content"
          errorMessage={errors.content?.message}
        />

        {[0, 1, 2, 3, 4].map((index) => (
          <OptionInput
            register={register}
            key={index}
            index={index}
            errorMessage={errors.options?.[index]?.message}
          />
        ))}


        {
          [0, 1].map((index) => (
            <AnswerInput
              register={register}
              key={index}
              errorMessage={errors.rightAnswers?.[index]?.message}
            />
          ))
        }

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
