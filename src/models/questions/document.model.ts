import  mongoose,{Schema} from 'mongoose'
import { DocumentModel } from '../../types'


const documentSchema:Schema<DocumentModel> = new Schema({
    kind:{type:String,required:true},
    texte:{type:String,required:true},
    subs:[
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

