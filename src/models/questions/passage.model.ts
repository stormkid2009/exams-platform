import mongoose, { Schema } from "mongoose"; // Import mongoose for schema and model management
import { PassageQuestion, QuestionType } from "src/types/questions"; // Import TypeScript types for type safety

const MODEL_NAME = "Passage";
// Utility function to validate that options array has exactly 4 elements
const validateOptionsLength = (options: string[]): boolean =>
  options.length === 4;

// Utility function to validate that rightAnswers array contains exactly 1 valid index (0-3)
const validateRightAnswers = (answers: number[]): boolean =>
  answers.length === 1 && answers[0] >= 0 && answers[0] < 4;

// Utility function to validate that there is at least one related question
const validateRelatedQuestions = (questions: any[]): boolean =>
  questions.length > 0;

// Schema for related questions (similar to grammaire questions)
const relatedQuestionSchema = new Schema({
  // Type of the related question (currently only "MCQ" is supported)
  type: {
    type: String,
    required: true,
    enum: ["MCQ"] satisfies QuestionType[], // Restrict to predefined values
    default: "MCQ", // Default to "MCQ" if not specified
  },

  // The main content of the related question
  content: { type: String, required: true },

  // Array of possible answers (must contain exactly 4 elements)
  options: {
    type: [String],
    required: true,
    validate: {
      // Use utility function for validation
      validator: validateOptionsLength,
      message: "Each question must have exactly 4 options", // Error message if validation fails
    },
  },

  // Array containing the index of the correct answer (must contain exactly 1 valid index)
  rightAnswers: {
    type: [Number],
    required: true,
    validate: {
      // Use utility function for validation
      validator: validateRightAnswers,
      message: "Each question must have exactly 1 right answer (index 0-3)", // Error message if validation fails
    },
  },
});

// Schema for the passage question document
const passageSchema = new Schema<PassageQuestion>({
  // The passage content
  passage: { type: String, required: true },

  // Array of related questions (must contain at least one question)
  relatedQuestions: {
    type: [relatedQuestionSchema],
    required: true,
    validate: {
      // Use utility function for validation
      validator: validateRelatedQuestions,
      message: "A passage must have at least one related question", // Error message if validation fails
    },
  },
});

// Add an index to the id field for faster queries (specific to this collection)
passageSchema.index({ id: 1 });

// Export the model, ensuring we don't redefine it if already declared
export const Passage =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, passageSchema);
