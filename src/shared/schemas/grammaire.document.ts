import { z } from "zod";

/**
 * Zod schema for validating Grammaire document data (DB shape).
 *
 * This represents the shape stored in MongoDB:
 * - type: literal "MCQ"
 * - content: non-empty string
 * - options: tuple of exactly 4 strings
 * - rightAnswer: tuple of exactly 1 string (the answer key)
 */
export const grammaireDocSchema = z.object({
  type: z.literal("MCQ"),
  content: z.string().min(1),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  rightAnswer: z.tuple([z.string()]),
});

/**
 * Type alias for Grammaire document data inferred from the schema.
 */
export type GrammaireDoc = z.infer<typeof grammaireDocSchema>;
