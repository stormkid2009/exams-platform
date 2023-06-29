import  mongoose,{Schema} from 'mongoose'
import { ILeDocumentModel } from '../../types'


const documentSchema:Schema<ILeDocumentModel> = new Schema({
    kind:{type:String,required:true},
    header:{type:String,required:true},
    texte:{type:String,required:true},
    subQuestions:[
        {
            header:{type:String,required:true},
            options:[
                {
                    name:{type:String,required:true},
                    content:{type:String,required:true},
                    isChecked:{type:Boolean,required:true},
                },
                {
                    name:{type:String,required:true},
                    content:{type:String,required:true},
                    isChecked:{type:Boolean,required:true},
                },
                {
                    name:{type:String,required:true},
                    content:{type:String,required:true},
                    isChecked:{type:Boolean,required:true},
                },
                {
                    name:{type:String,required:true},
                    content:{type:String,required:true},
                    isChecked:{type:Boolean,required:true},
                }
            ],
            answerIndex:{type:Number,required:true},
            points:{type:Number,required:true},
        },
    ]
})


export const LeDocument = mongoose.models.LeDocument || mongoose.model('LeDocument', documentSchema)

