import type { ReactElement } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "src/store/auth-store";
import { AuthGuard } from "src/components/auth-guard";
import { UserProfile } from "src/components/dash-board/user-profile";
import { NewQuestionNav } from "src/components/dash-board/new-question-nav";
import { NewTestNav } from "src/components/dash-board/new-test-nav";

/**
 * Dashboard component.
 *
 * Renders the authenticated dashboard and relies on {@link AuthGuard} for
 * redirects and persist hydration, rather than a first-paint `useEffect`
 * redirect.
 */
export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  /** Logs the user out and returns them to the login page. */
  const handleLogout = () => {
    logout();
    router.push("/user/login");
  };

  return (
    <AuthGuard>
      {user ? (
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
                  <h2 className="text-2xl font-bold mb-4">
                    Question Management
                  </h2>
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
      ) : null}
    </AuthGuard>
  );
}

/**
 * Bare layout: the dashboard renders its own full-height shell.
 *
 * @param page - The rendered dashboard page.
 * @returns The page without the shared header/footer chrome.
 */
Dashboard.getLayout = (page: ReactElement) => page;
