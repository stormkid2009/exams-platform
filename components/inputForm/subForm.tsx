import React, { useState } from "react";
import { DocQuestion } from "src/types";

// declare Props interface to describe the function passed from the parent component
interface Props {
  appendChildData: (data: DocQuestion) => void;
}

const SubForm: React.FC<Props> = ({ appendChildData }) => {
  // declare the sub question  state
  const [question, setQuestion] = useState<DocQuestion>({
    content: "",
    opt1: "",
    opt2: "",
    opt3: "",
    opt4: "",
    rightAnswer: 0,
  });
  // handle the input event on change with function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuestion({ ...question, [name]: value });
  };
  const handleAppend =()=>{
    appendChildData(question);
    setQuestion({
      content: "",
      opt1: "",
      opt2: "",
      opt3: "",
      opt4: "",
      rightAnswer: 0,
    })
  }
  return (
    <>
    
      <div
        className="flex flex-col items-center"      
      >
        
          <div className="p-2 m-2">
            <label className="p-2 m-2">
              Content
              <input
                type="text"
                id="question-content"
                name="content"
                value={question.content}
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
                value={question.opt1}
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
                value={question.opt2}
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
                value={question.opt3}
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
                value={question.opt4}
                required
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="p-2 m-2">
            <label className="p-2 m-2">
              Right answer index
              <input
                type="number"
                id="right-answer"
                name="rightAnswer"
                value={question.rightAnswer}
                required
                onChange={handleChange}
              />
            </label>
          </div>
          <div><button onClick = {handleAppend }>
            append Question
            </button></div>
      </div>
    </>
  );
};

export default SubForm;
