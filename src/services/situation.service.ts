import { Situation } from "src/models/questions/situation.model";
import { SituationFormData } from "src/shared/schemas/situation.schema";
import { type SituationDoc } from "src/shared/schemas/situation.document";
import { toSituationDoc } from "src/shared/schemas/transforms";
import { logError } from "src/utils/logger";
import connectToDB from "src/lib/mongoose-client";
import { FilterQuery, isValidObjectId } from "mongoose";

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
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  INTERNAL_ERROR = 500
}

/**
 * SituationService handles operations related to Situation questions.
 */
export class SituationService {
  
  static async getRandomQuestion(
    filter: FilterQuery<SituationDoc> = {}
  ): Promise<SituationServiceResponse<SituationDoc>> {
    try {
      //await connectToDB();

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
   * Get a single Situation question by its MongoDB `_id`.
   *
   * @param id - The document `_id` as a string.
   * @returns `400` for a malformed ObjectId, `404` when no document matches.
   */
  static async getQuestionById(
    id: string
  ): Promise<SituationServiceResponse<SituationDoc>> {
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
      const question = await Situation.findById(id).lean<SituationDoc>();

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
        "Failed to retrieve Situation question by id",
        error instanceof Error ? error : new Error("Unknown error")
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
   * Creates a new Situation question, storing the authorId from the JWT.
   *
   * @param data - The validated form data for the question.
   * @param contextInfo - API path and method for logging.
   * @param authorId - The MongoDB ObjectId (as string) of the authenticated user.
   */
  static async createQuestion(
    data: SituationFormData,
    contextInfo: { path: string; method: string },
    authorId: string
  ): Promise<SituationServiceResponse> {
    try {
      // Transform form data into the DB document shape, embedding authorId.
      const questionData = toSituationDoc(data, authorId);

      // Create the Situation question object.
      const question = new Situation(questionData);

      // Establish a connection to the database.
      //await connectToDB();
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

  /**
   * Updates a Situation question, only if the caller is the original author.
   *
   * @param id - The MongoDB document _id of the question.
   * @param authorId - The userId from the JWT; must match the stored authorId.
   * @param data - The validated form data with updated values.
   */
  static async updateQuestion(
    id: string,
    authorId: string,
    data: SituationFormData
  ): Promise<SituationServiceResponse<SituationDoc>> {
    try {
      const updateData = toSituationDoc(data, authorId);

      const updated = await Situation.findOneAndUpdate(
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

      return { success: true, data: updated.toObject() as SituationDoc };
    } catch (error) {
      await logError(
        "Failed to update Situation question",
        error instanceof Error ? error : new Error("Unknown error")
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
   * Deletes a Situation question, only if the caller is the original author.
   *
   * @param id - The MongoDB document _id of the question.
   * @param authorId - The userId from the JWT; must match the stored authorId.
   */
  static async deleteQuestion(
    id: string,
    authorId: string
  ): Promise<SituationServiceResponse> {
    try {
      const result = await Situation.deleteOne({ _id: id, authorId });

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
        "Failed to delete Situation question",
        error instanceof Error ? error : new Error("Unknown error")
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
