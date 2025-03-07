import { FilterQuery } from "mongoose";
import { GrammaireQuestion } from "src/types/questions";
import { GrammaireFormData } from "src/shared/schemas/grammaire.schema";
import { Grammaire } from "src/models/questions/grammaire.model";
import { logError } from "src/utils/logger";
import connectToDB from "src/lib/mongoose-client";

/**
 * Represents the response structure for GrammaireService methods.
 */

// Enum for error codes for more structured error handling
export enum ServiceErrorCodes {
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500
}
export interface GrammaireServiceResponse<T = null> {
  success: boolean;
  data?:T;
  error?: {
    message: string;
    code: ServiceErrorCodes;
    details?: string;
  };
}

/**
 * GrammaireService handles operations related to Grammaire questions.
 */
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
  /**
   * Creates a new Grammaire question.
   *
   * This method transforms the provided form data into a Grammaire question entity,
   * establishes a connection to the database, and attempts to save the new question record.
   * It returns a response indicating whether the operation was successful or if an error occurred.
   *
   * @param data - The form data for creating a Grammaire question.
   * @param contextInfo - Additional context information such as API path and method.
   * @returns A promise that resolves to a GrammaireServiceResponse indicating success or error details.
   */
  static async createQuestion(
    data: GrammaireFormData,
    contextInfo: { path: string; method: string }
  ): Promise<GrammaireServiceResponse> {
    try {
      // Convert the right answer into an array format.
      const answer = [data.rightAnswer];
      // Destructure the form data to extract options and content.
      const { a, b, c, d, content } = data;
      // Create a new instance of a Grammaire question using the provided form data.
      const question = new Grammaire({
        type: "MCQ",
        content,
        options: [a, b, c, d],
        rightAnswer: answer,
      });

      // Establish a connection to the database.
      await connectToDB();
      // Save the newly created question document to the database.
      await question.save();

      // Return a successful response.
      return {
        success: true,
      };
    } catch (error) {
      // Log the error using the logger utility for debugging purposes.
      await logError(
        "Failed to create Grammaire question",
        error instanceof Error ? error : new Error("Unknown error")
      );

      // Return a failure response with error details for further handling.
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
