import connectToDB from "src/lib/mongooseClient";
import { Grammaire } from "src/models/questions/grammaire.model";
import { NextApiRequest, NextApiResponse } from "next";
import { Messages } from "src/types";
import { randomUUID } from "crypto";

const msg: Messages = {
  success: "Success to create new question",
  failure: "Failed to create new question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid request data"
};

// Type for the expected request body
type GrammaireRequestBody = {
  content: string;
  options: [string, string, string, string];
  rightAnswer: number;
};

// Validate request body fields
function validateRequestBody(body: any): body is GrammaireRequestBody {
  return (
    typeof body.content === 'string' && 
    body.content.trim().length > 0 &&
    Array.isArray(body.options) &&
    body.options.length === 4 &&
    body.options.every((opt: any) => typeof opt === 'string' && opt.trim().length > 0) &&
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
    res.status(405).json({ 
      error: msg.wrongMethod,
      details: "Only POST method is allowed"
    });
    return;
  }

  // Validate request body
  if (!validateRequestBody(req.body)) {
    res.status(400).json({ 
      error: msg.invalidData,
      details: "Request must include: content (string), options (array of 4 strings), and rightAnswer (number between 0-3)"
    });
    return;
  }

  const { content, options, rightAnswer } = req.body;

  // Transform the data to match GrammaireQuestion interface
  const question = new Grammaire({
    id: randomUUID(),
    type: "MCQ",
    content,
    options,
    rightAnswers: [rightAnswer]
  });

  try {
    await connectToDB();
    await question.save();
    res.status(200).json({ 
      message: msg.success,
      questionId: question.id 
    });
  } catch (error: any) {
    console.error("Error saving question:", error.message);
    res.status(500).json({ 
      error: msg.failure,
      details: error.message
    });
  }
}
