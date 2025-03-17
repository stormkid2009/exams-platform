import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "src/store/auth-store";
import { UserProfile } from "src/components/dash-board/user-profile";
import { NewQuestionNav } from "src/components/dash-board/new-question-nav";
import { NewTestNav } from "src/components/dash-board/new-test-nav";

/**
 * Dashboard component.
 *
 * This component renders a dashboard view for authenticated users.
 * It handles redirection when the user is not authenticated and
 * displays sections for question and exam management.
 *
 * @returns {JSX.Element | null} The dashboard view or null if the user is not authenticated.
 */
export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Redirect unauthenticated users to the login page.
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/user/login");
    }
  }, [isAuthenticated, router]);

  /**
   * Handles the logout action.
   *
   * This method logs out the user and redirects them to the login page.
   */
  const handleLogout = () => {
    logout();
    router.push("/user/login");
  };

  // Prevent rendering if user data is not available.
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dash board</h1>
            </div>
            <UserProfile email={user.email} onLogout={handleLogout} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Question Management</h2>
              <p className="mb-4">
                Create and manage different types of questions:
              </p>
              <NewQuestionNav />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Exam Management</h2>
              <p className="mb-4">Create and manage your exams:</p>
              <NewTestNav />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
