import { SituationsModel } from "../../types";
import mongoose,{Schema} from "mongoose";

const situationsSchema:Schema<SituationsModel> = new Schema({
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
})

export const Situations = mongoose.models.Situations || mongoose.model('Situations',situationsSchema);