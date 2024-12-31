import { z } from "zod";

// Define the Zod schema for the request body
export const PassageSchema = z.object({
  passage: z.string().min(1, "Passage must be a non-empty string"),
  relatedQuestions: z
    .array(
      z.object({
        content: z.string().min(1, "Content must be a non-empty string"),
        options: z.tuple([
          z.string().min(1, "Option 1 cannot be empty"),
          z.string().min(1, "Option 2 cannot be empty"),
          z.string().min(1, "Option 3 cannot be empty"),
          z.string().min(1, "Option 4 cannot be empty"),
        ]),
        rightAnswer: z
          .number()
          .int("Right answer must be an integer")
          .min(0, "Right answer index must be 0 or greater")
          .max(3, "Right answer index must be 3 or less"),
      })
    )
    .nonempty("Related questions must not be empty"),
});

// Export type for use in handlers
export type PassageRequestBody = z.infer<typeof PassageSchema>;