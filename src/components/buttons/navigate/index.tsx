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
  color = "blue" 
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