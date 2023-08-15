import { GrammaireModel } from "../../types";
import mongoose,{ Schema } from "mongoose";


const grammaireSchema:Schema<GrammaireModel> = new Schema({
    kind:{type:String,required:true},
    subs:
        [
            {   
                content:{type:String,required:true},
                options:[{
                    type:String,
                    required:true
                }],
                answerIndex:{type:Number,required:true},
            }
        ]
            
        
});


export const Grammaire = mongoose.models.Grammaire || mongoose.model('Grammaire',grammaireSchema);