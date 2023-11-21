import React from 'react'
import { Question } from 'src/types';
import GrammaireForm from 'components/inputForm/grammaireForm';


const Test:React.FC=()=> {

  const handleSubmit=(data:Question)=> {
    console.log(data);
  }
  return (
    <div>
        <h1>
            Test
      </h1>
      <div>
        <GrammaireForm handleSubmit={handleSubmit}/>
      </div>
      </div>
            
  )
}

export default Test