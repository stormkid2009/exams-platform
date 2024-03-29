import { SituationQuestion } from "src/types";
import mongoose,{Schema} from "mongoose";

// we declare schema for the situation question here
const situationSchema:Schema<SituationQuestion> = new Schema({
    kind:{type:String,required:true},
    content:{type:String,required:true},
    opt1:{type:String,required:true},
    opt2:{type:String,required:true},
    opt3:{type:String,required:true},
    opt4:{type:String,required:true},
    opt5:{type:String,required:true},
    rightAnswer:{type:Number,required:true},
    rightAnswer2:{type:Number,required:true},
})


// we declare and export the model for our schema
export const Situation = mongoose.models.Situation || mongoose.model('Situation',situationSchema);