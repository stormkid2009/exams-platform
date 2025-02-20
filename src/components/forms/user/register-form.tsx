import { useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "src/store/auth-store";
import Link from "next/link";
import fetcher from "src/utils/fetcher";

interface RegisterResponse {
  user: any;
  token: string;
  message?: string;
}

function RegisterForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      // Client-side validation
      if (!email || !password || !confirmPassword) {
        throw new Error("Please fill in all required fields");
      }

      if (password !== confirmPassword) {
        throw new Error(
          "The passwords you entered don't match. Please try again"
        );
      }

      const response = await fetcher<RegisterResponse>(
        { email, password },
        "/api/auth/register"
      );

      if (response.error || !response.data) {
        // Map HTTP status codes to user-friendly messages
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

      // Update auth store
      login(response.data.user, response.data.token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("We encountered an unexpected error. Please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleRegister();
  }

  return (
    <div className="h-full flex flex-col items-center border-2 p-4 m-4">
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <div className="p-2 m-4 text-center">
          {error && <p className="text-red-500 mb-4">{error}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="user-email" className="block mb-2">
            Email
          </label>
          <input
            id="user-email"
            name="email"
            type="email"
            value={email}
            required
            placeholder="username@example.com"
            aria-label="user-email"
            className="w-full p-2 border rounded"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="user-password" className="block mb-2">
            Password
          </label>
          <input
            id="user-password"
            name="password"
            type="password"
            value={password}
            required
            placeholder="Enter your password"
            aria-label="user-password"
            className="w-full p-2 border rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirm-password" className="block mb-2">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            required
            placeholder="Confirm your password"
            aria-label="confirm-password"
            className="w-full p-2 border rounded"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-700">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
