import  mongoose,{Schema} from 'mongoose'
import { DocumentQuestion } from 'src/types'

// we need to add kind property one time and omit it from questions array
const documentSchema:Schema<DocumentQuestion> = new Schema({
    
    texte:{type:String,required:true},
    questions:[
        {
            content:{type:String,required:true},
            options:{
                type:Array,
                required:true
            },
            answerIndex:{type:Number,required:true},
        },
    ]
})



export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema)

