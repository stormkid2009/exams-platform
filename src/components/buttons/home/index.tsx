
import React from "react";
import Link from "next/link";

const HomeBtn: React.FC = () => {
  return (
    <Link href="/dash-board">
      <button className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-medium px-4 py-2 rounded">
        Go to Dashboard
      </button>
    </Link>
  );
};

export default HomeBtn;