import { z } from "zod";
import { createOptionSchema } from "./option";

/**
 * Zod schema for validating Situation form data.
 *
 * The schema validates that:
 * - 'content' is a non-empty string.
 * - Options 'a', 'b', 'c', 'd', and 'e' are non-empty strings.
 * - 'firstAnswer' is one of the valid options: "a", "b", "c", "d", or "e".
 * - 'secondAnswer' is one of the valid options: "a", "b", "c", "d", or "e".
 *
 * Additionally, it applies a custom refinement to ensure that the first and second answers are not the same.
 */
export const situationSchema = z
  .object({
    content: z.string().min(1, "Content cannot be empty"),
    a: createOptionSchema("a"),
    b: createOptionSchema("b"),
    c: createOptionSchema("c"),
    d: createOptionSchema("d"),
    e: createOptionSchema("e"),
    firstAnswer: z.enum(["a", "b", "c", "d", "e"], {
      errorMap: () => ({
        message: "First answer must be one of: a, b, c, d, or e",
      }),
    }),
    secondAnswer: z.enum(["a", "b", "c", "d", "e"], {
      errorMap: () => ({
        message: "Second answer must be one of: a, b, c, d, or e",
      }),
    }),
  })
  .refine((data) => data.firstAnswer !== data.secondAnswer, {
    message: "First and second answers cannot be the same",
    path: ["secondAnswer"], // Points to the secondAnswer field for error display.
  });

/**
 * Type alias for Situation form data inferred from the situationSchema.
 *
 * This type ensures type safety when handling Situation form submissions in various parts of the application.
 */
export type SituationFormData = z.infer<typeof situationSchema>;
