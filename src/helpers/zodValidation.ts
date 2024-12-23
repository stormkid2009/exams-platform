
// src/helpers/zodValidation.ts
import { z } from 'zod';

// Define all your validation schemas here
export const grammaireSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  options: z.array(z.string().min(1))
    .length(4, "Must provide exactly 4 options")
    .refine(
      (options) => options.every(opt => opt.trim().length > 0),
      "All options must be non-empty strings"
    ),
  rightAnswer: z.number()
    .int()
    .min(0, "Right answer index must be 0 or greater")
    .max(3, "Right answer index must be 3 or less")
});

// Export type for use in handlers
export type GrammaireRequest = z.infer<typeof grammaireSchema>;