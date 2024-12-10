import { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const url = "http://localhost:3000/api/auth/login";
      const reqOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      };
      const response = await fetch(url, reqOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      // Handle successful login here
      console.log("Login successful:", data);
      // You might want to store the token or redirect the user
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
          <h2 className="text-xl font-bold mb-4">Login</h2>
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

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
