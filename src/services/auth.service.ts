import connectToDB from "src/lib/mongoose-client";
import { User } from "src/models/user/user.model";
import jwt from "jsonwebtoken";
import { AuthFormData, UserResponse } from "src/shared/schemas/auth.schema";

export interface AuthServiceSuccess {
  success: true;
  token: string;
  user: UserResponse;
}

export interface AuthServiceError {
  success: false;
  statusCode: number;
  message: string;
}

export type AuthServiceResult = AuthServiceSuccess | AuthServiceError;

/**
 * Service encapsulating authentication operations (login and registration).
 */
export class AuthService {
  /**
   * Authenticates a user with email and password, returning a JWT token and user info.
   */
  static async login(data: AuthFormData): Promise<AuthServiceResult> {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined");
      return { success: false, statusCode: 500, message: "Internal server error" };
    }

    try {
      //await connectToDB();

      const user = await User.findOne({ email: data.email.toLowerCase() });
      if (!user) {
        return { success: false, statusCode: 401, message: "Invalid credentials" };
      }

      const isValidPassword = await user.comparePassword(data.password);
      if (!isValidPassword) {
        return { success: false, statusCode: 401, message: "Invalid credentials" };
      }

      const userId = user._id.toString();
      const token = jwt.sign(
        { userId, email: user.email },
        jwtSecret,
        { expiresIn: "24h" }
      );

      return {
        success: true,
        token,
        user: {
          userId,
          email: user.email,
        },
      };
    } catch (error) {
      console.error("Login error in AuthService:", error);
      return { success: false, statusCode: 500, message: "Internal server error" };
    }
  }

  /**
   * Registers a new user with email and password, returning a JWT token and user info.
   */
  static async register(data: AuthFormData): Promise<AuthServiceResult> {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined");
      return { success: false, statusCode: 500, message: "Internal server error" };
    }

    try {
      await connectToDB();

      const existingUser = await User.findOne({ email: data.email.toLowerCase() });
      if (existingUser) {
        return { success: false, statusCode: 409, message: "Email already registered" };
      }

      const user = new User({
        email: data.email.toLowerCase(),
        password: data.password,
      });

      await user.save();

      const userId = user._id.toString();
      const token = jwt.sign(
        { userId, email: user.email },
        jwtSecret,
        { expiresIn: "24h" }
      );

      return {
        success: true,
        token,
        user: {
          userId,
          email: user.email,
        },
      };
    } catch (error: any) {
      if (error?.code === 11000) {
        return { success: false, statusCode: 409, message: "Email already registered" };
      }
      console.error("Registration error in AuthService:", error);
      return { success: false, statusCode: 500, message: "Internal server error" };
    }
  }
}
