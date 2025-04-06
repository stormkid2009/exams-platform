'use client';
import React from 'react';
import { useExamContext } from 'src/pages/context';

interface AddToExamButtonProps {
  questionId?: string;
  questionType: string;
  questionContent: string;
}

export default function AddToExamButton({ questionId, questionType, questionContent }: AddToExamButtonProps) {
  const { addQuestion } = useExamContext();

  const handleAdd = () => {
    if (questionId && questionType && questionContent) {
      addQuestion({
        id: questionId,
        type: questionType,
        content: questionContent,
      });
    }
  };

  return (
    <button
      onClick={handleAdd}
      className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
    >
      Add to Exam
    </button>
  );
}

