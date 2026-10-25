import { withDbMiddleware } from "src/middleware/db-middleware";
import { withAuth } from "src/middleware/auth-middleware";
import { NextApiRequest, NextApiResponse } from "next";
import { SituationService } from "src/services/situation.service";
import { ApiResponse } from "src/types/common";
import { logApiError } from "src/utils/logger";

/**
 * DELETE /api/questions/situation/[id]/delete
 *
 * Deletes a Situation question. Only the author may delete.
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> => {
  const user = await withAuth(req, res);
  if (!user) return;

  if (req.method !== "DELETE") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed",
      data: null,
      details: "Only DELETE method is allowed",
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
    const result = await SituationService.deleteQuestion(id, user.userId);
    if (!result.success) {
      await logApiError(
        "Failed to delete situation question",
        new Error(result.error!.message),
        { path: req.url ?? "", method: req.method ?? "", statusCode: result.error!.code }
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
      message: "Question deleted successfully",
      data: null,
    });
  } catch (error) {
    await logApiError(
      "Unexpected error in situation delete handler",
      error instanceof Error ? error : new Error("Unknown error"),
      { path: req.url ?? "", method: req.method ?? "", statusCode: 500 }
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
