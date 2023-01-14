import "tailwindcss/tailwind.css";
import DateDisplay from "./dateDisplay";
import Logo from './logo'
import PlatformTitle from './platformTitle'

function Header() {
  return (
    <div className="flex justify-between bg-sky-500 p-4">
        <Logo />
        <PlatformTitle />
        <DateDisplay />
    </div>
  )
}

export default Header