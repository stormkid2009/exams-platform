
import { z } from "zod";

// Define the Zod schema for the request body
export const OpenEndedSchema = z.object({
  content: z.string().min(1, "Content must be a non-empty string"),
  elements: z
    .array(z.string().min(1, "Each element must be a non-empty string"))
    .nonempty("Elements must not be empty"),
  answer: z.string().min(1, "Answer must be a non-empty string"),
});

// Export type for use in handlers
export type OpenEndedRequestBody = z.infer<typeof OpenEndedSchema>;