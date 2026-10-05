import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type AuthFormData = z.infer<typeof authSchema>;
