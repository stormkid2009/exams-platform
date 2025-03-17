/**
 * @file passages.ts
 * @description API endpoint for creating new passage questions.
 */

import { PassageService } from "src/services/passage.service";
import { NextApiRequest, NextApiResponse } from "next";
import {
  PassageFormData,
  passageSchema,
} from "src/shared/schemas/passage.schema";
import {
  validateBodyMiddleware,
  ValidatedApiHandler,
} from "src/middleware/validate-body-middleware";
import { Messages, ApiResponse } from "src/types/common";
import { logApiError } from "src/utils/logger"; // Import the logging utility

/**
 * Response messages for the API endpoint.
 */
const msg: Messages = {
  success: "Success to create new passage question",
  failure: "Failed to create new passage question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid request data",
} as const;

/**
 * API handler for creating a passage question.
 *
 * @param {NextApiRequest} req - The incoming API request.
 * @param {NextApiResponse<ApiResponse>} res - The API response to be sent.
 * @returns {Promise<void>} A response object with status, message, data, and details.
 *
 * @throws Logs errors with context if the request method is invalid or if any error occurs during
 * processing the creation of the question.
 */
const handler: ValidatedApiHandler<PassageFormData> = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) => {
  const path = req.url || "/api/questions/category/passage";
  const method = req.method || "UNKNOWN";

  // Only POST method is allowed for creating questions.
  if (req.method !== "POST") {
    // Log the error for debugging
    await logApiError("Invalid request method", new Error(msg.wrongMethod), {
      path,
      method,
      statusCode: 405,
      requestBody: req.body,
    });

    return res.status(405).json({
      status: "error",
      message: msg.wrongMethod,
      data: null,
      details: "Only POST method is allowed",
    });
  }

  try {
    // Attempt to create a new passage question
    const result = await PassageService.createQuestion(req.body, {
      path,
      method,
    });

    // If the creation did not succeed, log the error and return the appropriate response.
    if (!result.success) {
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

    // Return success response if the question is created successfully.
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

// Export the handler wrapped with the validateBodyMiddleware to validate incoming request bodies.
export default validateBodyMiddleware(passageSchema)(handler);
