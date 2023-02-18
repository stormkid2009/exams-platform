

import UserInput from './userInput'
import Header from './header'
import GenerateBtn from "../buttons/generateBtn"
import { useRouter } from 'next/router'


function User() {
  const router = useRouter();
  function generateTest(){
    router.push('./loading')
    
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