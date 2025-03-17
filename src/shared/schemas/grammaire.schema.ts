import { z } from "zod";

/**
 * Helper function to create a Zod string schema for a given option.
 *
 * This function enforces that the option value is a non-empty string.
 *
 * @param option - The option identifier (e.g., 'a', 'b', etc.).
 * @returns A Zod string schema that validates the option is non-empty.
 */
const createOptionSchema = (option: string) =>
  z.string().min(1, `Option ${option.toUpperCase()} cannot be empty`);

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
