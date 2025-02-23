
import { useRouter } from "next/router";

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