import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { logApiError } from "src/utils/logger";
import type { ApiResponse } from "src/types/common";

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
 * @returns A middleware function that takes a validated handler and returns a Next.js handler.
 */
export function validateBodyMiddleware<T>(schema: z.ZodSchema<T>) {
  return (handler: ValidatedApiHandler<T>): NextApiHandler =>
    async (req, res) => {
      try {
        const validatedData = schema.parse(req.body);
        // Attach the validated data to the request for handlers that read it.
        (req as NextApiRequest & { validatedBody: T }).validatedBody =
          validatedData;
        (req as NextApiRequest & { body: T }).body = validatedData;
        return handler(req as NextApiRequest & { body: T }, res);
      } catch (error) {
        if (error instanceof z.ZodError) {
          await logApiError("Validation Error", error, {
            path: req.url || "/unknown",
            method: req.method || "UNKNOWN",
            statusCode: 400,
            requestBody: req.body,
          });

          return res.status(400).json({
            success: false,
            error: {
              message: "Validation failed",
              code: 400,
              details: error.message,
            },
          });
        }

        // For unexpected errors
        await logApiError(
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
          success: false,
          error: {
            message: "Internal server error",
            code: 500,
            details: "An unexpected error occurred during validation",
          },
        });
      }
    };
}

/**
 * Handler type for routes wrapped by {@link validateBodyMiddleware}: the body
 * has already been parsed and validated, so it is typed as `T` rather than
 * `unknown`.
 */
export type ValidatedApiHandler<T> = (
  req: NextApiRequest & { body: T },
  res: NextApiResponse<ApiResponse>
) => Promise<void>;
