import { Situation } from "src/models/questions/situation.model";
import { SituationFormData } from "src/shared/schemas/situation.schema";
import { logError } from "src/utils/logger";
import connectToDB from "src/lib/mongoose-client";
import { SituationQuestion } from "src/types/questions";
import { FilterQuery } from "mongoose";
/**
 * Represents the response structure for SituationService methods.
 */
export interface SituationServiceResponse <T = null>{
  success: boolean;
  data?:T;
  error?: {
    message: string;
    code: number;
    details?: string;
  };
}


export enum ServiceErrorCodes {
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500
}
/**
 * SituationService handles operations related to Situation questions.
 */
export class SituationService {
  
static async getRandomQuestion(
    filter: FilterQuery<SituationQuestion> = {}
  ): Promise<SituationServiceResponse<SituationQuestion>> {
    try {
      await connectToDB();

      // Use MongoDB aggregation for efficient random selection
      const [randomQuestion] = await Situation.aggregate([
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
        "Failed to retrieve random Situation question",
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
   * Creates a new Situation question.
   *
   * This method converts the provided Situation form data into a Situation question entity,
   * connects to the database, and attempts to save the newly created question record.
   * If an error occurs, it logs the error and returns a failure response.
   *
   * @param data - The form data required to create a Situation question.
   * @param contextInfo - Additional context such as API path and method.
   * @returns A promise that resolves to a SituationServiceResponse indicating success or error details.
   */
  static async createQuestion(
    data: SituationFormData,
    contextInfo: { path: string; method: string }
  ): Promise<SituationServiceResponse> {
    try {
      // Destructure form data for easier access to values.
      const { a, b, c, d, e, content, firstAnswer, secondAnswer } = data;

      // Create the Situation question object using provided form data.
      const question = new Situation({
        type: "Multi-MCQ",
        content,
        options: [a, b, c, d, e],
        rightAnswer: [firstAnswer, secondAnswer],
      });

      // Establish a connection to the database.
      await connectToDB();
      // Save the newly created question record to the database.
      await question.save();

      // Return a response indicating a successful operation.
      return {
        success: true,
      };
    } catch (error) {
      // Log the error for debugging purposes.
      await logError(
        "Failed to create Situation question",
        error instanceof Error ? error : new Error("Unknown error")
      );

      // Return a response indicating failure along with error details.
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
