import "tailwindcss/tailwind.css";
import DateDisplay from "./date-display";
import Logo from "./logo";
import PlatformTitle from "./platform-title";

function Header() {
  return (
    <header className="flex items-center justify-between bg-blue-500 text-white p-4 md:p-6">
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
