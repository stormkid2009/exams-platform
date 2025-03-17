import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "src/models/user/user.model";
import connectToDB from "src/lib/mongoose-client";
import jwt from "jsonwebtoken";

/**
 * The secret used to sign JSON Web Tokens.
 * In production, this should be set as an environment variable.
 */
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Validates an email address using a simple regular expression.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email has a valid format, false otherwise.
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password ensuring it is at least 8 characters long and
 * contains both letters and numbers.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password meets the criteria, false otherwise.
 */
const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)
  );
};

/**
 * API Route Handler for user registration.
 *
 * This endpoint handles HTTP POST requests to register a new user. It performs the following steps:
 *
 * 1. Connects to the MongoDB database.
 * 2. Validates that the request body contains both an email and a password.
 * 3. Validates the email format and password strength.
 * 4. Checks if a user with the given email already exists.
 * 5. Creates a new user (password hashing is performed by a mongoose pre-save hook).
 * 6. Generates a JWT token for the new user.
 * 7. Returns a successful response including the token and user details.
 *
 * @async
 * @param {NextApiRequest} req - The incoming HTTP request.
 * @param {NextApiResponse} res - The outgoing HTTP response.
 * @returns {Promise<void>} A promise that resolves once a response is sent.
 *
 * @example
 * // POST request body example:
 * {
 *   "email": "john@example.com",
 *   "password": "Password123"
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect to the MongoDB database
    await connectToDB();

    const { email, password } = req.body;

    // Validate input requirements - both email and password must be provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain both letters and numbers",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Create a new user.
    // Note: Password hashing will be handled by the pre-save middleware in the user model.
    const user = new User({
      email: email.toLowerCase(),
      password,
    });

    await user.save();

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return successful registration response
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        email: user.email,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
