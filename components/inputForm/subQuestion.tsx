import React from "react";

function SubQuestion() {
  return (
    <div>
      <div className="p-2 m-2">
        <label htmlFor="content" className="p-2 m-2">Content
        </label>
          <input
            type="text"
            id="question-content"
            name="questionContent"
            required
          />
      </div>
      <div className="p-2 m-2">
        <label htmlFor="firstOption" className="p-2 m-2">A)</label>
        <input type="text" id="first-option" name="firstOption" required />
      </div>
      <div className="p-2 m-2">
        <label htmlFor="secondOption"className="p-2 m-2" >B)</label>
        <input type="text" id="second-option" name="secondOption" required />
      </div>
      <div className="p-2 m-2">
        <label htmlFor="thirdOption" className="p-2 m-2">C)</label>
        <input type="text" id="third-option" name="thirdOption" required />
      </div>
      <div className="p-2 m-2">
        <label htmlFor="fourthOption" className="p-2 m-2">D)</label>
        <input type="text" id="fourth-option" name="fourthOption" required />
      </div>
      <div className="p-2 m-2">
        <label htmlFor="rightAnswer" className="p-2 m-2">Right answer index</label>
      <input type="text" id="right-answer" name="rightAnswer" required />
      </div>
    </div>
  );
}

export default SubQuestion;
