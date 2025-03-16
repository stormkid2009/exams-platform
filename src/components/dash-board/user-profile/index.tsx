import React from "react";

/**
 * UserProfile Component
 * 
 * This component displays the user's email and provides a logout button.
 * It accepts the following props:
 * 
 * Props:
 * - email (string): The email address of the user.
 * - onLogout (function): A callback function that is called when the logout button is clicked.
 */

interface UserProfileProps {
  email: string;
  onLogout: () => void;
}

export const UserProfile = ({ email, onLogout }: UserProfileProps) => (
  <div className="flex items-center">
    <span className="mr-4">{email}</span>
    <button
      onClick={onLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  </div>
);