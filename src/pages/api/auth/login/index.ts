import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "src/models/user/user.model";
import connectToDB from "src/lib/mongoose-client";
import jwt from "jsonwebtoken";

/**
 * API handler for user login.
 *
 * @param {NextApiRequest} req - The HTTP request object containing user credentials.
 * @param {NextApiResponse} res - The HTTP response object used to send responses.
 *
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 *
 * @throws {Error} - Throws an error if there is an internal server issue.
 *
 * Possible responses:
 * - 200: Login successful with token and user information.
 * - 400: Bad request if email or password is missing.
 * - 401: Unauthorized if credentials are invalid.
 * - 405: Method not allowed if the request method is not POST.
 * - 500: Internal server error if an unexpected error occurs.
 */

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDB();

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success with token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
