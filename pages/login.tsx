import LoginForm from "../components/loginForm";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "../src/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard"); // or wherever you want to redirect authenticated users
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}