import { z } from "zod";

export const authSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Registration schema: same as login plus the password strength policy.
 * Kept separate so existing accounts with older passwords can still log in.
 */
export const registerSchema = authSchema.extend({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

/**
 * Client-only registration schema: adds the confirm-password field that the
 * API does not need. The password policy is shared with `registerSchema`.
 */
export const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords you entered don't match. Please try again",
    path: ["confirmPassword"],
  });

export type AuthFormData = z.infer<typeof authSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

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
