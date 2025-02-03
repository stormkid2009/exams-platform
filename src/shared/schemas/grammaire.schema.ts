import { z } from "zod";

export const grammaireSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  a: z.string().min(1, "Option A cannot be empty"),
  b: z.string().min(1, "Option B cannot be empty"),
  c: z.string().min(1, "Option C cannot be empty"),
  d: z.string().min(1, "Option D cannot be empty"),
  rightAnswer: z.enum(["a", "b", "c", "d"], {
    errorMap: () => ({ message: "Right answer is one of a, b, c or d" })
  })
});

export type GrammaireFormData = z.infer<typeof grammaireSchema>;