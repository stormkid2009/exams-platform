import React, { useState } from "react";
import { useForm ,Path} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "src/components/ui/Toast";
import { situationSchema , type SituationFormData} from 'src/shared/schemas/situation.schema';
import ContentInput from 'src/components/inputs/contentInput';
import OptionInput from 'src/components/inputs/optionInput';
import AnswerInput from 'src/components/inputs/answerInput';


const OPTIONS = ['a', 'b', 'c', 'd', 'e'] as const;
const ANSWER_COUNT = 2;

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
      content: '',
      a: '',
      b: '',
      c: '',
      d: '',
      e: '',
      rightAnswers: [] // Default right answers
    }
  });

  const onSubmit = async (data: SituationFormData) => {
    try {
      console.log(data);
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

{OPTIONS.map((option) => (
          <OptionInput<SituationFormData>
            key={option}
            register={register}
            label={option.toUpperCase()}
            name={option as Path<SituationFormData>}
            errorMessage={errors[option]?.message}
          />
        ))}



{Array.from({ length: ANSWER_COUNT }).map((_, index) => (
          <AnswerInput<SituationFormData>
            key={index}
            register={register}
            name={`rightAnswers.${index}` as Path<SituationFormData>}
            maxOptions={OPTIONS.length}
            errorMessage={errors.rightAnswers?.[index]?.message}
          />
        ))}

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
