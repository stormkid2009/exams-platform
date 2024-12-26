import { OpenEndedQuestion, QuestionType } from "src/types";
import mongoose, { Schema } from "mongoose";

const MODEL_NAME = 'OpenEnded';

const openEndedSchema = new Schema<OpenEndedQuestion>({
    content: { type: String, required: [true, 'Content is required'] },
    type: { 
        type: String, 
        required: [true, 'Type is required'], 
        enum: ["Open-Ended"] satisfies QuestionType[], // Directly specify the value(s) here
        index: true 
    },
    elements: { type: [String], required: [true, 'Elements are required'] },
    answer: { type: String, required: [true, 'Answer is required'] },
}, { timestamps: true });

export const OpenEnded = mongoose.models[MODEL_NAME] || mongoose.model(MODEL_NAME, openEndedSchema);