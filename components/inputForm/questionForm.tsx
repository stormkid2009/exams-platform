import React, { useState } from "react";

//import SubQuestion from "./subQuestion";
//  action="api/dashboard/question/new" method="POST"
// SubQuestion state object should be manipulated by the function which will send it to the api
// next we have to create the state object and then send it to the function
interface FormData {
  content: string;
  opt1: string;
  opt2: string;
  opt3: string;
  opt4: string;
  rightAnswer: number;
}
interface Props {
  handleSubmit: (data:FormData)=>void;
}

const QuestionForm:React.FC<Props>=({handleSubmit})=> {
  
const [formData,setFormData] = useState<FormData>({
  content:'',
  opt1:'',
  opt2:'',
  opt3:'',
  opt4:'',
  rightAnswer: 0,
});
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handler = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if(!formData){
    return;
  }
  handleSubmit(formData);
};

  
  return (
    <div>
      <h2 className="text-center">after fill the from please click submit</h2>
      <form  className="flex flex-col items-center"
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
    </div>
        <div>
            <button >
            Submit</button> 
        </div>
      </form>
    </div>
  );
}

export default QuestionForm;
