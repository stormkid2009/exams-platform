import connectToDB from "src/lib/mongooseClient";
import { Grammaire } from "src/models/questions/grammaire.model";
import { NextApiRequest, NextApiResponse } from "next";
import { Messages } from "src/types";

let msg: Messages = {
  success: "Success to create new question",
  failure: "Failed to create  new  question ",
  wrongMethod: "This method is not allowed",
};

// we specified the return type of the handler function as Promise<void> since it's an asynchronous function.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).send(msg.wrongMethod);
    return;
  }
  const {  content, opt1, opt2, opt3, opt4, rightAnswer } = req.body;
  const kind='grammaire';

  // as properties have the same name we don't have to repeat them
  const question = new Grammaire({
    kind,
    content,
    opt1,
    opt2,
    opt3,
    opt4,
    rightAnswer,
  });
  try {
    connectToDB();
    await question.save();
    // if u need the question object send it in the response
    //res.status(200).json(question);
    res.status(200).json(msg.success);
  } catch (error: any) {
    //Consider providing more informative error messages in the response when an error occurs.
   //This can be helpful during development and debugging.
    console.error("Error saving question:", error.message);
    res.status(500).json({ error: msg.failure });
  }
}
