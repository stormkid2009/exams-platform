import { z } from "zod";
import { grammaireDocSchema } from "./grammaire.document";

/**
 * Zod schema for validating Passage document data (DB shape).
 *
 * This represents the shape stored in MongoDB:
 * - type: literal "RC"
 * - passage: non-empty string
 * - relatedQuestions: non-empty array of GrammaireDoc objects
 */
export const passageDocSchema = z.object({
  type: z.literal("RC"),
  passage: z.string().min(1),
  relatedQuestions: z.array(grammaireDocSchema).nonempty(),
});

/**
 * Type alias for Passage document data inferred from the schema.
 */
export type PassageDoc = z.infer<typeof passageDocSchema>;
