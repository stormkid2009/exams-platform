import React from "react";
import GrammaireForm from "src/components/forms/question/grammaire-form";
import { AuthGuard } from "src/components/auth-guard";
import { useQuestionCreate } from "src/hooks/use-question-create";
import { type GrammaireFormData } from "src/shared/schemas/grammaire.schema";

/**
 * Dashboard page for the Grammaire questions category.
 */
export default function GrammaireDashboard() {
  const handleSubmit = useQuestionCreate<GrammaireFormData>(
    "/api/questions/grammaire/new"
  );

  return (
    <AuthGuard>
      <div className="overflow-y-auto max-h-[calc(100vh-2rem)]">
        <GrammaireForm handleSubmit={handleSubmit} />
      </div>
    </AuthGuard>
  );
}
