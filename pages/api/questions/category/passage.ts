import { PassageService } from "src/services/passage.service";
import { NextApiRequest, NextApiResponse } from "next";
import {
  PassageFormData,
  PassageSchema,
} from "src/shared/schemas/passage.schema";
import {
  validateBodyMiddleware,
  ValidatedApiHandler,
} from "src/middleware/validateBodyMiddleware";
import { Messages, ApiResponse } from "src/types/common";
import { logApiError } from "src/helpers/logger"; // Import the logging utility

// Response messages
const msg: Messages = {
  success: "Success to create new passage question",
  failure: "Failed to create new passage question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid request data",
} as const;


const handler: ValidatedApiHandler<PassageFormData> = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) => {
  const path = req.url || "/api/questions/category/passage";
  const method = req.method || "UNKNOWN";

  if (req.method !== "POST") {
    // Log the error for debugging
    await logApiError(
      "Invalid request method",
      new Error(msg.wrongMethod),
      {
        path,
        method,
        statusCode: 405,
        requestBody: req.body,
      }
    );

    return res.status(405).json({
      status: "error",
      message: msg.wrongMethod,
      data: null,
      details: "Only POST method is allowed",
    });
  }

  try {
    const result = await PassageService.createQuestion(req.body, {
      path,
      method,
    });

    if (!result.success) {
      // Log the error for debugging
      await logApiError(
        "Failed to create passage question",
        new Error(result.error!.message),
        {
          path,
          method,
          statusCode: result.error!.code,
          requestBody: req.body,
        }
      );

      return res.status(result.error!.code).json({
        status: "error",
        message: result.error!.message,
        data: null,
        details: result.error!.details,
      });
    }

    return res.status(200).json({
      status: "success",
      message: msg.success,
      data: null,
    });
  } catch (error) {
    // Log unexpected errors
    await logApiError(
      "Unexpected error in passage handler",
      error instanceof Error ? error : new Error("Unknown error"),
      {
        path,
        method,
        statusCode: 500,
        requestBody: req.body,
      }
    );

    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      data: null,
      details: "An unexpected error occurred",
    });
  }
};
// Export the handler wrapped with the validateBodyMiddleware
export default validateBodyMiddleware(PassageSchema)(handler);