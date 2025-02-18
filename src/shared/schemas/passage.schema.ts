import { z } from "zod";
import { grammaireSchema } from "./grammaire.schema";
// Define the Zod schema for the request body
export const passageSchema = z.object({
  passage: z.string().min(1, "Passage must be a non-empty string"),
  relatedQuestions: z
    .array(
      grammaireSchema
    )
    .nonempty("Related questions must not be empty"),
});

// Export type for use in handlers
export type PassageFormData = z.infer<typeof passageSchema>;