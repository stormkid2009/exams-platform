import React from 'react'
import GrammaireForm from 'components/inputForm/grammaireForm';
import fetcher from 'src/lib/helpers/fetcher';
import { GrammaireQuestion } from 'src/types';
import { randomUUID } from 'crypto';

// Type for form data
type GrammaireFormData = {
  content: string;
  options: string[];
  rightAnswer: number;
};

export default function DashBoard() {
  const path = `/api/questions/category/grammaire`;

  const handleSubmit = async (formData: GrammaireFormData) => {
    try {
      // Transform form data to match the API's expected format
      const questionData: GrammaireQuestion = {
        id: randomUUID(),
        type: "MCQ",
        content: formData.content,
        options: formData.options as [string, string, string, string],
        rightAnswers: [formData.rightAnswer]
      };

      const response = await fetcher(questionData, path);
      console.log('Question created successfully:', response);
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
      <GrammaireForm handleSubmit={handleSubmit}/>
    </div>
  );
}