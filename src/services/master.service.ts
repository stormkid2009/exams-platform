import { GrammaireQuestion } from "src/types/questions";
import { Grammaire } from "src/models/questions/grammaire.model";
import { logError } from "src/utils/logger";
import connectToDB from "src/lib/mongoose-client";
import { FilterQuery } from "mongoose";

// Enum for error codes for more structured error handling
export enum ServiceErrorCodes {
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500
}
  
export interface GrammaireServiceResponse<T = null> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: ServiceErrorCodes;
    details?: string;
  };
}

export class GrammaireService {
  /**
   * Get a random Grammaire question with optional filtering using aggregation
   */
  static async getRandomQuestion(
    filter: FilterQuery<GrammaireQuestion> = {}
  ): Promise<GrammaireServiceResponse<GrammaireQuestion>> {
    try {
      await connectToDB();

      // Use MongoDB aggregation for efficient random selection
      const [randomQuestion] = await Grammaire.aggregate([
        { $match: filter },
        { $sample: { size: 1 } }
      ]);

      if (!randomQuestion) {
        return {
          success: false,
          error: {
            message: "No questions found",
            code: ServiceErrorCodes.NOT_FOUND
          }
        };
      }

      return {
        success: true,
        data: randomQuestion
      };
    } catch (error) {
      await logError(
        "Failed to retrieve random Grammaire question",
        error instanceof Error ? error : new Error("Unknown error")
      );

      return {
        success: false,
        error: {
          message: "Failed to retrieve random question",
          code: ServiceErrorCodes.INTERNAL_ERROR,
          details: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }
}