import React from "react";
import CompositionForm from "src/components/forms/question/composition-form";
import fetcher from "src/utils/fetcher";
import { type CompositionFormData } from "src/shared/schemas/composition.schema";

/**
 * Dashboard component for managing composition questions.
 *
 * This component renders a form for creating or managing a composition question.
 * When the form is submitted, it sends the data to the API endpoint at `/api/questions/category/composition`.
 *
 * @returns {JSX.Element} The rendered Dashboard component.
 */
export default function DashBoard() {
  const path = `/api/questions/composition/new`;

  /**
   * Handle form submission for creating a composition question.
   *
   * This function transforms the form data to match the API's expected format and makes
   * a request to the API endpoint using a custom fetcher utility. In case of an error,
   * it logs the error details and propagates the error.
   *
   * @param {CompositionFormData} formData - The form data submitted by the user.
   * @returns {Promise<void>} A promise that resolves when the API call is complete.
   */
  const handleSubmit = async (formData: CompositionFormData): Promise<void> => {
    try {
      // Transform form data to match the API's expected format
      const questionData = {
        ...formData,
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
      <CompositionForm handleSubmit={handleSubmit} />
    </div>
  );
}
