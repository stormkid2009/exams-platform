
import { z } from "zod";

// Define the Zod schema for the request body
export const openEndedSchema = z.object({
  content: z.string().min(1, "Content must be a non-empty string"),
  a:z.string().min(1, "Answer must be a non-empty string"),
  b:z.string().min(1, "Answer must be a non-empty string"),
  answer: z.string().min(1, "Answer must be a non-empty string"),
});

// Export type for use in handlers
export type OpenEndedFormData = z.infer<typeof openEndedSchema>;