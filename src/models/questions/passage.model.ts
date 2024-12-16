import mongoose, { Schema } from 'mongoose'
import { PassageQuestion, QuestionType } from 'src/types'

// Schema for related questions (similar to grammaire questions)
const relatedQuestionSchema = new Schema({
    id: { type: String, required: true },
    type: { 
        type: String, 
        required: true, 
        enum: ["MCQ"] satisfies QuestionType[], 
        default: "MCQ" 
    },
    content: { type: String, required: true },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function(v: string[]) {
                return v.length === 4;
            },
            message: 'Each question must have exactly 4 options'
        }
    },
    rightAnswers: {
        type: [Number],
        required: true,
        validate: {
            validator: function(v: number[]) {
                return v.length === 1 && v[0] >= 0 && v[0] < 4;
            },
            message: 'Each question must have exactly 1 right answer (index 0-3)'
        }
    }
});

// Schema for the passage question document
const passageSchema = new Schema<PassageQuestion>({
    id: { type: String, required: true, unique: true },
    passage: { type: String, required: true },
    relatedQuestions: {
        type: [relatedQuestionSchema],
        required: true,
        validate: {
            validator: function(questions: any[]) {
                return questions.length > 0;
            },
            message: 'A passage must have at least one related question'
        }
    }
});

export const Passage = mongoose.models.Passage || mongoose.model('Passage', passageSchema);
