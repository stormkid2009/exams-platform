import connectToDB from "src/lib/mongooseClient";
import { Grammaire } from "src/models/questions/grammaire.model";
import { NextApiRequest, NextApiResponse } from "next";
import { Messages } from "src/types";
import { randomUUID } from "crypto";

let msg: Messages = {
  success: "Success to create new question",
  failure: "Failed to create new question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid request data"
};

// Type for the expected request body
type GrammaireRequestBody = {
  content: string;
  opt1: string;
  opt2: string;
  opt3: string;
  opt4: string;
  rightAnswer: number;
};

// Validate request body fields
function validateRequestBody(body: any): body is GrammaireRequestBody {
  return (
    typeof body.content === 'string' && body.content.trim().length > 0 &&
    typeof body.opt1 === 'string' && body.opt1.trim().length > 0 &&
    typeof body.opt2 === 'string' && body.opt2.trim().length > 0 &&
    typeof body.opt3 === 'string' && body.opt3.trim().length > 0 &&
    typeof body.opt4 === 'string' && body.opt4.trim().length > 0 &&
    typeof body.rightAnswer === 'number' && 
    body.rightAnswer >= 0 && 
    body.rightAnswer <= 3
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).send(msg.wrongMethod);
    return;
  }

  // Validate request body
  if (!validateRequestBody(req.body)) {
    res.status(400).json({ 
      error: msg.invalidData,
      details: "All fields are required. Options must be non-empty strings and rightAnswer must be a number between 0 and 3."
    });
    return;
  }

  const { content, opt1, opt2, opt3, opt4, rightAnswer } = req.body;

  // Transform the data to match GrammaireQuestion interface
  const question = new Grammaire({
    id: randomUUID(),
    type: "MCQ",
    content,
    options: [opt1, opt2, opt3, opt4],
    rightAnswers: [rightAnswer]
  });

  try {
    await connectToDB();
    await question.save();
    res.status(200).json(msg.success);
  } catch (error: any) {
    console.error("Error saving question:", error.message);
    res.status(500).json({ 
      error: msg.failure,
      details: error.message // Adding error details for better debugging
    });
  }
}
