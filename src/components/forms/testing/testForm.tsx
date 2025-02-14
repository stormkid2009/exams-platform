import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import AnswerInput from "src/components/inputs/answerInput";

export type FormData = {
  answer1: string;
  answer2: string;
};

interface Props {
  handleSubmit: (data: FormData) => Promise<void> | void;
}

const TestForm: React.FC<Props> = ({ handleSubmit }) => {
  const {
    register,
    handleSubmit: handleFormSubmitHook,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      answer1: "",
      answer2: "",
    },
  });

  const answerOptions = useMemo(
    () => [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
      { value: 'c', label: 'Option C' },
      { value: 'd', label: 'Option D' },
    ],
    []
  );

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // console.log(data);
      await handleSubmit(data);
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 overflow-y-auto max-h-[calc(100vh-2rem)]">
      <h2 className="text-xl font-bold text-center mb-6">
        Create content test
      </h2>

      <form onSubmit={handleFormSubmitHook(handleFormSubmit)} className="space-y-4">
        {(['answer1', 'answer2'] as const).map((answerField) => (
          <AnswerInput
            key={answerField}
            register={register}
            name={answerField}
            errorMessage={errors[answerField]?.message}
            maxOptions={4}
            options={answerOptions}
            label={`Answer ${answerField.slice(-1)}`}
          />
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Create Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(TestForm);