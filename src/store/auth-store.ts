import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Interface representing a user.
 */
interface User {
  id: string;
  email: string;
}

/**
 * Interface representing the authentication state.
 */
interface AuthState {
  /**
   * The current authenticated user or null if not authenticated.
   */
  user: User | null;

  /**
   * The authentication token or null if not authenticated.
   */
  token: string | null;

  /**
   * Boolean indicating if the user is authenticated.
   */
  isAuthenticated: boolean;

  /**
   * Function to log in a user by setting the user, token, and authentication status.
   *
   * @param user - The user object.
   * @param token - The authentication token.
   */
  login: (user: User, token: string) => void;

  /**
   * Function to log out a user by clearing the user, token, and authentication status.
   */
  logout: () => void;
}

/**
 * AuthStore using Zustand with persistence middleware.
 *
 * This store holds the authentication state including the user information,
 * token, and provides actions to log in and log out. The state is persisted
 * in local storage under the key 'auth-storage'.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
