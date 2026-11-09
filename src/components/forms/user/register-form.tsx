import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "src/store/auth-store";
import fetcher from "src/utils/fetcher";
import {
  registerFormSchema,
  type RegisterFormValues,
  type UserResponse,
} from "src/shared/schemas/auth.schema";

interface RegisterResponse {
  token: string;
  user: UserResponse;
}

/**
 * RegisterForm Component
 *
 * Renders a react-hook-form registration form validated by the shared
 * `registerSchema` plus a confirm-password rule. On success it stores the
 * token/user in Zustand and redirects to the dashboard.
 */
function RegisterForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setApiError("");

    try {
      const response = await fetcher<RegisterResponse>(
        { email: values.email, password: values.password },
        "/api/auth/register"
      );

      if (response.error || !response.data) {
        // Map HTTP status codes to user-friendly messages.
        switch (response.status) {
          case 409:
            throw new Error(
              "This email is already registered. Please try signing in instead"
            );
          case 400:
            throw new Error(
              response.error || "Please check your email and password"
            );
          case 500:
            throw new Error(
              "We're experiencing technical difficulties. Please try again later"
            );
          default:
            throw new Error(
              response.error ||
                "Unable to create your account. Please try again"
            );
        }
      }

      login(response.data.user, response.data.token);
      await router.push("/dash-board");
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "We encountered an unexpected error. Please try again later"
      );
    }
  });

  return (
    <div className="h-full flex flex-col items-center border-2 p-4 m-4">
      <form onSubmit={onSubmit} className="w-full max-w-md" noValidate>
        <div className="p-2 m-4 text-center">
          {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="user-email" className="block mb-2">
            Email
          </label>
          <input
            id="user-email"
            type="email"
            placeholder="username@example.com"
            aria-label="user-email"
            className="w-full p-2 border rounded"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="user-password" className="block mb-2">
            Password
          </label>
          <input
            id="user-password"
            type="password"
            placeholder="Enter your password"
            aria-label="user-password"
            className="w-full p-2 border rounded"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="confirm-password" className="block mb-2">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            aria-label="confirm-password"
            className="w-full p-2 border rounded"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/user/login" className="text-blue-500 hover:text-blue-700">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
