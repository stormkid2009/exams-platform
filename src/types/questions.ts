// src/types/questions.ts
export const QuestionTypes = {
    MCQ: 'MCQ',
    MULTI_MCQ: 'Multi-MCQ',
    OPEN_ENDED: 'Open-Ended'
  } as const;
  
  export type QuestionType = typeof QuestionTypes[keyof typeof QuestionTypes];

// Base type for all questions with common properties
export interface BaseQuestion {
    content: string;
    type: QuestionType;
  }
  
  // Specialized interface for questions with options
  export interface OptionsQuestion extends BaseQuestion {
    options: string[];
    rightAnswers: number[];
  }
  
  // More specific question types with strict typing
  export interface GrammaireQuestion extends BaseQuestion {
    type: typeof QuestionTypes.MCQ;
    options: [string, string, string, string];
    rightAnswers: [number];
  }
  
  export interface SituationQuestion extends BaseQuestion {
    type: typeof QuestionTypes.MULTI_MCQ;
    options: [string, string, string, string, string];
    rightAnswers: [number, number];
  }
  
  export interface OpenEndedQuestion extends BaseQuestion {
    type: typeof QuestionTypes.OPEN_ENDED;
    elements: string[];
    answer: string;
  }
  
  // Now, let's properly extend BaseQuestion for our passage-related questions
  interface PassageRelatedQuestion extends BaseQuestion {
    type: typeof QuestionTypes.MCQ;  // More consistent with our type system
    options: [string, string, string, string];
    rightAnswer: number;
  }


// Now we can define the complete PassageQuestion structure
export interface PassageQuestion {
    passage: string;  // The reading comprehension text
    relatedQuestions: PassageRelatedQuestion[];  // Array of questions about the passage
  }