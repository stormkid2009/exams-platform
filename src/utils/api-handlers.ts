import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "src/middleware/auth-middleware";
import type { ValidatedApiHandler } from "src/middleware/validate-body-middleware";
import type { QuestionService, ServiceError } from "src/services/base.service";
import type { ApiResponse, Messages } from "src/types/common";
import { ensureError } from "src/utils/ensure-error";
import { logApiError } from "src/utils/logger";

/**
 * Handler signature for routes without a validated body (GET/DELETE).
 */
export type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) => Promise<void>;

const CREATE_MESSAGES: Messages = {
  success: "Success to create new question",
  failure: "Failed to create new question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid question data provided",
};

const READ_MESSAGES: Messages = {
  success: "Question retrieved successfully",
  failure: "Failed to retrieve question",
  wrongMethod: "This method is not valid",
  invalidData: "The data is not valid",
};

const UPDATE_MESSAGES: Messages = {
  success: "Question updated successfully",
  failure: "Failed to update question",
  wrongMethod: "This method is not allowed",
  invalidData: "Missing or invalid question id",
};

const DELETE_MESSAGES: Messages = {
  success: "Question deleted successfully",
  failure: "Failed to delete question",
  wrongMethod: "This method is not allowed",
  invalidData: "Missing or invalid question id",
};

/** Builds log context from the incoming request. */
function requestContext(req: NextApiRequest) {
  return {
    path: req.url || "/unknown",
    method: req.method || "UNKNOWN",
  };
}

/** Sends a 405 using the unified error envelope. */
function methodNotAllowed(
  res: NextApiResponse<ApiResponse>,
  message: string,
  details: string
): void {
  res.status(405).json({
    success: false,
    error: { message, code: 405, details },
  });
}

/** Sends a 400 using the unified error envelope. */
function badRequest(
  res: NextApiResponse<ApiResponse>,
  message: string,
  details: string
): void {
  res.status(400).json({
    success: false,
    error: { message, code: 400, details },
  });
}

/** Logs and sends a structured service error. */
async function respondWithServiceError(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  error: ServiceError | undefined,
  messages: Messages
): Promise<void> {
  const code = error?.code ?? 500;
  const message = error?.message || messages.failure;

  await logApiError(messages.failure, new Error(message), {
    ...requestContext(req),
    statusCode: code,
    requestBody: req.body,
  });

  res.status(code).json({
    success: false,
    error: { message, code, details: error?.details },
  });
}

/** Logs and sends a generic 500 for unexpected thrown values. */
async function respondWithUnexpectedError(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  error: unknown
): Promise<void> {
  await logApiError("Unexpected error in question handler", ensureError(error), {
    ...requestContext(req),
    statusCode: 500,
    requestBody: req.body,
  });

  res.status(500).json({
    success: false,
    error: {
      message: "Internal Server Error",
      code: 500,
      details: "An unexpected error occurred",
    },
  });
}

/**
 * Creates a `POST .../new` handler for a question service.
 * Responds with `201` on success.
 */
export function createNewQuestionHandler<TDoc, TForm>(
  service: QuestionService<TDoc, TForm>,
  overrides: Partial<Messages> = {}
): ValidatedApiHandler<TForm> {
  const messages = { ...CREATE_MESSAGES, ...overrides };

  return async (req, res) => {
    const user = await withAuth(req, res);
    if (!user) return;

    if (req.method !== "POST") {
      return methodNotAllowed(
        res,
        messages.wrongMethod,
        "Only POST method is allowed"
      );
    }

    try {
      const result = await service.createQuestion(req.body, user.userId);
      if (!result.success) {
        return respondWithServiceError(req, res, result.error, messages);
      }

      return res.status(201).json({ success: true, data: null });
    } catch (error) {
      return respondWithUnexpectedError(req, res, error);
    }
  };
}

/**
 * Creates a `GET .../random` handler for a question service.
 */
export function createRandomQuestionHandler<TDoc, TForm>(
  service: QuestionService<TDoc, TForm>,
  overrides: Partial<Messages> = {}
): ApiHandler {
  const messages = { ...READ_MESSAGES, ...overrides };

  return async (req, res) => {
    const user = await withAuth(req, res);
    if (!user) return;

    if (req.method !== "GET") {
      return methodNotAllowed(
        res,
        messages.wrongMethod,
        "Only GET method is allowed"
      );
    }

    try {
      const result = await service.getRandomQuestion({});
      if (!result.success) {
        return respondWithServiceError(req, res, result.error, messages);
      }

      return res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      return respondWithUnexpectedError(req, res, error);
    }
  };
}

/**
 * Creates a `GET .../[id]` handler for a question service.
 */
export function createQuestionByIdHandler<TDoc, TForm>(
  service: QuestionService<TDoc, TForm>,
  overrides: Partial<Messages> = {}
): ApiHandler {
  const messages = { ...READ_MESSAGES, ...overrides };

  return async (req, res) => {
    const user = await withAuth(req, res);
    if (!user) return;

    if (req.method !== "GET") {
      return methodNotAllowed(
        res,
        messages.wrongMethod,
        "Only GET method is allowed"
      );
    }

    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return badRequest(res, messages.invalidData, "Missing or invalid question id");
    }

    try {
      const result = await service.getQuestionById(id);
      if (!result.success) {
        return respondWithServiceError(req, res, result.error, messages);
      }

      return res.status(200).json({ success: true, data: result.data });
    } catch (error) {
      return respondWithUnexpectedError(req, res, error);
    }
  };
}

/**
 * Creates a `PUT .../[id]/update` handler for a question service.
 */
export function createUpdateQuestionHandler<TDoc, TForm>(
  service: QuestionService<TDoc, TForm>,
  overrides: Partial<Messages> = {}
): ValidatedApiHandler<TForm> {
  const messages = { ...UPDATE_MESSAGES, ...overrides };

  return async (req, res) => {
    const user = await withAuth(req, res);
    if (!user) return;

    if (req.method !== "PUT") {
      return methodNotAllowed(
        res,
        messages.wrongMethod,
        "Only PUT method is allowed"
      );
    }

    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return badRequest(res, messages.invalidData, "Missing or invalid question id");
    }

    try {
      const result = await service.updateQuestion(id, user.userId, req.body);
      if (!result.success) {
        return respondWithServiceError(req, res, result.error, messages);
      }

      return res
        .status(200)
        .json({ success: true, data: result.data ?? null });
    } catch (error) {
      return respondWithUnexpectedError(req, res, error);
    }
  };
}

/**
 * Creates a `DELETE .../[id]/delete` handler for a question service.
 */
export function createDeleteQuestionHandler<TDoc, TForm>(
  service: QuestionService<TDoc, TForm>,
  overrides: Partial<Messages> = {}
): ApiHandler {
  const messages = { ...DELETE_MESSAGES, ...overrides };

  return async (req, res) => {
    const user = await withAuth(req, res);
    if (!user) return;

    if (req.method !== "DELETE") {
      return methodNotAllowed(
        res,
        messages.wrongMethod,
        "Only DELETE method is allowed"
      );
    }

    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return badRequest(res, messages.invalidData, "Missing or invalid question id");
    }

    try {
      const result = await service.deleteQuestion(id, user.userId);
      if (!result.success) {
        return respondWithServiceError(req, res, result.error, messages);
      }

      return res.status(200).json({ success: true, data: null });
    } catch (error) {
      return respondWithUnexpectedError(req, res, error);
    }
  };
}
