import React from 'react'
import QuestionForm from "../../components/inputForm/questionForm";
import { Question } from "../../src/types";


export default function DashBoard (){
    
  const handleSubmit = async(data: Question) => {
    // Handle form submission here
    console.log('Form data submitted:', data);
    await fetch('/api/questions/category/grammaire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };
    return(
        <div>
            <QuestionForm  handleSubmit={handleSubmit}/>
        </div>
    )
}