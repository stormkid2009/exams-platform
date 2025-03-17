import RegisterForm from "src/components/forms/user/register-form";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "src/store/auth-store";

/**
 * RegisterPage component renders the user registration page.
 *
 * This component displays a registration form for creating a new account.
 * If a user is already authenticated, it redirects them to the dashboard page.
 *
 * @returns {JSX.Element} The rendered registration page component.
 */
export default function RegisterPage() {
  // Initialize Next.js router for navigation.
  const router = useRouter();

  // Extract authentication status from the global auth store.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  /**
   * Redirect authenticated users to the dashboard.
   *
   * This effect runs whenever the authentication status changes.
   * If the user is logged in, it navigates them away from the registration page.
   */
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dash-board"); // Redirect authenticated users to the dashboard.
    }
  }, [isAuthenticated, router]);

  /**
   * Render the registration form in a responsive container.
   *
   * The container styles ensure that the form is centered on the screen
   * with appropriate spacing for different device sizes.
   */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
