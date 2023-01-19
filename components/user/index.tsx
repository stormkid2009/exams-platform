
import "tailwindcss/tailwind.css"
import UserInput from './userInput'
import Header from './header'
import GenerateBtn from "../buttons/generateBtn"



function User() {
  function generateTest(){
    console.log(`we are generating the test for You`)
  }
  return (
    <div className="h-full flex flex-col items-center border-2  p-4 m-4">
      <Header />
      <UserInput />
      <GenerateBtn generate={generateTest}/>
    </div>
  )
}

export default User