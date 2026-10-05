import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "src/models/user/user.model";
import connectToDB from "src/lib/mongoose-client";
import jwt from "jsonwebtoken";
import { validateBodyMiddleware } from "src/middleware/validate-body-middleware";
import { authSchema } from "src/shared/schemas/auth.schema";
import { checkRateLimit } from "src/utils/rate-limit";

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

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    await connectToDB();

    const { email, password } = req.body;

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain both letters and numbers",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const user = new User({
      email: email.toLowerCase(),
      password,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        email: user.email,
        id: user._id,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default validateBodyMiddleware(authSchema)(handler);
