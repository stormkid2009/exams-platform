import { Passage } from "src/models/questions/passage.model";
import { PassageFormData } from "src/shared/schemas/passage.schema";
import { type PassageDoc } from "src/shared/schemas/passage.document";
import { toPassageDoc } from "src/shared/schemas/transforms";
import { logError } from "src/utils/logger";
import connectToDB from "src/lib/mongoose-client";
import { FilterQuery } from "mongoose";
/**
 * Represents the response structure for PassageService methods.
 */

// Enum for error codes for more structured error handling
export enum ServiceErrorCodes {
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500
};

export interface PassageServiceResponse<T = null>{
  success: boolean;
  data?:T;
  error?: {
    message: string;
    code: number;
    details?: string;
  };
}

/**
 * PassageService handles operations related to Passage questions.
 */
export class PassageService {
  /**
   * Get a random Grammaire question with optional filtering using aggregation
   */
  static async getRandomQuestion(
    filter: FilterQuery<PassageDoc> = {}
  ): Promise<PassageServiceResponse<PassageDoc>> {
    try {
      await connectToDB();

      // Use MongoDB aggregation for efficient random selection
      const [randomQuestion] = await Passage.aggregate([
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
        "Failed to retrieve random Passage question",
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
  
  /**
   * Creates a new Passage question.
   *
   * This method transforms the provided Passage form data into a Passage question entity,
   * sets up the related questions with appropriate schema transformations, connects to the database,
   * and attempts to save the created question record.
   *
   * @param data - The form data for creating a Passage question.
   * @param contextInfo - Additional context information such as API path and method.
   * @returns A promise that resolves to a PassageServiceResponse indicating success or error details.
   */
  static async createQuestion(
    data: PassageFormData,
    contextInfo: { path: string; method: string }
  ): Promise<PassageServiceResponse> {
    try {
      // Transform form data into the DB document shape.
      const questionData = toPassageDoc(data);

      // Create a new instance of a Passage question.
      const question = new Passage(questionData);

      // Establish a connection to the database.
      await connectToDB();

      // Save the newly created Passage question to the database.
      await question.save();

      // Return a successful response upon completion.
      return {
        success: true,
      };
    } catch (error) {
      // Log any error encountered during the process for debugging.
      await logError(
        "Failed to create Passage question",
        error instanceof Error ? error : new Error("Unknown error")
      );

      // Return a failure response with the error details.
      return {
        success: false,
        error: {
          message: "Failed to create question",
          code: 500,
          details: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }
}
