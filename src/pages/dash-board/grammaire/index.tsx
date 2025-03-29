import React from "react";
import GrammaireForm from "src/components/forms/question/grammaire-form";
import fetcher from "src/utils/fetcher";
import { type GrammaireFormData } from "src/shared/schemas/grammaire.schema";

/**
 * DashBoard page for the Grammaire questions category.
 *
 * This component renders a GrammaireForm and handles form submissions by
 * sending the form data to the API endpoint for creating Grammaire questions.
 */
export default function DashBoard() {
  const path = `/api/questions/grammaire/new`;

  /**
   * Handles the form submission by transforming the form data and sending
   * it to the API endpoint.
   *
   * @param formData - The data from the Grammaire form.
   * @returns A promise resolving to the API response.
   * @throws Rethrows error from API call for further handling.
   */
  const handleSubmit = async (formData: GrammaireFormData) => {
    try {
      // Transform form data to match the API's expected format
      const questionData = {
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
      <GrammaireForm handleSubmit={handleSubmit} />
    </div>
  );
}
