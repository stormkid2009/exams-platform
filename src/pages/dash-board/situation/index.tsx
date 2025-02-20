import React from "react";
import SituationForm from "src/components/forms/question/situation-form";
import fetcher from "src/utils/fetcher";
import { type SituationFormData } from "src/shared/schemas/situation.schema";

export default function DashBoard() {
  const path = `/api/questions/category/situation`;

  const handleSubmit = async (formData: SituationFormData) => {
    try {
      const questionData: SituationFormData = {
        ...formData,
      };
      const response = await fetcher(questionData, path);
      console.log(response);
    } catch (error: unknown) {
      console.error("Error creating question:", error);
      if (error instanceof Error) {
        // If error is an instance of Error, log the message
        console.error("Error message:", error.message);
      }
      if (error && typeof error === "object" && "response" in error) {
        console.error("API Response:", (error as any).response.data); // Log the error response from the API
      }
      throw error; // Propagate error to form
    }
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
      <SituationForm handleSubmit={handleSubmit} />
    </div>
  );
}
