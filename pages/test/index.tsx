import Instructions from "../../components/instructions"
import StartBtn from "../../components/buttons/startBtn"
//import Router from 'next/router'


function Test() {
    function navigateToQuestions(){
        console.log(`navigateToQuestions`)
    }
  return (
    <div className="flex flex-col items-center h-full">
        <Instructions />
        <StartBtn start={navigateToQuestions}/>
    </div>
  )
}

export default Test
