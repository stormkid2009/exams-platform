import React from 'react'
import GrammaireForm from 'components/inputForm/grammaireForm';
import { Question } from "src/types";
import fetcher from 'src/lib/helpers/fetcher';

export default function DashBoard (){
  // declare constant for api path
  const path = `/api/questions/category/grammaire`;

  //declare our submit function which take the form data as argument and pass it to the fetcher
  const handleSubmit = async(data: Question) => {
    // call fetcher to send data to our api endpoint
    fetcher(data,path);
  };
    return(
        <div>
            <GrammaireForm  handleSubmit={handleSubmit}/>
        </div>
    )
}