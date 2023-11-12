import React from 'react'
import SituationForm from "components/inputForm/siutationForm"
import { SituationQuestion } from "src/types";


export default function DashBoard (){
    
  const handleSubmit = async(data: SituationQuestion) => {
    // Handle form submission here
    console.log('Form data submitted:', data);
    await fetch('/api/questions/category/situations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };
    return(
        <div>
            <SituationForm  handleSubmit={handleSubmit}/>
        </div>
    )
}