import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { z } from "zod";
import { logApiError } from "src/utils/logger";
import { ApiResponse } from "src/types/common";

/*


interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  details: any;
}
*/

export function validateBodyMiddleware(schema: z.ZodSchema) {
  return function (handler: NextApiHandler) {
    return async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
      try {
        const validatedData = schema.parse(req.body);
        // Attach the validated data to the request
        (req as any).validatedBody = validatedData;
        return handler(req, res);
      } catch (error) {
        if (error instanceof z.ZodError) {
          logApiError("Validation Error", error, {
            path: req.url || "/unknown",
            method: req.method || "UNKNOWN",
            statusCode: 400,
            requestBody: req.body,
          });

          return res.status(400).json({
            status: "error",
            message: "Validation failed",
            data: null,
            details: error.message,
          });
        }

        // For unexpected errors
        logApiError(
          "Unexpected Validation Error",
          error instanceof Error
            ? error
            : new Error("Unknown validation error"),
          {
            path: req.url || "/unknown",
            method: req.method || "UNKNOWN",
            statusCode: 500,
            requestBody: req.body,
          }
        );

        return res.status(500).json({
          status: "error",
          message: "Internal server error",
          data: null,
          details: "An unexpected error occurred during validation",
        });
      }
    };
  };
}

// Add type for handlers that use validated body
export type ValidatedApiHandler<T> = (
  req: Omit<NextApiRequest, "body"> & { body: T },
  res: NextApiResponse<ApiResponse>
) => Promise<void>;
