import { ensureError } from "src/utils/ensure-error";

import { Passage } from "src/models/questions/passage.model";
import { PassageFormData } from "src/shared/schemas/passage.schema";
import { type PassageDoc } from "src/shared/schemas/passage.document";
import { toPassageDoc } from "src/shared/schemas/transforms";
import { logError } from "src/utils/logger";
import connectToDB from "src/lib/mongoose-client";
import { FilterQuery, isValidObjectId } from "mongoose";

/**
 * Represents the response structure for PassageService methods.
 */

// Enum for error codes for more structured error handling
export enum ServiceErrorCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
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
   * Get a random Passage question with optional filtering using aggregation
   */
  static async getRandomQuestion(
    filter: FilterQuery<PassageDoc> = {}
  ): Promise<PassageServiceResponse<PassageDoc>> {
    try {
      //await connectToDB();

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
        ensureError(error)
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
   * Get a single Passage question by its MongoDB `_id`.
   *
   * @param id - The document `_id` as a string.
   * @returns `400` for a malformed ObjectId, `404` when no document matches.
   */
  static async getQuestionById(
    id: string
  ): Promise<PassageServiceResponse<PassageDoc>> {
    if (!isValidObjectId(id)) {
      return {
        success: false,
        error: {
          message: "Invalid question id",
          code: ServiceErrorCodes.BAD_REQUEST,
        },
      };
    }

    try {
      const question = await Passage.findById(id).lean<PassageDoc>();

      if (!question) {
        return {
          success: false,
          error: {
            message: "No questions found",
            code: ServiceErrorCodes.NOT_FOUND,
          },
        };
      }

      return { success: true, data: question };
    } catch (error) {
      await logError(
        "Failed to retrieve Passage question by id",
        ensureError(error)
      );

      return {
        success: false,
        error: {
          message: "Failed to retrieve question",
          code: ServiceErrorCodes.INTERNAL_ERROR,
          details: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  /**
   * Creates a new Passage question, storing the authorId from the JWT.
   *
   * @param data - The validated form data for the question.
   * @param contextInfo - API path and method for logging.
   * @param authorId - The MongoDB ObjectId (as string) of the authenticated user.
   */
  static async createQuestion(
    data: PassageFormData,
    contextInfo: { path: string; method: string },
    authorId: string
  ): Promise<PassageServiceResponse> {
    try {
      // Transform form data into the DB document shape, embedding authorId.
      const questionData = toPassageDoc(data, authorId);

      // Create a new instance of a Passage question.
      const question = new Passage(questionData);

      // Establish a connection to the database.
      //await connectToDB();

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
        ensureError(error)
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

  /**
   * Updates a Passage question, only if the caller is the original author.
   *
   * @param id - The MongoDB document _id of the question.
   * @param authorId - The userId from the JWT; must match the stored authorId.
   * @param data - The validated form data with updated values.
   */
  static async updateQuestion(
    id: string,
    authorId: string,
    data: PassageFormData
  ): Promise<PassageServiceResponse<PassageDoc>> {
    try {
      const updateData = toPassageDoc(data, authorId);

      const updated = await Passage.findOneAndUpdate(
        { _id: id, authorId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return {
          success: false,
          error: {
            message: "Forbidden: you are not the author of this question",
            code: ServiceErrorCodes.FORBIDDEN,
          },
        };
      }

      return { success: true, data: updated.toObject() as PassageDoc };
    } catch (error) {
      await logError(
        "Failed to update Passage question",
        ensureError(error)
      );

      return {
        success: false,
        error: {
          message: "Failed to update question",
          code: ServiceErrorCodes.INTERNAL_ERROR,
          details: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  /**
   * Deletes a Passage question, only if the caller is the original author.
   *
   * @param id - The MongoDB document _id of the question.
   * @param authorId - The userId from the JWT; must match the stored authorId.
   */
  static async deleteQuestion(
    id: string,
    authorId: string
  ): Promise<PassageServiceResponse> {
    try {
      const result = await Passage.deleteOne({ _id: id, authorId });

      if (result.deletedCount === 0) {
        return {
          success: false,
          error: {
            message: "Forbidden: you are not the author of this question",
            code: ServiceErrorCodes.FORBIDDEN,
          },
        };
      }

      return { success: true };
    } catch (error) {
      await logError(
        "Failed to delete Passage question",
        ensureError(error)
      );

      return {
        success: false,
        error: {
          message: "Failed to delete question",
          code: ServiceErrorCodes.INTERNAL_ERROR,
          details: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }
}
