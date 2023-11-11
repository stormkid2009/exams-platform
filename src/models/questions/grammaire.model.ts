import { GrammaireQuestion } from "../../types";
import mongoose,{ Schema } from "mongoose";


// we need to change the model here because subs array is not valid for one question only
// so we can append only the kind of question to the request object
const grammaireSchema:Schema<GrammaireQuestion> = new Schema({
    kind:{type:String,required:true},
    content:{type:String,required:true},
    opt1:{type:String,required:true},
    opt2:{type:String,required:true},
    opt3:{type:String,required:true},
    opt4:{type:String,required:true},
    rightAnswer:{type:Number,required:true},
        
});


export const Grammaire = mongoose.models.Grammaire || mongoose.model('Grammaire',grammaireSchema);