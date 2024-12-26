import {z} from "zod";

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
export type SituationRequest = z.infer<typeof situationSchema>;

// Export type for use in situationForm
export type SituationFormData = z.infer<typeof situationSchema>;