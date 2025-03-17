import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "src/models/user/user.model";
import connectToDB from "src/lib/mongoose-client";
import jwt from "jsonwebtoken";

/**
 * The secret key used to sign JSON Web Tokens.
 * In production, this should be set as an environment variable.
 *
 * @constant {string}
 */
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * API handler for user login.
 *
 * This endpoint handles POST requests for user authentication. The steps are:
 *
 * 1. Check if the HTTP method is POST. If not, respond with a 405 Method Not Allowed.
 * 2. Connect to the MongoDB database.
 * 3. Validate that both email and password are provided in the request body.
 * 4. Look up the user by email (converted to lowercase for consistency).
 * 5. If the user is not found or the password is invalid, return a 401 Unauthorized response.
 * 6. If authentication succeeds, generate a JSON Web Token (JWT) valid for 24 hours.
 * 7. Respond with a 200 status and return the token along with basic user information.
 *
 * Possible responses:
 * - 200: Login successful with token and user information.
 * - 400: Bad request when required fields are missing.
 * - 401: Unauthorized when credentials are invalid.
 * - 405: Method not allowed if the HTTP method is not POST.
 * - 500: Internal server error if an unexpected error occurs.
 *
 * @async
 * @param {NextApiRequest} req - The HTTP request object containing user credentials.
 * @param {NextApiResponse} res - The HTTP response object for sending back results.
 * @returns {Promise<void>} A promise that resolves when the response has been sent.
 *
 * @example
 * // Request body example:
 * {
 *   "email": "john@example.com",
 *   "password": "Password123"
 * }
 *
 * // Successful response example:
 * {
 *   "message": "Login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "email": "john@example.com",
 *     "id": "606d1b5bb3a3c61134012345"
 *   }
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  // Only allow POST requests.
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect to the MongoDB database.
    await connectToDB();

    const { email, password } = req.body;

    // Validate that both email and password are provided.
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find the user by email (in lowercase for consistency).
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify the provided password.
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token valid for 24 hours.
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Respond with success, returning the token and basic user info.
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
