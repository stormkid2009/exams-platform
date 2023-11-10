import React,{useState} from 'react'
import QuestionForm from "../../components/inputForm/questionForm";



export default function DashBoard (){
    
  const handleSubmit = (data: any) => {
    // Handle form submission here
    console.log('Form data submitted:', data);
  };
    return(
        <div>
            <QuestionForm  handleSubmit={handleSubmit}/>
        </div>
    )
}