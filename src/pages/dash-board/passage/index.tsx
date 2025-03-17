import React from "react";
import PassageForm from "src/components/forms/question/passage-form";
import { type PassageFormData } from "src/shared/schemas/passage.schema";
import fetcher from "src/utils/fetcher";

/**
 * DashBoard page for the Passage questions category.
 *
 * This component renders a PassageForm and handles form submissions by sending
 * the form data to the API endpoint responsible for creating Passage questions.
 */
export default function DashBoard() {
  // API endpoint path for Passage questions
  const path = `/api/questions/category/passage`;

  /**
   * Handles the form submission.
   *
   * Sends the form data to the API endpoint and logs the response or error.
   *
   * @param data - The data submitted from the PassageForm.
   * @returns A promise resolving to the API response.
   */
  const handleSubmit = async (data: PassageFormData) => {
    try {
      const response = await fetcher(data, path);
      console.log("Passage question created successfully:", response);
    } catch (error) {
      console.error("Error creating passage question:", error);
    }
  };

  // Render the PassageForm component and pass the handleSubmit function as a prop
  return <PassageForm handleSubmit={handleSubmit} />;
}
