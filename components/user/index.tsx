
import "tailwindcss/tailwind.css"
import UserInput from './userInput'
import Header from './header'
import GenerateBtn from "../buttons/generateBtn"



function User() {
  return (
    <div className="h-full flex flex-col items-center border-2  p-4">
      <Header />
      <UserInput />
      <GenerateBtn />
    </div>
  )
}

export default User