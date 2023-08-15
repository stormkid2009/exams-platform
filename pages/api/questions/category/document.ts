import type { NextApiRequest, NextApiResponse } from 'next'
import { Document } from '../../../../src/models/questions/document.model'
import connectToDB from '../../../../src/lib/mongooseClient'
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
  
  const question = new Document({
    kind:"document",
    texte:req.body.texte,
    subs:req.body.subs,
    
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

