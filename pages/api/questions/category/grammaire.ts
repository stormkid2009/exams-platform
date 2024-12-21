import connectToDB from "src/lib/mongooseClient";
import { Grammaire } from "src/models/questions/grammaire.model";
import { NextApiRequest, NextApiResponse } from "next";
import { Messages } from "src/types";
import { randomUUID } from "crypto";
import { validateRequestBody, grammaireSchema } from "src/helpers/validation"; // Import schema for validation
import { logError } from "src/helpers/logger"; // Centralized logging system

const msg: Messages = {
  success: "Success to create new question",
  failure: "Failed to create new question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid request data"
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ 
      status: "error",
      message: msg.wrongMethod,
      data: null,
      details: "Only POST method is allowed"
    });
    return;
  }

  // Validate request body using grammaireSchema
  try {
    if (!validateRequestBody(req.body, grammaireSchema)) {
      res.status(400).json({ 
        status: "error",
        message: msg.invalidData,
        data: null,
        details: "Request must include: content (string), options (array of 4 strings), and rightAnswer (number between 0-3)"
      });
      return;
    }
  } catch (validationError: any) {
    logError("Validation Error", validationError); // Log validation error
    res.status(400).json({
      status: "error",
      message: msg.invalidData,
      data: null,
      details: validationError.message
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
    await connectToDB(); // Ensure connectToDB manages connections efficiently
    await question.save();
    res.status(200).json({ 
      status: "success",
      message: msg.success,
      data: { questionId: question.id },
      details: null
    });
  } catch (error: any) {
    if (error.name === "MongoNetworkError") {
      logError("Database Connection Error", error); // Log database connection issues
      res.status(503).json({ 
        status: "error",
        message: "Service Unavailable",
        data: null,
        details: "Database connection error, please try again later."
      });
    } else {
      logError("Database Error", error); // Log general database errors
      res.status(500).json({ 
        status: "error",
        message: msg.failure,
        data: null,
        details: error.message
      });
    }
  }
}
