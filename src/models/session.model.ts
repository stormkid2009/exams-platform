import mongoose , {Schema} from 'mongoose'

export interface ISessionModel {
    email:string;
    testID:string;

}

const sessionSchema:Schema<ISessionModel> = new Schema({
    email:{type:String,required:true},
    testID:{type:String,required:true},
    
})

export const Session =mongoose.models.Session ||  mongoose.model('Session', sessionSchema);