/**
 * HomeBtn Component
 *
 * This component renders a button that navigates the user back to the dashboard.
 * It uses Next.js's Link component to handle client-side navigation.
 *
 * @component
 * @example
 * return (
 *   <HomeBtn />
 * )
 */

import React from "react";
import Link from "next/link";

const HomeBtn: React.FC = () => {
  return (
    <Link href="/dash-board">
      <button className="bg-red-500 hover:bg-red-600 transition-colors text-white font-medium px-4 py-2 rounded">
        Back to Dash
      </button>
    </Link>
  );
};

export default HomeBtn;
