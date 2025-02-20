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
import { logApiError } from "src/utils/logger"; // Import the logging utility

// Response messages
const msg: Messages = {
  success: "Success to create new question",
  failure: "Failed to create new question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid question data provided",
} as const;

const handler: ValidatedApiHandler<CompositionFormData> = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) => {
  const path = req.url || "/api/questions/category/openEnded";
  const method = req.method || "UNKNOWN";

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
    const result = await CompositionService.createQuestion(req.body, {
      path,
      method,
    });

    if (!result.success) {
      // Log the error for debugging
      console.log(result.error);
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
      "Unexpected error in openEnded handler",
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

export default validateBodyMiddleware(compositionSchema)(handler);
