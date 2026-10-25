import { withDbMiddleware } from "src/middleware/db-middleware";
import { withAuth } from "src/middleware/auth-middleware";
import { NextApiRequest, NextApiResponse } from "next";
import { CompositionService } from "src/services/composition.service";
import { ApiResponse } from "src/types/common";
import { logApiError } from "src/utils/logger";

/**
 * PUT /api/questions/composition/[id]/update
 *
 * Updates a Composition question, only by its author.
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> => {
  const user = await withAuth(req, res);
  if (!user) return;

  if (req.method !== "PUT") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed",
      data: null,
      details: "Only PUT method is allowed",
    });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({
      status: "error",
      message: "Missing or invalid question id",
      data: null,
    });
  }

  try {
    const result = await CompositionService.updateQuestion(id, user.userId, req.body);
    if (!result.success) {
      await logApiError(
        "Failed to update composition question",
        new Error(result.error!.message),
        { path: req.url ?? "", method: req.method ?? "", statusCode: result.error!.code, requestBody: req.body }
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
      message: "Question updated successfully",
      data: result.data ?? null,
    });
  } catch (error) {
    await logApiError(
      "Unexpected error in composition update handler",
      error instanceof Error ? error : new Error("Unknown error"),
      { path: req.url ?? "", method: req.method ?? "", statusCode: 500, requestBody: req.body }
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
