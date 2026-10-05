import { z } from "zod";
import { grammaireDocSchema } from "./grammaire.document";
import { situationDocSchema } from "./situation.document";
import { compositionDocSchema } from "./composition.document";
import { passageDocSchema } from "./passage.document";

/**
 * Canonical question type constants.
 *
 * Replaces the manual `QuestionTypes` const from `src/types/questions.ts`.
 */
export const QuestionTypes = {
  MCQ: "MCQ",
  MULTI_MCQ: "Multi-MCQ",
  OPEN_ENDED: "Open-Ended",
  RC: "RC",
} as const;

/**
 * Union type of all question type string literals.
 */
export type QuestionType = (typeof QuestionTypes)[keyof typeof QuestionTypes];

/**
 * Discriminated union of all document schemas, keyed on the `type` field.
 *
 * Use this when you need to parse or type-check any question document
 * without knowing its specific type ahead of time.
 */
export const questionDocSchema = z.discriminatedUnion("type", [
  grammaireDocSchema,
  situationDocSchema,
  compositionDocSchema,
  passageDocSchema,
]);

/**
 * Union type for any question document.
 */
export type QuestionDoc = z.infer<typeof questionDocSchema>;
