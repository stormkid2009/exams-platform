import React from "react";
import SituationForm from "src/components/forms/question/situation-form";
import fetcher from "src/utils/fetcher";
import { type SituationFormData } from "src/shared/schemas/situation.schema";

/**
 * DashBoard page for the Situation questions category.
 *
 * This component renders the SituationForm and handles form submissions by sending
 * the submitted data to the API endpoint for creating Situation questions.
 */
export default function DashBoard() {
  // API endpoint for Situation questions.
  const path = `/api/questions/category/situation`;

  /**
   * Handles the form submission by preparing data and sending it to the API.
   *
   * The function receives data from the SituationForm, prepares it as needed,
   * and then calls the API using the fetcher utility. It logs the API response
   * on success or logs detailed error information if the submission fails.
   *
   * @param {SituationFormData} formData - The form data submitted from the SituationForm.
   * @returns {Promise<void>} A Promise that resolves to the API response.
   * @throws Propagates any errors encountered during the API call.
   */
  const handleSubmit = async (formData: SituationFormData) => {
    try {
      // Copy form data into a new object; transformation logic can be added here if needed.
      const questionData: SituationFormData = {
        ...formData,
      };
      // Call the API endpoint with the prepared question data.
      const response = await fetcher(questionData, path);
      console.log(response);
    } catch (error: unknown) {
      console.error("Error creating question:", error);
      if (error instanceof Error) {
        // Log the error message if the error is an instance of Error.
        console.error("Error message:", error.message);
      }
      if (error && typeof error === "object" && "response" in error) {
        // Log the detailed API response error if available.
        console.error("API Response:", (error as any).response.data);
      }
      // Propagate the error to allow further handling (e.g., display feedback in the form).
      throw error;
    }
  };

  /**
   * Renders the SituationForm component within a scrollable container.
   *
   * The container styling ensures that the form is viewable on various screen sizes.
   */
  return (
    <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
      <SituationForm handleSubmit={handleSubmit} />
    </div>
  );
}
