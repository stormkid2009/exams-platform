import React from "react";
import PassageForm from "src/components/forms/question/passage-form";
import { AuthGuard } from "src/components/auth-guard";
import { useQuestionCreate } from "src/hooks/use-question-create";
import { type PassageFormData } from "src/shared/schemas/passage.schema";

/**
 * Dashboard page for the Passage questions category.
 */
export default function PassageDashboard() {
  const handleSubmit = useQuestionCreate<PassageFormData>(
    "/api/questions/passage/new"
  );

  return (
    <AuthGuard>
      <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
        <PassageForm handleSubmit={handleSubmit} />
      </div>
    </AuthGuard>
  );
}
