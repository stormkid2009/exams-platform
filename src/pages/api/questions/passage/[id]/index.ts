import { ensureError } from "src/utils/ensure-error";

import { withDbMiddleware } from "src/middleware/db-middleware";
import { withAuth } from "src/middleware/auth-middleware";
import { NextApiRequest, NextApiResponse } from "next";
import { PassageService } from "src/services/passage.service";
import { Messages, ApiResponse } from "src/types/common";
import { logApiError } from "src/utils/logger";

const msg: Messages = {
  success: "successfully retrieved passage question",
  failure: "failed to retrieve passage question",
  wrongMethod: "the method is not valid",
  invalidData: "the data is not valid",
} as const;

/**
 * GET /api/questions/passage/[id]
 *
 * Returns a single Passage question by its MongoDB `_id`.
 * Requires a valid JWT, matching the protection level of `.../random`.
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> => {
  const user = await withAuth(req, res);
  if (!user) return;

  const path = req.url || "/api/questions/passage/[id]";
  const method = req.method || "UNKNOWN";

  if (method !== "GET") {
    await logApiError("invalid request method", new Error(msg.wrongMethod), {
      path,
      method,
      statusCode: 405,
    });
    return res.status(405).json({
      status: "error",
      message: msg.wrongMethod,
      data: null,
      details: "Only GET method is allowed",
    });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({
      status: "error",
      message: msg.invalidData,
      data: null,
      details: "Missing or invalid question id",
    });
  }

  try {
    const result = await PassageService.getQuestionById(id);

    if (!result.success) {
      await logApiError(
        "Failed to retrieve passage question by id",
        new Error(result.error?.message || msg.failure),
        {
          path,
          method,
          statusCode: result.error?.code || 500,
        }
      );

      return res.status(result.error?.code || 500).json({
        status: "error",
        message: result.error?.message || msg.failure,
        data: null,
        details: result.error?.details || "Could not retrieve the question",
      });
    }

    return res.status(200).json({
      status: "success",
      message: msg.success,
      data: result.data,
    });
  } catch (error) {
    await logApiError(
      "unexpected error in passage by-id handler",
      ensureError(error),
      {
        path,
        method,
        statusCode: 500,
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

export default withDbMiddleware(handler);
