import { GrammaireQuestion, QuestionType } from "src/types"
import mongoose,{ Schema } from "mongoose";


// we declare schema here for our grammaire question
const grammaireSchema = new Schema<GrammaireQuestion>({
    id: { type: String, required: true, unique: true },
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
            message: 'Options must contain exactly 4 elements'
        }
    },
    rightAnswers: {
        type: [Number],
        required: true,
        validate: {
            validator: function(v: number[]) {
                return v.length === 1 && v[0] >= 0 && v[0] < 4;
            },
            message: 'RightAnswers must contain exactly 1 index between 0 and 3'
        }
    }
});

// we declare and export the model of our schema here
export const Grammaire = mongoose.models.Grammaire || mongoose.model('Grammaire', grammaireSchema);