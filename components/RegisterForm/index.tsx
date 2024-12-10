import { useState } from "react";

function RegisterForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      // Client-side validation
      if (!email || !password || !confirmPassword) {
        throw new Error("All fields are required");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Handle successful registration
      console.log("Registration successful:", data);
      // You might want to:
      // 1. Store the token in localStorage
      localStorage.setItem("token", data.token);
      // 2. Redirect to dashboard/home
      // 3. Update global auth state if you're using any state management

    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
          <h2 className="text-xl font-bold mb-4">Register</h2>
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
          <a href="/login" className="text-blue-500 hover:text-blue-700">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
