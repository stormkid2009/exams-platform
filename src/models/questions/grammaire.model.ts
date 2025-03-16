import { GrammaireQuestion, QuestionType } from "src/types/questions"; // Import TypeScript definitions for type safety
import mongoose, { Schema } from "mongoose"; // Import mongoose for MongoDB schema and model management

/**
 * grammaireSchema
 * 
 * This schema defines the structure of a grammar question in the MongoDB database.
 * It includes fields for the question type, content, possible answer options, and the correct answer.
 * 
 * Fields:
 * - type (string): The type of the question, which is currently restricted to "MCQ".
 * - content (string): The main content of the question. This field is required.
 * - options (string[]): An array of possible answers. This field is required and must contain exactly 4 elements.
 * - rightAnswer (string[]): An array containing the index of the correct answer. This field is required 
 *   and must contain exactly 1 valid index from the options.
 * 
 * The schema includes validation rules to ensure that all required fields are provided 
 * and that the options and rightAnswer fields meet their respective criteria.
 */

/**
 * Grammaire Model
 * 
 * This model represents the Grammaire question in the MongoDB database.
 * It is created using the grammaireSchema and is exported for use in the application.
 * 
 * The model ensures that we do not redefine it if it has already been declared in the 
 * mongoose models.
 */
const MODEL_NAME = "Grammaire";
const OPTIONS = ['a', 'b', 'c', 'd'];
const VALID_OPTIONS_NUMBER = 4;
// Utility function to validate that options array has exactly 4 elements
const validateOptionsLength = (options: string[]) => options.length === VALID_OPTIONS_NUMBER;
const validateRightAnswer = (rightAnswer: string[]) => rightAnswer.length === 1 && OPTIONS.includes(rightAnswer[0]);



// Define the schema for grammaire question
export const grammaireSchema = new Schema<GrammaireQuestion>({
  // The type of the question (currently only "MCQ" is supported)
  type: {
    type: String,
    required: true,
    enum: ["MCQ"] satisfies QuestionType[], // Restrict to predefined values in QuestionType
    default: "MCQ", // Default to "MCQ" if not specified
  },

  // The main content of the question
  content: { type: String, required: true },

  // Array of possible answers (must contain exactly 4 elements)
  options: {
    type: [String],
    required: true,
    validate: {
      validator: validateOptionsLength, // Use utility function for validation
      message: "Options must contain exactly 4 elements", // Error message if validation fails
    },
  },

  // Array containing the index of the correct answer (must contain exactly 1 valid index)
  rightAnswer: {
    type: [String],
    required: true,
    validate: {
      validator: validateRightAnswer, // Use utility function for validation
      message: "RightAnswer must be from ['a','b','c','d'] ", // Error message if validation fails
    },
  },
},
{
  timestamps: true,
}
);



// Export the model, ensuring we don't redefine it if already declared
export const Grammaire =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, grammaireSchema);
