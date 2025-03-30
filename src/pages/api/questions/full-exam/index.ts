//test for grammaire random question with best practice [validation and error logs]
import { NextApiRequest, NextApiResponse } from "next";
import { GrammaireService } from "src/services/grammaire.service";
import { ApiResponse, Messages } from "src/types/common";
import { logApiError } from "src/utils/logger"; // Assuming you have this utility

const msg: Messages = {
  success: "Successfully retrieved random grammar question",
  failure: "Failed to retrieve random grammar question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid request data provided",
} as const;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> => {
  const path = req.url || "/api/questions/grammaire/random";
  const method = req.method || "UNKNOWN";

  if (method !== "GET") {
    // Log the error if the request method is invalid
    await logApiError("Invalid request method", new Error(msg.wrongMethod), {
      path,
      method,
      statusCode: 405,
    });
    
    // Return a 405 Method Not Allowed response
    return res.status(405).json({
      status: "error",
      message: msg.wrongMethod,
      data: null,
      details: "Only GET method is allowed",
    });
  }

  try {
    const result = await GrammaireService.getRandomQuestion({});

    if (!result.success) {
      // Log the error details returned from the service
      await logApiError(
        "Failed to retrieve random grammar question",
        new Error(result.error?.message || msg.failure),
        {
          path,
          method,
          statusCode: result.error?.code || 500,
        }
      );
      
      // Respond with the appropriate error code, message, and details
      return res.status(result.error?.code || 500).json({
        status: "error",
        message: result.error?.message || msg.failure,
        data: null,
        details: result.error?.details || "Could not retrieve a random question",
      });
    }

    // On success, respond with a 200 status and the question data
    return res.status(200).json({
      status: "success",
      message: msg.success,
      data: result.data,
    });
  } catch (error) {
    // Log any unexpected errors using the logging utility
    await logApiError(
      "Unexpected error in random grammar question handler",
      error instanceof Error ? error : new Error("Unknown error"),
      {
        path,
        method,
        statusCode: 500,
      }
    );
    
    // Return a generic 500 Internal Server Error response
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      data: null,
      details: "An unexpected error occurred",
    });
  }
};

export default handler;
