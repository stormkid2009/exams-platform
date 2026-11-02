import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Registration schema: same as login plus the password strength policy.
 * Kept separate so existing accounts with older passwords can still log in.
 */
export const registerSchema = authSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type AuthFormData = z.infer<typeof authSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;

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

