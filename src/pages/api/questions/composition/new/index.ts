import { NextApiRequest, NextApiResponse } from "next";
import { CompositionService } from "src/services/composition.service";
import {
  compositionSchema,
  type CompositionFormData,
} from "src/shared/schemas/composition.schema";
import {
  validateBodyMiddleware,
  type ValidatedApiHandler,
} from "src/middleware/validate-body-middleware";
import { ApiResponse, Messages } from "src/types/common";
import { logApiError } from "src/utils/logger"; // Logging utility

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
 * API handler for creating a composition category question.
 *
 * This endpoint accepts POST requests and performs the following:
 *
 * 1. Retrieves the request URL and method.
 * 2. Checks that the request method is POST. If not, logs the error via logApiError and returns a 405 response.
 * 3. Invokes the CompositionService.createQuestion method with the validated request body.
 * 4. If the service returns an unsuccessful result, responds with the error code and details.
 * 5. If successful, responds with a 200 status and a success message.
 * 6. Catches unexpected errors, logs them, and returns a 500 response.
 *
 * @async
 * @function handler
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse<ApiResponse>} res - The API response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 *
 * @example
 * // Request example (POST):
 * {
 *   "questionText": "What is the primary theme of the text?",
 *   "choices": ["Love", "War", "Nature", "Power"],
 *   "correctAnswer": "Nature"
 * }
 */
const handler: ValidatedApiHandler<CompositionFormData> = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> => {
  const path = req.url || "/api/questions/category/openEnded";
  const method = req.method || "UNKNOWN";

  if (req.method !== "POST") {
    // Log error details when the request method is not allowed.
    await logApiError("Invalid request method", new Error(msg.wrongMethod), {
      path,
      method,
      statusCode: 405,
      requestBody: req.body,
    });

    // Respond with a 405 status code.
    return res.status(405).json({
      status: "error",
      message: msg.wrongMethod,
      data: null,
      details: "Only POST method is allowed",
    });
  }

  try {
    // Execute the composition question creation service.
    const result = await CompositionService.createQuestion(req.body, {
      path,
      method,
    });

    if (!result.success) {
      // Log and return the error if the service did not succeed.
      console.log(result.error);
      return res.status(result.error!.code).json({
        status: "error",
        message: result.error!.message,
        data: null,
        details: result.error!.details,
      });
    }

    // Respond with a successful status if the question was created.
    return res.status(200).json({
      status: "success",
      message: msg.success,
      data: null,
    });
  } catch (error) {
    // Log unexpected errors and return an internal server error response.
    await logApiError(
      "Unexpected error in composition handler",
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

// Export the handler wrapped with a middleware that validates the request body
// against the composition schema.
export default validateBodyMiddleware(compositionSchema)(handler);
