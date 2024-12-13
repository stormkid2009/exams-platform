
// User interface
export interface IUserModel {
    email: string;
    password: string;
    createdAt: Date;
  }


//MCQ: Multiple Choice Question
//Multi-MCQ: Multiple Choice Question with multiple correct answers
//Open-Ended: Free-form question

type QuestionType = "MCQ" | "Multi-MCQ" | "Open-Ended";

// Base interface for all questions
export interface BaseQuestion {
    id: string; // Unique identifier
    content: string; // Main question text
    options?: string[]; // Array of options (optional for open-ended questions)
    rightAnswers?: number[]; // Array of indices for correct answers (optional for open-ended questions)
    type: QuestionType; // Type of the question
}


export interface Messages {
    success:string;
    failure:string;
    wrongMethod:string;
  }

