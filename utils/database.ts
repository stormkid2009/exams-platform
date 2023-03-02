
import { Schema, model, connect } from 'mongoose';
import {IData,ISession} from '../types/index';
import { config } from 'dotenv';

// 1. Create an interface representing a document in MongoDB. we imported above from types dir

config();
// 2. Create a Schema corresponding to the document interface.
const sessionSchema = new Schema<ISession>({
    id:{type: String,required: true},
    userEmail:{type: String,required: true},
    testID:{type: String,required: true},
});


// 3. Create a Model.
const Session = model<ISession>('Session',sessionSchema);
run().catch(err => console.log(err));

async function run(){
     
    await connect(process.env.MONGODB_URI);
}