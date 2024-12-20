import { GrammaireQuestion, QuestionType } from "src/types"; // Import TypeScript definitions for type safety
import mongoose, { Schema } from "mongoose"; // Import mongoose for MongoDB schema and model management

// Utility function to validate that options array has exactly 4 elements
const validateOptionsLength = (options: string[]): boolean => options.length === 4;

// Utility function to validate that rightAnswers array contains exactly one valid index between 0 and 3
const validateRightAnswers = (answers: number[]): boolean => 
    answers.length === 1 && answers[0] >= 0 && answers[0] < 4;

// Define the schema for grammaire question
const grammaireSchema = new Schema<GrammaireQuestion>({
    // Unique identifier for each question
    id: { type: String, required: true, unique: true },

    // The type of the question (currently only "MCQ" is supported)
    type: { 
        type: String, 
        required: true, 
        enum: ["MCQ"] satisfies QuestionType[], // Restrict to predefined values in QuestionType
        default: "MCQ" // Default to "MCQ" if not specified
    },

    // The main content of the question
    content: { type: String, required: true },

    // Array of possible answers (must contain exactly 4 elements)
    options: {
        type: [String],
        required: true,
        validate: {
            validator: validateOptionsLength, // Use utility function for validation
            message: 'Options must contain exactly 4 elements' // Error message if validation fails
        }
    },

    // Array containing the index of the correct answer (must contain exactly 1 valid index)
    rightAnswers: {
        type: [Number],
        required: true,
        validate: {
            validator: validateRightAnswers, // Use utility function for validation
            message: 'RightAnswers must contain exactly 1 index between 0 and 3' // Error message if validation fails
        }
    }
});

// Add an index to the id field for faster queries (specific to this collection)
grammaireSchema.index({ id: 1 });

// Export the model, ensuring we don't redefine it if already declared
export const Grammaire = mongoose.models.Grammaire || mongoose.model('Grammaire', grammaireSchema);
