import { SituationQuestion } from "src/types/questions"; // Import TypeScript definitions for type safety
import mongoose, { Schema } from "mongoose"; // Import mongoose for MongoDB schema and model management

/**
 * situationSchema
 * 
 * This schema defines the structure of a situation question in the MongoDB database.
 * It includes fields for the question type, content, possible answer options, and correct answers.
 * 
 * Fields:
 * - type (string): The type of the question, which is currently restricted to "Multi-MCQ".
 * - content (string): The main content of the question. This field is required.
 * - options (string[]): An array of possible answers. This field is required and must contain exactly 5 elements.
 * - rightAnswers (string[]): An array containing the indices of the correct answers. This field is required 
 *   and must contain exactly 2 valid indices from the options.
 * 
 * The schema includes validation rules to ensure that all required fields are provided 
 * and that the options and rightAnswers fields meet their respective criteria.
 */

/**
 * Situation Model
 * 
 * This model represents the Situation question in the MongoDB database.
 * It is created using the situationSchema and is exported for use in the application.
 * 
 * The model ensures that we do not redefine it if it has already been declared in the 
 * mongoose models.
 */
const MODEL_NAME = "Situation";
const OPTIONS_LABELS = ['a', 'b', 'c', 'd', 'e'];
const VALID_OPTIONS_NUMBER = 5;

// Utility function to validate that the options array has exactly 5 elements
const validateOptionsLength = (options: string[]): boolean =>
  options.length === VALID_OPTIONS_NUMBER;

// Utility function to validate that rightAnswers array contains exactly 2 valid indices between 0 and 4
const validateRightAnswers = (rightAnswers: string[]) => rightAnswers.length === 2 && rightAnswers.every(answer => OPTIONS_LABELS.includes(answer));

// Schema for the situation question that matches the SituationQuestion interface
const situationSchema = new Schema<SituationQuestion>({
  // The type of the question (currently only "Multi-MCQ" is supported)
  type: {
    type: String,
    required: true,
    enum: ["Multi-MCQ"], // Restrict to predefined values
    default: "Multi-MCQ", // Default to "Multi-MCQ" if not specified
  },

  // The main content of the question
  content: { type: String, required: true },

  // Array of possible answers (must contain exactly 5 elements)
  options: {
    type: [String],
    required: true,
    validate: {
      // Use utility function for validation
      validator: validateOptionsLength,
      message: "Situation question must have exactly 5 options", // Error message if validation fails
    },
  },

  // Array containing indices of correct answers (must contain exactly 2 valid indices)
  rightAnswer: {
    type: [String],
    required: true,
    validate: {
      // Use utility function for validation
      validator: validateRightAnswers,
      message:
        "Situation question must have exactly 2 right answers from ['a','b','c','d','e'] ", // Error message if validation fails
    },
  },
},
{
  timestamps: true,
}
);

// Add an index to the id field for faster queries (specific to this collection)
situationSchema.index({ id: 1 });

// Export the model, ensuring we don't redefine it if already declared
export const Situation =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, situationSchema);
