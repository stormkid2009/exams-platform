import React from "react";
import CompositionForm from "src/components/forms/question/composition-form";
import { AuthGuard } from "src/components/auth-guard";
import { useQuestionCreate } from "src/hooks/use-question-create";
import { type CompositionFormData } from "src/shared/schemas/composition.schema";

/**
 * Dashboard page for the Composition questions category.
 */
export default function CompositionDashboard() {
  const handleSubmit = useQuestionCreate<CompositionFormData>(
    "/api/questions/composition/new"
  );

  return (
    <AuthGuard>
      <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
        <CompositionForm handleSubmit={handleSubmit} />
      </div>
    </AuthGuard>
  );
}
