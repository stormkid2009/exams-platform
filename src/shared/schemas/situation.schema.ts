import { z } from "zod";

// Define all your validation schemas here
export const situationSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  options: z.tuple([
    z.string().min(1, "Option 1 cannot be empty"),
    z.string().min(1, "Option 2 cannot be empty"),
    z.string().min(1, "Option 3 cannot be empty"),
    z.string().min(1, "Option 4 cannot be empty"),
    z.string().min(1, "Option 5 cannot be empty"),
  ]),
  rightAnswers: z.tuple([
    z.number().int().min(0, "Right answer index must be 0 or greater").max(4, "Right answer index must be 4 or less"),
    z.number().int().min(0, "Right answer index must be 0 or greater").max(4, "Right answer index must be 4 or less"),
  ]),
});

// Export type for use in handlers
export type SituationRequest = z.infer<typeof situationSchema>;

// Export type for use in situationForm
export type SituationFormData = z.infer<typeof situationSchema>;