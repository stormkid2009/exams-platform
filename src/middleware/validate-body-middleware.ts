import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { z } from "zod";
import { logApiError } from "src/utils/logger";
import { ApiResponse } from "src/types/common";

/**
 * validateBodyMiddleware Function
 * 
 * This middleware function validates the request body against a specified Zod schema.
 * It is designed to be used in Next.js API routes to ensure that incoming request data
 * meets the defined validation criteria.
 * 
 * The middleware:
 * - Parses the request body using the provided Zod schema.
 * - Attaches the validated data to the request object.
 * - Handles validation errors by logging them and returning a 400 status response with error details.
 * - Catches unexpected errors and logs them, returning a 500 status response.
 * 
 * @param schema - A Zod schema used for validating the request body.
 * @returns A middleware function that takes a NextApiHandler and returns a new handler
 *          that includes request body validation.
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
