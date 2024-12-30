import React from "react";
import SituationForm from "src/components/forms/question/situationForm";
import fetcher from "src/helpers/fetcher";
import { type SituationFormData } from "src/shared/schemas/situation.schema"; 

export default function DashBoard() {
  const path = `/api/questions/category/situation`;

  const handleSubmit = async (formData: SituationFormData) => {
    try {
      // Transform form data to match the API's expected format
      const questionData: SituationFormData = {
        content: formData.content,
        options: formData.options as [string, string, string, string, string],
        rightAnswers: formData.rightAnswers as [number, number],
      };

      await fetcher(questionData, path);
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
      <SituationForm handleSubmit={handleSubmit} />
    </div>
  );
}
