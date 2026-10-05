import React from "react";
import GrammaireForm from "src/components/forms/question/grammaire-form";
import fetcher from "src/utils/fetcher";
import { type GrammaireFormData } from "src/shared/schemas/grammaire.schema";

import { submitQuestion } from "src/utils/submit-question";

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
    const questionData = { ...formData };
    await submitQuestion(path, questionData);
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
      <GrammaireForm handleSubmit={handleSubmit} />
    </div>
  );
}
