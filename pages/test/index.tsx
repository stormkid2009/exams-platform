import React from 'react'
import { Question } from 'src/types';
import GrammaireForm from 'components/inputForm/grammaireForm';
import fetcher from 'src/lib/helpers/fetcher';

const Test:React.FC=()=> {
  const path = `/api/questions/category/grammaire`
  const handleSubmit=(data:Question)=> {
    fetcher(data,path);
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