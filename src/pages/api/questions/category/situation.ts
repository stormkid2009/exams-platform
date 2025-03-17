/**
 * @file situation.ts
 * @description API endpoint for creating new situation questions.
 *
 * This module defines an HTTP POST endpoint. It validates the request body,
 * attempts to create a situation question via the SituationService, logs errors,
 * and returns the appropriate JSON response.
 */

import {
  validateBodyMiddleware,
  type ValidatedApiHandler,
} from "src/middleware/validate-body-middleware";
import { NextApiRequest, NextApiResponse } from "next";
import { Messages, ApiResponse } from "src/types/common";
import {
  situationSchema,
  type SituationFormData,
} from "src/shared/schemas/situation.schema";
import { SituationService } from "src/services/situation.service";
import { logApiError } from "src/utils/logger"; // Import the logging utility

/**
 * Response messages for the API endpoint.
 */
const msg: Messages = {
  success: "Success to create new question",
  failure: "Failed to create new question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid question data provided",
} as const;

/**
 * API handler for creating a situation question.
 *
 * @param {NextApiRequest} req - The incoming API request.
 * @param {NextApiResponse<ApiResponse>} res - The API response to be sent.
 * @returns {Promise<void>} A response object with status, message, data, and details.
 *
 * @throws Logs errors with context if the request method is invalid or if any error
 * occurs during processing the creation of the question.
 */
const handler: ValidatedApiHandler<SituationFormData> = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) => {
  const path = req.url || "/api/questions/category/situation";
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
    // Attempt to create a new situation question
    const result = await SituationService.createQuestion(req.body, {
      path,
      method,
    });

    // If the creation did not succeed, log the error and return the appropriate response.
    if (!result.success) {
      await logApiError(
        "Failed to create situation question",
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
      "Unexpected error in situation handler",
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

/**
 * Exports the validated API handler wrapped with the validateBodyMiddleware.
 *
 * The middleware applies the situationSchema to validate incoming request bodies.
 */
export default validateBodyMiddleware(situationSchema)(handler);
