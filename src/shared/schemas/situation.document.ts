import { z } from "zod";

/**
 * Zod schema for validating Situation document data (DB shape).
 *
 * This represents the shape stored in MongoDB:
 * - type: literal "Multi-MCQ"
 * - content: non-empty string
 * - options: tuple of exactly 5 strings
 * - rightAnswer: tuple of exactly 2 strings (the answer keys)
 */
export const situationDocSchema = z.object({
  type: z.literal("Multi-MCQ"),
  content: z.string().min(1),
  options: z.tuple([z.string(), z.string(), z.string(), z.string(), z.string()]),
  rightAnswer: z.tuple([z.string(), z.string()]),
});

/**
 * Type alias for Situation document data inferred from the schema.
 */
export type SituationDoc = z.infer<typeof situationDocSchema>;
