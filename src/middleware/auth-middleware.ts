import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

/** Decoded JWT payload attached to authenticated requests. */
export interface AuthUser {
  userId: string;
  email: string;
}

/**
 * Inline auth utility for use directly inside route handlers.
 *
 * Call this at the top of any handler that requires authentication.
 * On success it returns the decoded user payload.
 * On failure it writes a 401 response and returns `null` — the caller
 * must `return` immediately when `null` is received.
 *
 * @example
 * const user = await withAuth(req, res);
 * if (!user) return;
 */
export async function withAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AuthUser | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return null;
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    res.status(500).json({ success: false, message: "Internal server error" });
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
    return null;
  }
}
