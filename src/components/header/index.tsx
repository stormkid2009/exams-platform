import React from "react";
import "tailwindcss/tailwind.css";
import DateDisplay from "./date-display";
import Logo from "./logo";
import PlatformTitle from "./platform-title";

/**
 * Header Component
 * 
 * This component renders the header section of the application, 
 * which includes the platform logo, title, and the current date display.
 * 
 * The header is styled to be responsive and visually appealing, 
 * with a background color and text color that enhances readability.
 * 
 * The component includes:
 * - Logo: Displays the platform's logo.
 * - PlatformTitle: Displays the title "Tests Generator".
 * - DateDisplay: Shows the current date, updating every 30 seconds.
 */
function Header() {
  return (
    <header className="w-full rounded-t-lg flex items-center justify-between bg-slate-700 text-white p-4 md:p-6">
      <div className="flex-shrink-0">
        <Logo />
      </div>
      <div className="flex-grow text-center">
        <PlatformTitle />
      </div>
      <div className="flex-shrink-0">
        <DateDisplay />
      </div>
    </header>
  );
}

export default Header;
