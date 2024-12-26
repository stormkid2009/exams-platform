import { SituationQuestion } from "src/types"; // Import TypeScript definitions for type safety
import mongoose, { Schema } from "mongoose"; // Import mongoose for MongoDB schema and model management

const MODEL_NAME = 'Situation';

// Utility function to validate that the options array has exactly 5 elements
const validateOptionsLength = (options: string[]): boolean => options.length === 5;

// Utility function to validate that rightAnswers array contains exactly 2 valid indices between 0 and 4
const validateRightAnswers = (answers: number[]): boolean => 
    answers.length === 2 && answers.every(num => num >= 0 && num < 5);

// Schema for the situation question that matches the SituationQuestion interface
const situationSchema = new Schema<SituationQuestion>({
    

    // The type of the question (currently only "Multi-MCQ" is supported)
    type: { 
        type: String, 
        required: true, 
        enum: ["Multi-MCQ"], // Restrict to predefined values
        default: "Multi-MCQ" // Default to "Multi-MCQ" if not specified
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
            message: "Situation question must have exactly 5 options" // Error message if validation fails
        }
    },

    // Array containing indices of correct answers (must contain exactly 2 valid indices)
    rightAnswers: {
        type: [Number],
        required: true,
        validate: {
            // Use utility function for validation
            validator: validateRightAnswers,
            message: "Situation question must have exactly 2 right answers with valid indices (0-4)" // Error message if validation fails
        }
    }
});

// Add an index to the id field for faster queries (specific to this collection)
situationSchema.index({ id: 1 });

// Export the model, ensuring we don't redefine it if already declared
export const Situation = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, situationSchema);
