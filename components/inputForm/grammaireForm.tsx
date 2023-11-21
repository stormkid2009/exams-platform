import React from "react";
import { Question } from "src/types";
import Form from "components/reusable/form";

// declare Props interface to describe the function passed from the parent component
interface Props {
  handleSubmit: (data:Question)=>void;
}

const GrammaireForm:React.FC<Props>=({handleSubmit})=> {
 
// create callback function to pass down the submit function
const handler = (data:Question) => {
  
  handleSubmit(data);
};

  
  return (
    <div>
      <h2 className="text-center">after fill the from please click submit</h2>
      
      <Form fields={['content','opt1','opt2','opt3','opt4','rightAnswer']} handler = {handler} />
      
      
      
    </div>
  );
}

export default GrammaireForm;
