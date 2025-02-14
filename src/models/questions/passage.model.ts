import mongoose, { Schema } from "mongoose"; // Import mongoose for schema and model management
import { PassageQuestion, QuestionType } from "src/types/questions"; // Import TypeScript types for type safety
import {grammaireSchema} from "./grammaire.model";

const MODEL_NAME = "Passage";



// Utility function to validate that there is at least one related question
const validateRelatedQuestions = (questions: any[]): boolean =>
  questions.length > 0;

// Reuse the grammaire schema for related questions
const relatedQuestionSchema = new Schema({
  ...grammaireSchema.obj, // Spread all fields from the grammaire schema
});
// Schema for the passage question document
const passageSchema = new Schema<PassageQuestion>({
  type: {
    type: String,
    required: true,
    enum: ["RC"] satisfies QuestionType[], // Restrict to predefined values in QuestionType
    default: "RC", // Default to "RC" if not specified
  },
  // The passage content TEXT
  passage: { type: String, required: true },

  // Array of related questions (must contain at least one question)
  relatedQuestions: {
    type: [relatedQuestionSchema],
    required: true,
    validate: {
      validator: validateRelatedQuestions, // Use utility function for validation
      message: "A passage must have at least one related question", // Error message if validation fails
    },
  },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt fields  


// Add an index to the id field for faster queries (specific to this collection)
passageSchema.index({ id: 1 });

// Export the model, ensuring we don't redefine it if already declared
export const Passage =
  mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, passageSchema);
