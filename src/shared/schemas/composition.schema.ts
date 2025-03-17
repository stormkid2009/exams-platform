import { z } from "zod";

/**
 * Zod schema for validating Composition form data.
 *
 * Ensures that:
 * - content is a non-empty string.
 * - a is a non-empty string.
 * - b is a non-empty string.
 * - answer is a non-empty string.
 */
export const compositionSchema = z.object({
  content: z.string().min(1, "Content must be a non-empty string"),
  a: z.string().min(1, "Answer must be a non-empty string"),
  b: z.string().min(1, "Answer must be a non-empty string"),
  answer: z.string().min(1, "Answer must be a non-empty string"),
});

/**
 * Type alias for Composition form data inferred from the schema.
 *
 * This type is used to ensure type safety in handlers and services that work with
 * Composition form data.
 */
export type CompositionFormData = z.infer<typeof compositionSchema>;
