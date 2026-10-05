import React from "react";
import { useRouter } from "next/router";

/**
 * NewTestNav Component
 *
 * This component renders a navigation bar with buttons for generating a new exam
 * and viewing exam history. It utilizes Next.js's router to navigate between pages.
 *
 * Buttons:
 * - "Generate New Exam": Navigates to the "/dash-board/generate-exam" page.
 * - "Exam History": Navigates to the "/dash-board/exam-history" page.
 */
export const NewTestNav = () => {
  const router = useRouter();

  return (
    <div className="flex space-x-4 mt-4 text-gray-500 italic">
      {/* 
        Exam generation and history pages are not yet implemented.
        Hiding these buttons to prevent 404 errors.
      */}
      <p>Exam features coming soon...</p>
    </div>
  );
};
