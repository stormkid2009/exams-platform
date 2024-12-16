import { SituationQuestion } from "src/types";
import mongoose, { Schema } from "mongoose";

// Schema for the situation question that matches the SituationQuestion interface
const situationSchema = new Schema<SituationQuestion>({
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ["Multi-MCQ"], default: "Multi-MCQ" },
    content: { type: String, required: true },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function(v: string[]) {
                return v.length === 5;
            },
            message: "Situation question must have exactly 5 options"
        }
    },
    rightAnswers: {
        type: [Number],
        required: true,
        validate: {
            validator: function(v: number[]) {
                return v.length === 2 && v.every(num => num >= 0 && num < 5);
            },
            message: "Situation question must have exactly 2 right answers with valid indices (0-4)"
        }
    }
});

// Export the model
export const Situation = mongoose.models.Situation || mongoose.model('Situation', situationSchema);