import { ensureError } from "src/utils/ensure-error";

import connectToDB from "src/lib/mongoose-client";
import { Composition } from "src/models/questions/composition.model";
import { logError } from "src/utils/logger";
import { CompositionFormData } from "src/shared/schemas/composition.schema";
import { type CompositionDoc } from "src/shared/schemas/composition.document";
import { toCompositionDoc } from "src/shared/schemas/transforms";
import { FilterQuery, isValidObjectId } from "mongoose";

// Enum for error codes for more structured error handling
export enum ServiceErrorCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  INTERNAL_ERROR = 500
};

/**
 * Represents the response structure for CompositionService methods.
 */
export interface CompositionServiceResponse<T = null> {
  success: boolean;
  data?:T;
  error?: {
    message: string;
    code: number;
    details?: string;
  };
}

/**
 * CompositionService handles operations related to Composition questions.
 */
export class CompositionService {

  /**
   * Get a random Composition question with optional filtering using aggregation
   */
  static async getRandomQuestion(
    filter: FilterQuery<CompositionDoc> = {}
  ): Promise<CompositionServiceResponse<CompositionDoc>> {
    try {
      //await connectToDB();

      // Use MongoDB aggregation for efficient random selection
      const [randomQuestion] = await Composition.aggregate([
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
        "Failed to retrieve random Composition question",
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
   * Get a single Composition question by its MongoDB `_id`.
   *
   * @param id - The document `_id` as a string.
   * @returns `400` for a malformed ObjectId, `404` when no document matches.
   */
  static async getQuestionById(
    id: string
  ): Promise<CompositionServiceResponse<CompositionDoc>> {
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
      const question = await Composition.findById(id).lean<CompositionDoc>();

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
        "Failed to retrieve Composition question by id",
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
   * Creates a new Composition question, storing the authorId from the JWT.
   *
   * @param data - The validated form data for the question.
   * @param contextInfo - API path and method for logging.
   * @param authorId - The MongoDB ObjectId (as string) of the authenticated user.
   */
  static async createQuestion(
    data: CompositionFormData,
    contextInfo: { path: string; method: string },
    authorId: string
  ): Promise<CompositionServiceResponse> {
    try {
      // Transform form data into the DB document shape, embedding authorId.
      const questionData = toCompositionDoc(data, authorId);

      // Create a new Composition question instance.
      const question = new Composition(questionData);

      // Establish a connection to the database.
      //await connectToDB();

      // Save the newly created question to the database.
      await question.save();

      // Return a successful response.
      return {
        success: true,
      };
    } catch (error) {
      // Log the error using the logger utility for debugging purposes.
      await logError(
        "Failed to create Composition question",
        ensureError(error)
      );

      // Return a failure response with error details.
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
   * Updates a Composition question, only if the caller is the original author.
   *
   * @param id - The MongoDB document _id of the question.
   * @param authorId - The userId from the JWT; must match the stored authorId.
   * @param data - The validated form data with updated values.
   */
  static async updateQuestion(
    id: string,
    authorId: string,
    data: CompositionFormData
  ): Promise<CompositionServiceResponse<CompositionDoc>> {
    try {
      const updateData = toCompositionDoc(data, authorId);

      const updated = await Composition.findOneAndUpdate(
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

      return { success: true, data: updated.toObject() as CompositionDoc };
    } catch (error) {
      await logError(
        "Failed to update Composition question",
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
   * Deletes a Composition question, only if the caller is the original author.
   *
   * @param id - The MongoDB document _id of the question.
   * @param authorId - The userId from the JWT; must match the stored authorId.
   */
  static async deleteQuestion(
    id: string,
    authorId: string
  ): Promise<CompositionServiceResponse> {
    try {
      const result = await Composition.deleteOne({ _id: id, authorId });

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
        "Failed to delete Composition question",
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
