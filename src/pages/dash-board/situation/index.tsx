import React from "react";
import SituationForm from "src/components/forms/question/situation-form";
import { AuthGuard } from "src/components/auth-guard";
import { useQuestionCreate } from "src/hooks/use-question-create";
import { type SituationFormData } from "src/shared/schemas/situation.schema";

/**
 * Dashboard page for the Situation questions category.
 */
export default function SituationDashboard() {
  const handleSubmit = useQuestionCreate<SituationFormData>(
    "/api/questions/situation/new"
  );

  return (
    <AuthGuard>
      <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
        <SituationForm handleSubmit={handleSubmit} />
      </div>
    </AuthGuard>
  );
}
