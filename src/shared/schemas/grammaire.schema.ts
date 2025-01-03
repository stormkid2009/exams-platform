import { z } from "zod";

export const grammaireSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  "options.0": z.string().min(1, "Option 1 cannot be empty"),
  "options.1": z.string().min(1, "Option 2 cannot be empty"),
  "options.2": z.string().min(1, "Option 3 cannot be empty"),
  "options.3": z.string().min(1, "Option 4 cannot be empty"),
  rightAnswer: z
    .number()
    .int()
    .min(0, "Right answer index must be 0 or greater")
    .max(3, "Right answer index must be 3 or less"),
});

export type GrammaireFormData = z.infer<typeof grammaireSchema>;