import { GrammaireQuestion } from "../../types";
import mongoose,{ Schema } from "mongoose";


// we declare schema here for our grammaire question
const grammaireSchema:Schema<GrammaireQuestion> = new Schema({
    kind:{type:String,required:true},
    content:{type:String,required:true},
    opt1:{type:String,required:true},
    opt2:{type:String,required:true},
    opt3:{type:String,required:true},
    opt4:{type:String,required:true},
    rightAnswer:{type:Number,required:true},
        
});

// we declare and export the model of our schema here
export const Grammaire = mongoose.models.Grammaire || mongoose.model('Grammaire',grammaireSchema);