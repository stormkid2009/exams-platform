import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "src/store/auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Client-side route guard for authenticated pages.
 *
 * Renders `null` until Zustand persist has rehydrated from localStorage, then
 * redirects unauthenticated visitors to `/user/login`. This avoids the
 * first-paint flash-redirect caused by reading `isAuthenticated` before
 * hydration finishes.
 *
 * @param props.children - The protected page content.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [hydrated, setHydrated] = useState(
    // `persist` is undefined during SSR because localStorage is unavailable;
    // in that case the page renders nothing until the client takes over.
    () => useAuthStore.persist?.hasHydrated() ?? false
  );

  useEffect(() => {
    const persist = useAuthStore.persist;

    // No persist API means no localStorage (SSR); let the redirect effect run.
    if (!persist) {
      setHydrated(true);
      return;
    }

    const unsubscribe = persist.onFinishHydration(() => setHydrated(true));
    // Hydration may already have completed before this effect ran.
    setHydrated(persist.hasHydrated());
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      void router.replace("/user/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default AuthGuard;
