import LoginForm from "src/components/forms/user/login-form";
import type { ReactElement } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "src/store/auth-store";

/**
 * LoginPage component renders the login page for the application.
 *
 * This component displays a login form and uses client-side authentication
 * logic. If a user is already authenticated, it redirects them to the dashboard.
 *
 * @returns {JSX.Element} The rendered login page component.
 */
export default function LoginPage() {
  // Initialize Next.js router for programmatic navigation.
  const router = useRouter();

  // Extract the authentication state from the global auth store.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  /**
   * Side effect to redirect authenticated users away from the login page.
   *
   * When the dependency 'isAuthenticated' changes and is true, the user is
   * redirected to the dashboard page.
   */
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dash-board"); // Redirect authenticated users to the dashboard.
    }
  }, [isAuthenticated, router]);

  /**
   * Render the login form within a styled container.
   *
   * The container is configured to center the login form on the screen with
   * responsive styling.
   */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}

/**
 * Bare layout: the login page renders its own full-screen container.
 *
 * @param page - The rendered login page.
 * @returns The page without the shared header/footer chrome.
 */
LoginPage.getLayout = (page: ReactElement) => page;
