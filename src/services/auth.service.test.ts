import { AuthService } from "./auth.service";
import { User } from "src/models/user/user.model";
import connectToDB from "src/lib/mongoose-client";
import jwt from "jsonwebtoken";

jest.mock("src/lib/mongoose-client", () => jest.fn());
jest.mock("src/models/user/user.model", () => ({
  User: {
    findOne: jest.fn(),
  },
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("AuthService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, JWT_SECRET: "test-secret" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("login", () => {
    it("returns error if JWT_SECRET is not set", async () => {
      delete process.env.JWT_SECRET;
      const result = await AuthService.login({
        email: "test@example.com",
        password: "password123",
      });
      expect(result).toEqual({
        success: false,
        statusCode: 500,
        message: "Internal server error",
      });
    });

    it("returns 401 for invalid email", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      const result = await AuthService.login({
        email: "unknown@example.com",
        password: "password123",
      });
      expect(result).toEqual({
        success: false,
        statusCode: 401,
        message: "Invalid credentials",
      });
    });

    it("returns 401 for invalid password", async () => {
      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.login({
        email: "test@example.com",
        password: "wrongpassword",
      });
      expect(result).toEqual({
        success: false,
        statusCode: 401,
        message: "Invalid credentials",
      });
    });

    it("returns success with token and userId on valid credentials", async () => {
      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("mocked-token");

      const result = await AuthService.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(connectToDB).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        token: "mocked-token",
        user: {
          userId: "user123",
          email: "test@example.com",
        },
      });
    });
  });
});
