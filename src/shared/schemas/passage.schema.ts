
import { z } from 'zod'; // Add this import

// Define the Zod schema for the request body
export const PassageSchema = z.object({
    passage: z.string().min(1, "Passage must be a non-empty string"),
    relatedQuestions: z.array(z.object({
        content: z.string().min(1, "Content must be a non-empty string"),
        options: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1), z.string().min(1)]),
        rightAnswer: z.number().int().min(0).max(3, "Right answer must be between 0 and 3")
    })).nonempty("Related questions must not be empty")
});

// Export type for use in handlers
export type PassageRequestBody = z.infer<typeof PassageSchema>;