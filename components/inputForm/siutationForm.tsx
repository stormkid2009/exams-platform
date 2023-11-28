import React from "react";
import { Question } from "src/types";
import FormV2 from "components/reusable/form";

// declare Props interface to describe the function passed from the parent component
interface Props {
  handleSubmit: (data:Question)=>void;
}

const SituationForm:React.FC<Props>=({handleSubmit})=> {
 
// handle the submit event with function
const handler = (data:Question) => {
  handleSubmit(data);
};

  
  return (
    <div>
      <h2 className="text-center">after fill the from please click submit</h2>
      
        <FormV2  
        fields={['content','opt1','opt2','opt3','opt4','opt5','rightAnswer','rightAnswer2']} 
        handler = {handler}
        />
    </div>
  );
}

export default SituationForm;
