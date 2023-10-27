import React from "react";
import SubQuestion from "./subQuestion";

// SubQuestion state object should be manipulated by the function which will send it to the api
// next we have to create the state object and then send it to the function

function QuestionForm() {
  return (
    <div>
      <h2 className="text-center">after fill the from please click submit</h2>
      <form action="api/dashboard/question/new" method="POST" className="flex flex-col items-center">
        <SubQuestion />
        <div>
            <button type="submit">Submit</button> 
        </div>
      </form>
    </div>
  );
}

export default QuestionForm;
