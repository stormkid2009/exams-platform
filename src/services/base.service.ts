import type { FilterQuery, Model } from "mongoose";
import { isValidObjectId } from "mongoose";
import { ensureError } from "src/utils/ensure-error";
import { logError } from "src/utils/logger";

/**
 * Error codes shared by every question service.
 */
export enum ServiceErrorCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  INTERNAL_ERROR = 500,
}

/**
 * Structured error returned by a service.
 */
export interface ServiceError {
  message: string;
  code: ServiceErrorCodes;
  details?: string;
}

/**
 * Result shape shared by every question service.
 */
export interface ServiceResponse<T = null> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}

/**
 * Operations exposed by every question type.
 *
 * `TDoc` is the MongoDB document shape, `TForm` is the validated form shape.
 */
export interface QuestionService<TDoc, TForm> {
  getRandomQuestion(filter?: FilterQuery<TDoc>): Promise<ServiceResponse<TDoc>>;
  getQuestionById(id: string): Promise<ServiceResponse<TDoc>>;
  createQuestion(data: TForm, authorId: string): Promise<ServiceResponse>;
  updateQuestion(
    id: string,
    authorId: string,
    data: TForm
  ): Promise<ServiceResponse<TDoc>>;
  deleteQuestion(id: string, authorId: string): Promise<ServiceResponse>;
}

/**
 * Configuration for {@link createQuestionService}.
 */
export interface QuestionServiceConfig<TDoc, TForm> {
  /** Mongoose model backing this question type. */
  model: Model<TDoc>;
  /** Maps validated form data to the document shape, embedding the author id. */
  toDocument: (data: TForm, authorId: string) => TDoc;
  /** Human-readable type name used in log messages (e.g. "Grammaire"). */
  label: string;
}

/** Builds a `NOT_FOUND` response for a missing question. */
function notFound<T>(): ServiceResponse<T> {
  return {
    success: false,
    error: {
      message: "No questions found",
      code: ServiceErrorCodes.NOT_FOUND,
    },
  };
}

/** Builds a `FORBIDDEN` response for ownership failures. */
function forbidden<T>(): ServiceResponse<T> {
  return {
    success: false,
    error: {
      message: "Forbidden: you are not the author of this question",
      code: ServiceErrorCodes.FORBIDDEN,
    },
  };
}

/** Builds an `INTERNAL_ERROR` response carrying the underlying message. */
function internalError<T>(message: string, error: unknown): ServiceResponse<T> {
  return {
    success: false,
    error: {
      message,
      code: ServiceErrorCodes.INTERNAL_ERROR,
      details: ensureError(error).message,
    },
  };
}

/**
 * Creates the CRUD/random operations for one question type.
 *
 * The four question verticals (grammaire, situation, composition, passage)
 * differ only in their Mongoose model, document mapper, and label; everything
 * else — `$sample`, ObjectId validation, ownership filters, logging — lives
 * here exactly once.
 *
 * @param config - Model, form-to-document mapper, and log label.
 * @returns A typed service object with the shared question operations.
 */
export function createQuestionService<TDoc extends object, TForm>({
  model,
  toDocument,
  label,
}: QuestionServiceConfig<TDoc, TForm>): QuestionService<TDoc, TForm> {
  return {
    /**
     * Returns one random question matching `filter`.
     */
    async getRandomQuestion(filter = {}) {
      try {
        const [randomQuestion] = await model.aggregate<TDoc>([
          { $match: filter },
          { $sample: { size: 1 } },
        ]);

        if (!randomQuestion) {
          return notFound<TDoc>();
        }

        return { success: true, data: randomQuestion };
      } catch (error) {
        await logError(
          `Failed to retrieve random ${label} question`,
          ensureError(error)
        );
        return internalError<TDoc>("Failed to retrieve random question", error);
      }
    },

    /**
     * Returns one question by its MongoDB `_id`.
     * Malformed ids yield `400`; missing documents yield `404`.
     */
    async getQuestionById(id) {
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
        const question = await model.findById(id).lean<TDoc>();

        if (!question) {
          return notFound<TDoc>();
        }

        return { success: true, data: question };
      } catch (error) {
        await logError(
          `Failed to retrieve ${label} question by id`,
          ensureError(error)
        );
        return internalError<TDoc>("Failed to retrieve question", error);
      }
    },

    /**
     * Creates a question, embedding the authenticated user's id as author.
     */
    async createQuestion(data, authorId) {
      try {
        const question = new model(toDocument(data, authorId));
        await question.save();
        return { success: true };
      } catch (error) {
        await logError(`Failed to create ${label} question`, ensureError(error));
        return internalError("Failed to create question", error);
      }
    },

    /**
     * Updates a question only when `authorId` matches the stored author.
     */
    async updateQuestion(id, authorId, data) {
      try {
        const updated = await model.findOneAndUpdate(
          { _id: id, authorId },
          { $set: toDocument(data, authorId) },
          { new: true, runValidators: true }
        );

        if (!updated) {
          return forbidden<TDoc>();
        }

        return { success: true, data: updated.toObject() as TDoc };
      } catch (error) {
        await logError(`Failed to update ${label} question`, ensureError(error));
        return internalError<TDoc>("Failed to update question", error);
      }
    },

    /**
     * Deletes a question only when `authorId` matches the stored author.
     */
    async deleteQuestion(id, authorId) {
      try {
        const result = await model.deleteOne({ _id: id, authorId });

        if (result.deletedCount === 0) {
          return forbidden();
        }

        return { success: true };
      } catch (error) {
        await logError(`Failed to delete ${label} question`, ensureError(error));
        return internalError("Failed to delete question", error);
      }
    },
  };
}
