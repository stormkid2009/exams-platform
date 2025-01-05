import React from "react";
import GrammaireForm from "src/components/forms/question/grammaireForm";
import fetcher from "src/helpers/fetcher";
import { type GrammaireFormData } from "src/shared/schemas/grammaire.schema";

export default function DashBoard() {
  const path = `/api/questions/category/grammaire`;

  const handleSubmit = async (formData: GrammaireFormData) => {
    try {
      // Transform form data to match the API's expected format
      const questionData = {
        content: formData.content,
        options: [
          formData["options.0"], // Access nested paths
          formData["options.1"],
          formData["options.2"],
          formData["options.3"],
        ] as [string, string, string, string], // Ensure it's a tuple
        rightAnswer: formData.rightAnswer,
      };
      const response = await fetcher(questionData, path);

    } catch (error) {
      console.error("Error creating question:", error);
      throw error; // Propagate error to form
    }
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
      <GrammaireForm handleSubmit={handleSubmit} />
    </div>
  );
}