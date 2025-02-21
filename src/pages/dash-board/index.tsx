import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "src/store/auth-store";

//user dashboard has 2 sections
//1. user profile
//2. user work area which contains two sections
//  a. user nav to create questions
//  b. user nav to exams generator

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
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
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to your Dashboard
            </h2>
            <p>You are logged in as {user.email}</p>
            <p className="mb-4">
              You can now create and manage your questions. Use the buttons below to navigate to different forms:
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push("/dash-board/grammaire")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Grammaire Form
              </button>
              <button
                onClick={() => router.push("/dash-board/situation")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Situation Form
              </button>
              <button
                onClick={() => router.push("/dash-board/passage")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Passage Form
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
