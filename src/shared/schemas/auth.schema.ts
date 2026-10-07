import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type AuthFormData = z.infer<typeof authSchema>;

export const userResponseSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
});

export const authResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
  user: userResponseSchema,
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;

