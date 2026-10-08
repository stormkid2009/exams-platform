import type { NextApiRequest, NextApiResponse } from "next";
import { validateBodyMiddleware } from "src/middleware/validate-body-middleware";
import { withDbMiddleware } from "src/middleware/db-middleware";
import { authSchema } from "src/shared/schemas/auth.schema";
import { checkRateLimit } from "src/utils/rate-limit";
import { AuthService } from "src/services/auth.service";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ message: "Too many requests, please try again later." });
  }

  const result = await AuthService.login(req.body);

  if (!result.success) {
    return res.status(result.statusCode).json({ message: result.message });
  }

  res.status(200).json({
    message: "Login successful",
    token: result.token,
    user: result.user,
  });
}

export default withDbMiddleware(validateBodyMiddleware(authSchema)(handler));


