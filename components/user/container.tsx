
import "tailwindcss/tailwind.css"
import SessionInput from './sessionInput'
import UiHeader from './header'
import SessionBtn from './sessionBtn'



function UserContainer() {
  return (
    <div className="h-full flex flex-col items-center border-2  p-4">
      <UiHeader />
      <SessionInput />
      <SessionBtn />
    </div>
  )
}

export default UserContainer