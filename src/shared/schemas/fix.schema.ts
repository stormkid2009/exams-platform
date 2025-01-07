
import { z } from "zod";

export const fixSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  a: z.string().min(1, "Option 1 cannot be empty"),
  b: z.string().min(1, "Option 2 cannot be empty"),
  c: z.string().min(1, "Option 3 cannot be empty"),
  d: z.string().min(1, "Option 4 cannot be empty"),
  rightAnswer: z
    .string()
    .min(1, "Right answer is one of a, b, c or d")
});

export type XFormData = z.infer<typeof fixSchema>;