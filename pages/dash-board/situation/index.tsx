import React from 'react'
import SituationForm from "components/inputForm/situationForm"
import { SituationQuestion } from "src/types";
import fetcher from 'src/lib/helpers/fetcher';
import { randomUUID } from 'crypto';

export default function DashBoard() {
  const path = `/api/questions/category/situation`;
  
  const handleSubmit = async (formData: { content: string; options: string[]; rightAnswers: number[] }) => {
    try {
      // Transform form data to match the API's expected format
      const questionData: SituationQuestion = {
        id: randomUUID(),
        type: "Multi-MCQ",
        content: formData.content,
        options: formData.options as [string, string, string, string, string],
        rightAnswers: formData.rightAnswers as [number, number]
      };

      await fetcher(questionData, path);
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  return (
    <div>
      <SituationForm handleSubmit={handleSubmit} />
    </div>
  );
}