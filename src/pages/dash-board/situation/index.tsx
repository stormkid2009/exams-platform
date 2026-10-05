import React from "react";
import SituationForm from "src/components/forms/question/situation-form";
import fetcher from "src/utils/fetcher";
import { type SituationFormData } from "src/shared/schemas/situation.schema";

import { submitQuestion } from "src/utils/submit-question";

/**
 * DashBoard page for the Situation questions category.
 *
 * This component renders the SituationForm and handles form submissions by sending
 * the submitted data to the API endpoint for creating Situation questions.
 */
export default function DashBoard() {
  // API endpoint for Situation questions.
  const path = `/api/questions/situation/new`;

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
    const questionData: SituationFormData = { ...formData };
    await submitQuestion(path, questionData);
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
