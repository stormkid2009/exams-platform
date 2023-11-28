// Now we can use the absolute path by adding baseUrl options to the tsconfig.json file
import connectToDB from 'src/lib/mongooseClient'
import { Situation } from "src/models/questions/situations.model";
import { NextApiRequest,NextApiResponse } from "next";
import { Messages } from 'src/types';


let msg: Messages = {
    success:'Success to create new question',
    failure:'Failed to create  new  question ',
    wrongMethod:'This method is not allowed'
  };

  
  export default async function handler(
    req : NextApiRequest,
    res: NextApiResponse
  ):Promise<void> {
    if (req.method !== "POST") {
      res.status(405).send(msg.wrongMethod);
      return;
    }
    const {content,opt1,opt2,opt3,opt4,opt5,rightAnswer,rightAnswer2} = req.body;
    const kind = "situations"
    // as properties have the same name we don't have to repeat them

    const question = new Situation({
      kind,
      content,
      opt1,
      opt2,
      opt3,
      opt4,
      opt5,
      rightAnswer,
      rightAnswer2
      
    })
    try {
      connectToDB();
      await question.save();
      res.status(200).json(msg.success)
    } catch (error:any) {
      console.error("Error saving question:", error.message);
      res.status(500).json({ error: msg.failure });
    }
  
  } 
  
  