import { z } from "zod";

const answerEnum = z.enum(["a", "b", "c", "d", "e"], {
  errorMap: () => ({ message: "Answer must be one of: a, b, c, d, or e" })
});

const createOptionSchema = (option: string) => 
  z.string().min(1, `Option ${option.toUpperCase()} cannot be empty`);

export const situationSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  a: createOptionSchema('a'),
  b: createOptionSchema('b'),
  c: createOptionSchema('c'),
  d: createOptionSchema('d'),
  e: createOptionSchema('e'),
  rightAnswers: z.tuple([answerEnum, answerEnum])
    .refine(
      (answers) => new Set(answers).size === answers.length,
      "Duplicate correct answers are not allowed"
    )
});

export type SituationFormData = z.infer<typeof situationSchema>;