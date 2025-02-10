import { z } from "zod";

const createOptionSchema = (option: string) => 
  z.string().min(1, `Option ${option.toUpperCase()} cannot be empty`);

export const situationSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  a: createOptionSchema('a'),
  b: createOptionSchema('b'),
  c: createOptionSchema('c'),
  d: createOptionSchema('d'),
  e: createOptionSchema('e'),
  firstAnswer: z.enum(['a', 'b', 'c', 'd', 'e'], { 
    errorMap: () => ({ message: "First answer must be one of: a, b, c, d, or e" }) 
  }),
  secondAnswer: z.enum(['a', 'b', 'c', 'd', 'e'], { 
    errorMap: () => ({ message: "Second answer must be one of: a, b, c, d, or e" }) 
  })
}).refine(
  (data) => data.firstAnswer !== data.secondAnswer,
  { 
    message: "First and second answers cannot be the same",
    path: ["secondAnswer"] // This points to the field where the error should be shown
  }
);

export type SituationFormData = z.infer<typeof situationSchema>;