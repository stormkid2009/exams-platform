// User interface
export interface IUserModel {
    email: string;
    password: string;
    createdAt: Date;
  }


//MCQ: Multiple Choice Question
//Multi-MCQ: Multiple Choice Question with multiple correct answers
//Open-Ended: Free-form question

export type QuestionType = "MCQ" | "Multi-MCQ" | "Open-Ended";

// Base interface for all questions
export interface BaseQuestion {
    id: string; // Unique identifier
    content: string; // Main question text
    options?: string[]; // Array of options (optional for open-ended questions)
    rightAnswers?: number[]; // Array of indices for correct answers (optional for open-ended questions)
    type: QuestionType; // Type of the question
}

// Interface for Grammaire questions - Multiple choice with exactly 4 options and 1 correct answer
export interface GrammaireQuestion extends BaseQuestion {
    type: "MCQ";
    options: [string, string, string, string]; // Tuple of exactly 4 strings
    rightAnswers: [number]; // Tuple of exactly 1 number (index)
}

// Interface for Situation questions - Multiple choice with exactly 5 options and 2 correct answers
export interface SituationQuestion extends BaseQuestion {
    type: "Multi-MCQ";
    options: [string, string, string, string, string]; // Tuple of exactly 5 strings
    rightAnswers: [number, number]; // Tuple of exactly 2 numbers (indices)
}

// Interface for a passage with related questions
export interface PassageQuestion {
    id: string; // Unique identifier for the passage
    passage: string; // The text of the passage
    relatedQuestions: BaseQuestion[]; // Array of questions related to the passage
}

export interface Messages {
    success: string;
    failure: string;
    wrongMethod: string;
    invalidData: string;
}
