import { OpenEndedQuestion, QuestionType } from "src/types/questions";
import mongoose, { Schema } from "mongoose";

const MODEL_NAME = "OpenEnded";

// Utility function to validate that elements array is not empty
const validateElements = (elements: string[]): boolean => elements.length > 0;

// Schema for open-ended questions
const openEndedSchema = new Schema<OpenEndedQuestion>(
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
export const OpenEnded =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, openEndedSchema);