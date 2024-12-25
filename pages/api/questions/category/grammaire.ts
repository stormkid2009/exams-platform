import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import { logApiError } from "src/helpers/logger";
import { grammaireSchema, type GrammaireRequest } from "src/zodValidation/grammaireSchema";
import { validateBodyMiddleware, type ValidatedApiHandler } from "src/middleware/validateBodyMiddleware";
import { Grammaire } from "src/models/questions/grammaire.model";
import connectToDB from "src/lib/mongooseClient";
import { ApiResponse } from "src/types";

// Response messages
const msg = {
  success: "Success to create new question",
  failure: "Failed to create new question",
  wrongMethod: "This method is not allowed",
} as const;



const handler: ValidatedApiHandler<GrammaireRequest> = async (
  req: NextApiRequest, 
  res: NextApiResponse<ApiResponse>
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ 
      status: "error",
      message: msg.wrongMethod,
      data: null,
      details: "Only POST method is allowed"
    });
  }

  try {
    const { content, options, rightAnswer } = req.body;

    const question = new Grammaire({
      id: randomUUID(),
      type: "MCQ",
      content,
      options,
      rightAnswers: [rightAnswer]
    });

    await connectToDB();
    await question.save();
    
    return res.status(200).json({ 
      status: "success",
      message: msg.success,
      data: { questionId: question.id },
      details: null
    });
  } catch (error) {
    if (error instanceof Error) {
      // Log the error with API context
      logApiError(
        "Failed to create grammar question",
        error,
        {
          path: req.url || '/api/questions/category/grammaire',
          method: req.method,
          statusCode: error.name === "MongoNetworkError" ? 503 : 500,
          requestBody: req.body
        }
      );

      if (error.name === "MongoNetworkError") {
        return res.status(503).json({ 
          status: "error",
          message: "Service Unavailable",
          data: null,
          details: "Database connection error, please try again later."
        });
      }
      
      return res.status(500).json({ 
        status: "error",
        message: msg.failure,
        data: null,
        details: error.message
      });
    }

    // For unknown errors
    logApiError(
      "Unknown error occurred",
      new Error("Unknown error"),
      {
        path: req.url || '/api/questions/category/grammaire',
        method: req.method,
        statusCode: 500,
        requestBody: req.body
      }
    );

    return res.status(500).json({ 
      status: "error",
      message: msg.failure,
      data: null,
      details: "An unexpected error occurred"
    });
  }
};

export default validateBodyMiddleware(grammaireSchema)(handler);