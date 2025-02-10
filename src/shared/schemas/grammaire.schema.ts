import { z } from "zod";

const createOptionSchema = (option: string) => 
  z.string().min(1, `Option ${option.toUpperCase()} cannot be empty`);

export const grammaireSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  a: createOptionSchema('a'),
  b: createOptionSchema('b'),
  c: createOptionSchema('c'),
  d: createOptionSchema('d'),
  rightAnswer: z.enum(["a", "b", "c", "d"], {
    errorMap: () => ({ message: "Right answer is one of a, b, c or d" })
  })
});

export type GrammaireFormData = z.infer<typeof grammaireSchema>;