import { CompositionQuestion, QuestionType } from "src/types/questions";
import mongoose, { Schema } from "mongoose";
/**
 * compositionSchema
 * 
 * This schema defines the structure of a composition question in the MongoDB database.
 * It includes fields for the question content, type, elements, and the correct answer.
 * 
 * Fields:
 * - content (string): The main content of the question. This field is required.
 * - type (string): The type of the question, which is currently restricted to "Open-Ended".
 * - elements (string[]): An array of elements associated with the question. This field is required 
 *   and must not be empty.
 * - answer (string): The correct answer to the question. This field is required.
 * 
 * The schema includes validation rules to ensure that all required fields are provided 
 * and that the elements array is not empty.
 */

/**
 * Composition Model
 * 
 * This model represents the Composition question in the MongoDB database.
 * It is created using the compositionSchema and is exported for use in the application.
 * 
 * The model ensures that we do not redefine it if it has already been declared in the 
 * mongoose models.
 */

const MODEL_NAME = "Composition";

// Utility function to validate that elements array is not empty
const validateElements = (elements: string[]): boolean => elements.length > 0;

// Schema for open-ended questions
export const compositionSchema = new Schema<CompositionQuestion>(
  {
    // The main content of the question
    content: { type: String, required: [true, "Content is required"] },

    // The type of the question (currently only "Open-Ended" is supported)
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["Open-Ended"] satisfies QuestionType[], // Restrict to predefined values
      index: true,
    },

    // Array of elements (must not be empty)
    elements: {
      type: [String],
      required: [true, "Elements are required"],
      validate: {
        validator: validateElements, // Use utility function for validation
        message: "Elements must not be empty", // Error message if validation fails
      },
    },

    // The correct answer to the question
    answer: { type: String, required: [true, "Answer is required"] },
  },
  { timestamps: true }
);

// Export the model, ensuring we don't redefine it if already declared
export const Composition =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, compositionSchema);
