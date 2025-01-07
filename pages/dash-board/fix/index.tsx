
import React from "react";
import XForm from "src/components/forms/fix/xForm";
import fetcher from "src/helpers/fetcher";
import { type XFormData } from "src/shared/schemas/fix.schema";

export default function DashBoard() {
  const path = `/api/questions/category/grammaire`;

  const handleSubmit = async (formData: XFormData) => {
    try {
      // Transform form data to match the API's expected format
      const questionData = {
        content: formData.content,
        options: [
          formData.a, // Access nested paths
          formData.b,
          formData.c,
          formData.d,
        ] as [string, string, string, string], // Ensure it's a tuple
        rightAnswer: formData.rightAnswer,
      };
      console.log(questionData);
      //const response = await fetcher(questionData, path);

    } catch (error) {
      console.error("Error creating question:", error);
      throw error; // Propagate error to form
    }
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
      <XForm handleSubmit={handleSubmit} />
    </div>
  );
}