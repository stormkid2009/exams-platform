import { useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "src/store/auth-store";
import Link from "next/link";
import fetcher from "src/utils/fetcher";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetcher<{ user: any; token: string }>(
        { email, password },
        "/api/auth/login"
      );

      if (response.error || !response.data) {
        throw new Error(response.error || "Login failed");
      }

      // Update auth store
      login(response.data.user, response.data.token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    handleLogin();
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

        <div className="mb-6">
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don not have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:text-blue-700">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
