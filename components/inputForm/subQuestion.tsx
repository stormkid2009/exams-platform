import React from "react";

interface SubProps {
  handlers: {
    content: (arg: string) => void;
    opt1: (arg: string) => void;
    opt2: (arg: string) => void;
    opt3: (arg: string) => void;
    opt4: (arg: string) => void;
    rightAnswer: (arg: number) => void;
  };
}
const SubQuestion: React.FC<SubProps> = ({ handlers }) => {
  return (
    <div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          Content
          <input
            type="text"
            id="question-content"
            name="questionContent"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handlers.content(e.target.value)
            }
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
            name="firstOption"
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handlers.opt1(e.target.value)
            }
          />
          
        </label>
      </div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          B)
          <input
            type="text"
            id="second-option"
            name="secondOption"
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handlers.opt2(e.target.value)
            }
          />
        </label>
      </div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          C)
          <input
            type="text"
            id="third-option"
            name="thirdOption"
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handlers.opt3(e.target.value)
            }
          />
        </label>
      </div>
      <div className="p-2 m-2">
        <label className="p-2 m-2">
          D)
          <input
            type="text"
            id="fourth-option"
            name="fourthOption"
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handlers.opt4(e.target.value)
            }
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
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handlers.rightAnswer(Number(e.target.value))
            }
          />
        </label>
      </div>
    </div>
  );
};

export default SubQuestion;
