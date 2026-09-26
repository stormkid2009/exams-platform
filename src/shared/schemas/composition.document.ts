import { z } from "zod";

/**
 * Zod schema for validating Composition document data (DB shape).
 *
 * This represents the shape stored in MongoDB:
 * - type: literal "Open-Ended"
 * - content: non-empty string
 * - elements: tuple of exactly 2 strings
 * - answer: non-empty string
 */
export const compositionDocSchema = z.object({
  type: z.literal("Open-Ended"),
  content: z.string().min(1),
  elements: z.tuple([z.string(), z.string()]),
  answer: z.string().min(1),
});

/**
 * Type alias for Composition document data inferred from the schema.
 */
export type CompositionDoc = z.infer<typeof compositionDocSchema>;
