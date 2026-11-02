import { ensureError } from "src/utils/ensure-error";

import { FilterQuery, isValidObjectId } from "mongoose";
import { type GrammaireDoc } from "src/shared/schemas/grammaire.document";
import { GrammaireFormData } from "src/shared/schemas/grammaire.schema";
import { toGrammaireDoc } from "src/shared/schemas/transforms";
import { Grammaire } from "src/models/questions/grammaire.model";
import { logError } from "src/utils/logger";
import connectToDB from "src/lib/mongoose-client";

/**
 * Represents the response structure for GrammaireService methods.
 */

// Enum for error codes for more structured error handling
export enum ServiceErrorCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
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
    filter: FilterQuery<GrammaireDoc> = {}
  ): Promise<GrammaireServiceResponse<GrammaireDoc>> {
    try {
      //await connectToDB();

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
   * Get a single Grammaire question by its MongoDB `_id`.
   *
   * @param id - The document `_id` as a string.
   * @returns `400` for a malformed ObjectId, `404` when no document matches.
   */
  static async getQuestionById(
    id: string
  ): Promise<GrammaireServiceResponse<GrammaireDoc>> {
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
      const question = await Grammaire.findById(id).lean<GrammaireDoc>();

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
        "Failed to retrieve Grammaire question by id",
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
   * Creates a new Grammaire question, storing the authorId from the JWT.
   *
   * @param data - The validated form data for the question.
   * @param contextInfo - API path and method for logging.
   * @param authorId - The MongoDB ObjectId (as string) of the authenticated user.
   */
  static async createQuestion(
    data: GrammaireFormData,
    contextInfo: { path: string; method: string },
    authorId: string
  ): Promise<GrammaireServiceResponse> {
    try {
      // Transform form data into the DB document shape, embedding authorId.
      const questionData = toGrammaireDoc(data, authorId);
      // Create a new instance of a Grammaire question.
      const question = new Grammaire(questionData);

      // Establish a connection to the database.
      //await connectToDB();
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
        ensureError(error)
      );

      // Return a failure response with error details for further handling.
      return {
        success: false,
        error: {
          message: "Failed to create question",
          code: ServiceErrorCodes.INTERNAL_ERROR,
          details: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  /**
   * Updates a Grammaire question, only if the caller is the original author.
   *
   * @param id - The MongoDB document _id of the question.
   * @param authorId - The userId from the JWT; must match the stored authorId.
   * @param data - The validated form data with updated values.
   */
  static async updateQuestion(
    id: string,
    authorId: string,
    data: GrammaireFormData
  ): Promise<GrammaireServiceResponse<GrammaireDoc>> {
    try {
      const updateData = toGrammaireDoc(data, authorId);

      // findOneAndUpdate with authorId in the filter enforces ownership at DB level.
      const updated = await Grammaire.findOneAndUpdate(
        { _id: id, authorId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updated) {
        // Either the document doesn't exist or belongs to a different author.
        return {
          success: false,
          error: {
            message: "Forbidden: you are not the author of this question",
            code: ServiceErrorCodes.FORBIDDEN,
          },
        };
      }

      return { success: true, data: updated.toObject() as GrammaireDoc };
    } catch (error) {
      await logError(
        "Failed to update Grammaire question",
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
   * Deletes a Grammaire question, only if the caller is the original author.
   *
   * @param id - The MongoDB document _id of the question.
   * @param authorId - The userId from the JWT; must match the stored authorId.
   */
  static async deleteQuestion(
    id: string,
    authorId: string
  ): Promise<GrammaireServiceResponse> {
    try {
      // deleteOne with authorId in the filter enforces ownership at DB level.
      const result = await Grammaire.deleteOne({ _id: id, authorId });

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
        "Failed to delete Grammaire question",
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
