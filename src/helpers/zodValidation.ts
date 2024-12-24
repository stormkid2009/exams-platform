// src/helpers/zodValidation.ts
import { z } from "zod";

// Define all your validation schemas here
export const grammaireSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  options: z
    .array(z.string().min(1))
    .length(4, "Must provide exactly 4 options")
    .refine(
      (options) => options.every((opt) => opt.trim().length > 0),
      "All options must be non-empty strings"
    ),
  rightAnswer: z
    .number()
    .int()
    .min(0, "Right answer index must be 0 or greater")
    .max(3, "Right answer index must be 3 or less"),
});

export const situationSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  options: z
    .array(z.string().min(1))
    .length(5, "Must provide exactly 5 options"),
  rightAnswers: z
    .array(z.number().int().min(0).max(4))
    .length(2, "Must provide exactly 2 right answer indices"),
});

// Export type for use in handlers
export type GrammaireRequest = z.infer<typeof grammaireSchema>;
export type SituationRequest = z.infer<typeof situationSchema>;
