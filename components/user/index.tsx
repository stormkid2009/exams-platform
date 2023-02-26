
import {  useState } from 'react'
import UserInput from './userInput'
import Header from './header'
import GenerateBtn from "../buttons/generateBtn"

interface Data {
  email: string
}

function User() {
  
  const [email,setEmail] = useState<string>('');
 const fetcher=async()=>{
  const url = 'http://localhost:3000/api/session/new'
  const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userEmail:email})
  }
    const data = await fetch(url,reqOptions);
    const requestData = await data.json();
    console.log(requestData);
 }
  
  function generateSession(){
    
    // send request to api to generat session
    if(!email){
      console.log("Please enter valid email address!!!")
    }
    fetcher();

    
  }
  return (
    <div className="h-full flex flex-col items-center border-2  p-4 m-4">
      <Header />
      <UserInput data={email} getEmail={setEmail}/>
      <GenerateBtn generate={generateSession}/>
    </div>
  )
}

export default User