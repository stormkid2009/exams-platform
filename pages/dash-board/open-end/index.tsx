import React from "react";
import OpenEndedForm from "src/components/forms/question/open-end";
import fetcher from "src/helpers/fetcher";
import { type OpenEndedFormData } from "src/shared/schemas/openEnded.schema";

export default function DashBoard() {
  const path = `/api/questions/category/openEnded`;

  const handleSubmit = async (formData: OpenEndedFormData) => {
    try {
      // Transform form data to match the API's expected format
      const questionData = {
        content: formData.content,
        a: formData.a,
        b: formData.b,
        answer: formData.answer,
      };
      const response = await fetcher(questionData, path);
      // console.log(response);
      // console.log(questionData);
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
      <OpenEndedForm handleSubmit={handleSubmit} />
    </div>
  );
}
