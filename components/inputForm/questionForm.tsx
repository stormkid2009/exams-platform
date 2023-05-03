import React from "react";

function QuestionForm() {
  return (
    <div>
      <form action="api/dashboard/question/new" method="POST">
        <label htmlFor="document">
          <input type="text" id="document-question" name = "documentQuestion"/>
        </label>
        <label htmlFor="header">
          <input type="text" id="question-header" name = "questionHeader" required/>
        </label>
        <label htmlFor="firstOption">
          <input type="text" id="first-option" name="firstOption" required/>
        </label>
        <label htmlFor="secondOption">
          <input type="text" id="second-option" name="secondOption"  required/>
        </label>
        <label htmlFor="thirdOption">
          <input type="text" id="third-option" name="thirdOption" required/>
        </label>
        <label htmlFor="fourthOption">
          <input type="text" id="fourth-option" name="fourthOption" required/>
        </label>
        <button type="submit">Submit</button> 
      </form>
    </div>
  );
}

export default QuestionForm;
