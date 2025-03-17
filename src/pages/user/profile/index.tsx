import React from "react";
import { useAuthStore } from "src/store/auth-store";

/**
 * ProfilePage component displays the user's profile information.
 *
 * This component retrieves the logged-in user's details from the authentication store
 * and renders the profile information such as email address. If no user is found,
 * it indicates that the user should be logged in.
 *
 * @returns {JSX.Element} The rendered user profile page component.
 */
export default function ProfilePage() {
  // Retrieve the currently authenticated user's details from the auth store.
  const user = useAuthStore((state) => state.user);

  // If no user is available, display a placeholder message.
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No profile information available. Please log in.</p>
      </div>
    );
  }

  // Render the user's profile details in a styled container.
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and application settings.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Email Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.email}
              </dd>
            </div>
            {/* Additional fields can be added here if needed */}
          </dl>
        </div>
      </div>
    </div>
  );
}
