/**
 * NavigateBtn Component
 *
 * A button component which navigates to a specified route when clicked.
 * It leverages Next.js's useRouter hook for client-side navigation.
 *
 * @component
 * @param {object} props - Component properties.
 * @param {string} props.path - The target route to navigate to.
 * @param {React.ReactNode} props.children - The content inside the button.
 * @param {string} [props.color="blue"] - The color name used to style the button (tailwindcss classes).
 *
 * @example
 * // Navigate to the "about" page
 * <NavigateBtn path="/about" color="green">
 *   Go to About
 * </NavigateBtn>
 */

import React from "react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface NavigateBtnProps {
  path: string;
  children: ReactNode;
  color?: string;
}

export const NavigateBtn = ({
  path,
  children,
  color = "blue",
}: NavigateBtnProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(path)}
      className={`bg-${color}-500 text-white px-4 py-2 rounded hover:bg-${color}-600 transition-colors`}
    >
      {children}
    </button>
  );
};
