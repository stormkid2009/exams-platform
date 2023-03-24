import mongoose,{Schema} from 'mongoose'

export interface IQuestionModel {
    type:string;
    document?:string;
    header:string;
    options:[
        {
            name:string;
            content:string;
            checked:boolean;
        }
    ];
    answerIndex:number;
    points:number;
}

const questionSchema:Schema<IQuestionModel> = new Schema({
    type:{type:String,required:true},
    header:{type:String,required:true},
    options:[
        {
            name:{type:String,required:true},
            content:{type:String,required:true},
            checked:{type:Boolean,required:true},
        }
    ],
    answerIndex:{type:Number,required:true,min:0,max:4},
    points:{type:Number,required:true}
})

export const Question = mongoose.models.Question || mongoose.model('Question',questionSchema);