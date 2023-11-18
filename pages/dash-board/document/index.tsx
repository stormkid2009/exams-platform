import React from 'react'
import DocumentForm from "components/inputForm/documentForm";
import { DocumentQuestion } from "src/types";


export default function DashBoard (){
    
  const handleSubmit = async(data: DocumentQuestion) => {
    // Handle form submission here
    console.log('Form data submitted:', data);
    /*
    await fetch('/api/questions/category/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    */
  };
    return(
        <div>
            <DocumentForm  handleSubmit={handleSubmit}/>
        </div>
    )
}