import connectToDB from "../../../../src/lib/mongooseClient";
import { Situation } from "../../../../src/models/questions/situations.model";
import { NextApiRequest,NextApiResponse } from "next";
import { Messages } from '../../../../src/types';


let msg: Messages = {
    success:'Success to create new question',
    failure:'Failed to create  new  question ',
    wrongMethod:'This method is not allowed'
  };
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method !== "POST") {
      res.status(405).send(msg.wrongMethod);
      return;
    }
    const {kind,content,opt1,opt2,opt3,opt4,opt5,rightAnswer,rightAnswer2} = req.body;
    const question = new Situation({
      kind:kind,
      content: content,
      opt1: opt1,
      opt2: opt2,
      opt3: opt3,
      opt4: opt4,
      opt5: opt5,
      rightAnswer: rightAnswer,
      rightAnswer2: rightAnswer2
      
    })
    try {
      connectToDB();
      await question.save();
      res.status(200).json(msg.success)
    } catch (error) {
      console.log(error);
      res.status(500).json(msg.failure)
    }
  
  } 
  
  