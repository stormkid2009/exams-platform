import React, { useState } from "react";
import { SituationQuestion } from "../../src/types";

// declare Props interface to describe the function passed from the parent component
interface Props {
  handleSubmit: (data:SituationQuestion)=>void;
}

const SituationForm:React.FC<Props>=({handleSubmit})=> {
 // declare the form state 
const [formData,setFormData] = useState<SituationQuestion>({
  kind:'situations',
  content:'',
  opt1:'',
  opt2:'',
  opt3:'',
  opt4:'',
  opt5:'',
  rightAnswer: 0,
  rightAnswer2: 0,
});
// handle the input event on change with function
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

// handle the submit event with function
const handler = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if(!formData){
    return;
  }
  handleSubmit(formData);
  setFormData({
    kind:'situations',
    content:'',
    opt1:'',
    opt2:'',
    opt3:'',
    opt4:'',
    opt5:'',
    rightAnswer: 0,
    rightAnswer2: 0,
  })
};

  
  return (
    <div>
      <h2 className="text-center">after fill the from please click submit</h2>
      <form  className="flex flex-col items-center"  id="form-submit"
      onSubmit={handler}>
         <div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          Content
          <input
            type="text"
            id="question-content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
        A)
          <input
            type="text"
            id="first-option"
            name="opt1"
            value={formData.opt1}
            required
            onChange={handleChange}
          />
          
        </label>
      </div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          B)
          <input
            type="text"
            id="second-option"
            name="opt2"
            value={formData.opt2}
            required
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          C)
          <input
            type="text"
            id="third-option"
            name="opt3"
            value={formData.opt3}
            required
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          D)
          <input
            type="text"
            id="forth-option"
            name="opt4"
            value={formData.opt4}
            required
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          E)
          <input
            type="text"
            id="fifth-option"
            name="opt5"
            value={formData.opt5}
            required
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          Right answer index
          <input
            type="text"
            id="right-answer"
            name="rightAnswer"
            value={formData.rightAnswer}
            required
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          Right answer index
          <input
            type="text"
            id="right-answer2"
            name="rightAnswer2"
            value={formData.rightAnswer2}
            required
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
        <div>
            <button >
            Submit</button> 
        </div>
      </form>
    </div>
  );
}

export default SituationForm;
