import React from "react";
import { SubQuestion } from "src/types";
import AltForm from "components/reusable/altForm";

// declare Props interface to describe the function passed from the parent component
interface Props {
  handleSubmit: (data:SubQuestion)=>void;
}

const SituationForm:React.FC<Props>=({handleSubmit})=> {
 
// handle the submit event with function
const handler = (data:SubQuestion) => {
  handleSubmit(data);
};

  
  return (
    <div>
        <AltForm  
        fields={['content','opt1','opt2','opt3','opt4','opt5','rightAnswer','rightAnswer2']} 
        handler = {handler}
        />
    </div>
  );
}

export default SituationForm;
