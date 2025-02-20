// Now we can use the absolute path by adding baseUrl options to the tsconfig.json file

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

const msg: Messages = {
  success: "Success to create new question",
  failure: "Failed to create new question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid question data provided",
} as const;

const handler: ValidatedApiHandler<SituationFormData> = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) => {
  const path = req.url || "/api/questions/category/situation";
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
    const result = await SituationService.createQuestion(req.body, {
      path,
      method,
    });

    if (!result.success) {
      // Log the error for debugging
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

export default validateBodyMiddleware(situationSchema)(handler);
