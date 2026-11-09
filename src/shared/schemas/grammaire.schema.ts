import { z } from "zod";
import { createOptionSchema } from "./option";

/**
 * Zod schema for validating Grammaire form data.
 *
 * Validates that:
 * - content is a non-empty string.
 * - Options a, b, c, d are non-empty strings.
 * - rightAnswer is one of "a", "b", "c", or "d".
 */
export const grammaireSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  a: createOptionSchema("a"),
  b: createOptionSchema("b"),
  c: createOptionSchema("c"),
  d: createOptionSchema("d"),
  rightAnswer: z.enum(["a", "b", "c", "d"], {
    errorMap: () => ({ message: "Right answer is one of a, b, c or d" }),
  }),
});

/**
 * Type alias for Grammaire form data inferred from the grammaireSchema.
 *
 * This type is used to ensure type safety in components and services that handle
 * Grammaire form submissions.
 */
export type GrammaireFormData = z.infer<typeof grammaireSchema>;
