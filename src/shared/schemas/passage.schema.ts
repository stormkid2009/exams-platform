import { z } from "zod";
import { grammaireSchema } from "./grammaire.schema";

/**
 * Zod schema for validating Passage form data.
 *
 * Ensures that:
 * - passage is a non-empty string.
 * - relatedQuestions is a non-empty array of objects conforming to the grammaireSchema.
 */
export const passageSchema = z.object({
  passage: z.string().min(1, "Passage must be a non-empty string"),
  relatedQuestions: z
    .array(grammaireSchema)
    .nonempty("Related questions must not be empty"),
});

/**
 * Type alias for Passage form data inferred from the passageSchema.
 *
 * This type is used to provide type safety in handlers and services
 * when processing Passage form submissions.
 */
export type PassageFormData = z.infer<typeof passageSchema>;
