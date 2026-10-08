import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import connectToDB from "src/lib/mongoose-client";
import { logApiError } from "src/utils/logger";
import type { ApiResponse } from "src/types/common";

/**
 * Higher-order API middleware function that ensures a database connection is established
 * before executing the provided Next.js API route handler.
 *
 * @param handler - The Next.js API route handler function to wrap.
 * @returns A wrapped Next.js API route handler that automatically handles DB connection and failure logging.
 *
 * @example
 * export default withDbMiddleware(async (req, res) => {
 *   // Database is guaranteed to be connected here
 * });
 */
export function withDbMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse<ApiResponse>): Promise<void> => {
    try {
      await connectToDB();
      return (await handler(req, res)) as unknown as void;
    } catch (error) {
      const path = req.url || "/unknown";
      const method = req.method || "UNKNOWN";

      await logApiError(
        "Database connection error in API route",
        error instanceof Error ? error : new Error("Failed to connect to database"),
        {
          path,
          method,
          statusCode: 500,
        }
      );

      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        data: null,
        details: "Database connection failed",
      });
    }
  };
}
