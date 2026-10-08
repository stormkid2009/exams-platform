import type { NextApiRequest, NextApiResponse } from "next";
import { validateBodyMiddleware } from "src/middleware/validate-body-middleware";
import { withDbMiddleware } from "src/middleware/db-middleware";
import { authSchema } from "src/shared/schemas/auth.schema";
import { checkRateLimit } from "src/utils/rate-limit";
import { AuthService } from "src/services/auth.service";

const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)
  );
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ message: "Too many requests, please try again later." });
  }

  if (!isValidPassword(req.body.password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain both letters and numbers",
    });
  }

  const result = await AuthService.register(req.body);

  if (!result.success) {
    return res.status(result.statusCode).json({ message: result.message });
  }

  res.status(201).json({
    message: "Registration successful",
    token: result.token,
    user: result.user,
  });
}

export default withDbMiddleware(validateBodyMiddleware(authSchema)(handler));


