import { z } from "zod";

// Define all your validation schemas here
export const grammaireSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  options: z.tuple([
    z.string().min(1, "Option 1 cannot be empty"),
    z.string().min(1, "Option 2 cannot be empty"),
    z.string().min(1, "Option 3 cannot be empty"),
    z.string().min(1, "Option 4 cannot be empty"),
  ]),
    rightAnswer: z.number()
    .int()
    .min(0, "Right answer index must be 0 or greater")
    .max(3, "Right answer index must be 3 or less"),
});

// Export type for use in handlers
export type GrammaireRequest = z.infer<typeof grammaireSchema>;

// Export type for use in grammaireForm
export type GrammaireFormData = z.infer<typeof grammaireSchema>& {
  "options.0": string; // Explicitly define nested paths
  "options.1": string;
  "options.2": string;
  "options.3": string;
};