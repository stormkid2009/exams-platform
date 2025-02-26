import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "src/store/auth-store";
import { UserProfile } from "src/components/dash-board/user-profile";
import { NewQuestionNav } from "src/components/dash-board/new-question-nav";
import { NewTestNav } from "src/components/dash-board/new-test-nav";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/user/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/user/login");
  };

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
              <h2 className="text-2xl font-bold mb-4">
                Question Management
              </h2>
              <p className="mb-4">
                Create and manage different types of questions:
              </p>
              <NewQuestionNav />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                Exam Management
              </h2>
              <p className="mb-4">
                Create and manage your exams:
              </p>
              <NewTestNav />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}