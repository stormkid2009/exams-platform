import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "src/store/auth-store";
import fetcher from "src/utils/fetcher";
import {
  authSchema,
  type AuthFormData,
  type UserResponse,
} from "src/shared/schemas/auth.schema";

interface LoginResponse {
  token: string;
  user: UserResponse;
}

/**
 * LoginForm Component
 *
 * Renders a react-hook-form login form validated by the shared `authSchema`.
 * On success it stores the token/user in Zustand and redirects to the
 * dashboard. API/network failures are shown as a form-level error.
 */
function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setApiError("");

    try {
      const response = await fetcher<LoginResponse>(
        values,
        "/api/auth/login"
      );

      if (response.error || !response.data) {
        throw new Error(response.error || "Login failed");
      }

      login(response.data.user, response.data.token);
      await router.push("/dash-board");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Login failed");
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

        <div className="mb-6">
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Do not have an account?{" "}
          <Link
            href="/user/register"
            className="text-blue-500 hover:text-blue-700"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
