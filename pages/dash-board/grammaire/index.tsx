import React from "react";
import GrammaireForm from "src/components/forms/question/grammaireForm";
import fetcher from "src/helpers/fetcher";
import fetchData from "src/helpers/fetchData";
import { type GrammaireFormData } from "src/shared/schemas/grammaire.schema";

export default function DashBoard() {
  const path = `/api/questions/category/grammaire`;

  const handleSubmit = async (formData: GrammaireFormData) => {
    try {
      // Transform form data to match the API's expected format
      const questionData = {
        content: formData.content,
          a:formData.a, // Access nested paths
          b:formData.b,
          c:formData.c,
          d:formData.d,
        rightAnswer: formData.rightAnswer,
      };
      const response = await fetcher(questionData, path);
      console.log(response);
      // console.log(questionData);

    } catch (error: unknown) {
      console.error("Error creating question:", error);
      if (error instanceof Error) {
        // If error is an instance of Error, log the message
        console.error("Error message:", error.message);
      }
      if (error && typeof error === 'object' && 'response' in error) {
        console.error("API Response:", (error as any).response.data); // Log the error response from the API
      }
      throw error; // Propagate error to form
    }
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
      <GrammaireForm handleSubmit={handleSubmit} />
    </div>
  );
}