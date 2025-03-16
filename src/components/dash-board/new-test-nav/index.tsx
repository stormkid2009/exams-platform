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
    <div className="flex space-x-4 mt-4">
      <button
        onClick={() => router.push("/dash-board/generate-exam")}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Generate New Exam
      </button>
      <button
        onClick={() => router.push("/dash-board/exam-history")}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Exam History
      </button>
    </div>
  );
};
