import React from "react";

function QuestionForm() {
  return (
    <div>
      <h2 className="text-center">after fill the from please click submit</h2>
      <form action="api/dashboard/question/new" method="POST" className="flex flex-col items-center">
        <div>

        <label htmlFor="document">
          <input type="text" id="document-question" name = "documentQuestion"/>
        </label>
        </div>
        <div>

        <label htmlFor="header">
          <input type="text" id="question-header" name = "questionHeader" required/>
        </label>
        </div>
        <div>

        <label htmlFor="firstOption">
          A)
        </label>
          <input type="text" id="first-option" name="firstOption" required/>
        </div>
        <div>

        <label htmlFor="secondOption">
          B)
        </label>
          <input type="text" id="second-option" name="secondOption"  required/>
        </div>
        <div>

        <label htmlFor="thirdOption">
          C)
        </label>
          <input type="text" id="third-option" name="thirdOption" required/>
        </div>
        <div>

        <label htmlFor="fourthOption">
          D)
        </label>
          <input type="text" id="fourth-option" name="fourthOption" required/>
        </div>
        <div>

        <button type="submit">Submit</button> 
        </div>
      </form>
    </div>
  );
}

export default QuestionForm;
