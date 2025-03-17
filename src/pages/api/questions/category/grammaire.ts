import { NextApiRequest, NextApiResponse } from "next";
import { GrammaireService } from "src/services/grammaire.service";
import {
  grammaireSchema,
  type GrammaireFormData,
} from "src/shared/schemas/grammaire.schema";
import {
  validateBodyMiddleware,
  type ValidatedApiHandler,
} from "src/middleware/validate-body-middleware";
import { ApiResponse, Messages } from "src/types/common";
import { logApiError } from "src/utils/logger"; // Import the logging utility

/**
 * Constant response messages used for API responses.
 *
 * @constant {Messages}
 */
const msg: Messages = {
  success: "Success to create new question",
  failure: "Failed to create new question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid question data provided",
} as const;

/**
 * API handler for creating a "grammaire" category question.
 *
 * This endpoint accepts only POST requests and processes the request in the following steps:
 *
 * 1. Retrieves the request URL and HTTP method.
 * 2. Validates that the request method is POST. If not, logs the error via logApiError and returns a 405 response.
 * 3. Calls the GrammaireService.createQuestion function with the validated request body and request metadata.
 * 4. If the service returns an unsuccessful result, logs the error and responds with the relevant error code, message, and details.
 * 5. If the question creation is successful, returns a 200 response with a success message.
 * 6. Catches and logs any unexpected errors, returning a 500 Internal Server Error response.
 *
 * @async
 * @function handler
 * @param {NextApiRequest} req - The API request object containing the question data.
 * @param {NextApiResponse<ApiResponse>} res - The API response object for sending back results.
 * @returns {Promise<void>} A promise that resolves when the API response is sent.
 *
 * @example
 * // POST request body example:
 * {
 *   "questionText": "What is the grammatical role of the underlined word?",
 *   "choices": ["Subject", "Object", "Predicate", "Modifier"],
 *   "correctAnswer": "Subject"
 * }
 */
const handler: ValidatedApiHandler<GrammaireFormData> = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> => {
  const path = req.url || "/api/questions/category/grammaire";
  const method = req.method || "UNKNOWN";

  if (req.method !== "POST") {
    // Log the error if the request method is invalid.
    await logApiError("Invalid request method", new Error(msg.wrongMethod), {
      path,
      method,
      statusCode: 405,
      requestBody: req.body,
    });
    // Return a 405 Method Not Allowed response.
    return res.status(405).json({
      status: "error",
      message: msg.wrongMethod,
      data: null,
      details: "Only POST method is allowed",
    });
  }

  try {
    // Call the GrammaireService to create a new question with the validated request body.
    const result = await GrammaireService.createQuestion(req.body, {
      path,
      method,
    });

    if (!result.success) {
      // Log the error details returned from the service.
      await logApiError(
        "Failed to create grammaire question",
        new Error(result.error!.message),
        {
          path,
          method,
          statusCode: result.error!.code,
          requestBody: req.body,
        }
      );
      // Respond with the appropriate error code, message, and details.
      return res.status(result.error!.code).json({
        status: "error",
        message: result.error!.message,
        data: null,
        details: result.error!.details,
      });
    }

    // On success, respond with a 200 status and a success message.
    return res.status(200).json({
      status: "success",
      message: msg.success,
      data: null,
    });
  } catch (error) {
    // Log any unexpected errors using the logging utility.
    await logApiError(
      "Unexpected error in grammaire handler",
      error instanceof Error ? error : new Error("Unknown error"),
      {
        path,
        method,
        statusCode: 500,
        requestBody: req.body,
      }
    );
    // Return a generic 500 Internal Server Error response.
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      data: null,
      details: "An unexpected error occurred",
    });
  }
};

// Export the handler wrapped with a middleware that validates the request body against the grammaire schema.
export default validateBodyMiddleware(grammaireSchema)(handler);
