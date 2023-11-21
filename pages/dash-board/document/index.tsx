import React from 'react'
import DocumentForm from "components/inputForm/documentForm";
import { DocumentQuestion } from "src/types";


export default function DashBoard (){
    
  const handleSubmit = async(data: DocumentQuestion) => {
    // Handle form submission here
    console.log('Form data submitted:', data);
    try {
      const response = await fetch('/api/questions/category/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      // You can use the response here if needed
    
    } catch (error) {
      console.error('There was a problem with the fetch operation: ', error);
    }
    
  };
    return(
        <div>
            <DocumentForm  handleSubmit={handleSubmit}/>
        </div>
    )
}