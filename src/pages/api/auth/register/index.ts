import {
  validateBodyMiddleware,
  type ValidatedApiHandler,
} from "src/middleware/validate-body-middleware";
import { withDbMiddleware } from "src/middleware/db-middleware";
import {
  registerSchema,
  type RegisterFormData,
} from "src/shared/schemas/auth.schema";
import { checkRateLimit } from "src/utils/rate-limit";
import { AuthService } from "src/services/auth.service";

/**
 * POST /api/auth/register
 *
 * Returns `{ success: true, data: { token, user } }` on success and the
 * unified `{ success: false, error }` envelope on failure.
 */
const handler: ValidatedApiHandler<RegisterFormData> = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: { message: "Method not allowed", code: 405 },
    });
  }

  const ip =
    (req.headers["x-forwarded-for"] as string) ||
    req.socket.remoteAddress ||
    "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      success: false,
      error: {
        message: "Too many requests, please try again later.",
        code: 429,
      },
    });
  }

  const result = await AuthService.register(req.body);

  if (!result.success) {
    return res.status(result.statusCode).json({
      success: false,
      error: { message: result.message, code: result.statusCode },
    });
  }

  return res.status(201).json({
    success: true,
    data: { token: result.token, user: result.user },
  });
};

export default withDbMiddleware(validateBodyMiddleware(registerSchema)(handler));
