import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "src/middleware/auth-middleware";
import {
  createDeleteQuestionHandler,
  createNewQuestionHandler,
  createQuestionByIdHandler,
  createRandomQuestionHandler,
  createUpdateQuestionHandler,
} from "src/utils/api-handlers";
import type { QuestionService } from "src/services/base.service";
import { ServiceErrorCodes } from "src/services/base.service";
import type { ApiResponse } from "src/types/common";
import { logApiError } from "src/utils/logger";

jest.mock("src/middleware/auth-middleware", () => ({
  withAuth: jest.fn(),
}));

jest.mock("src/utils/logger", () => ({
  logApiError: jest.fn(),
}));

// `base.service` imports mongoose for `isValidObjectId`; the real driver needs
// TextEncoder, which jsdom does not provide.
jest.mock("mongoose", () => ({
  isValidObjectId: (id: string) => /^[a-f\d]{24}$/i.test(id),
}));

interface TestDoc {
  content: string;
}

interface TestForm {
  content: string;
}

const mockWithAuth = withAuth as jest.Mock;
const mockLogApiError = logApiError as jest.Mock;

const USER = { userId: "user-1", email: "user@example.com" };

/**
 * Builds a minimal `NextApiResponse` mock with chainable status/json.
 *
 * @returns The response mock and its jest handles.
 */
function createResMock() {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
}

/**
 * Builds a minimal `NextApiRequest` mock.
 *
 * @param overrides - Fields to merge into the default request.
 * @returns The request mock.
 */
function createReqMock(
  overrides: Partial<NextApiRequest> = {}
): NextApiRequest {
  return {
    url: "/api/questions/test",
    method: "POST",
    body: {},
    query: {},
    headers: {},
    ...overrides,
  } as unknown as NextApiRequest;
}

/**
 * Builds a service mock with all operations stubbed.
 *
 * @returns The service mock and its jest handles.
 */
function createServiceMock() {
  const service: QuestionService<TestDoc, TestForm> = {
    getRandomQuestion: jest.fn(),
    getQuestionById: jest.fn(),
    createQuestion: jest.fn(),
    updateQuestion: jest.fn(),
    deleteQuestion: jest.fn(),
  };
  return service;
}

describe("api-handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWithAuth.mockResolvedValue(USER);
  });

  describe("createNewQuestionHandler", () => {
    it("returns 201 and passes the body plus author id to the service", async () => {
      const service = createServiceMock();
      (service.createQuestion as jest.Mock).mockResolvedValue({
        success: true,
      });
      const req = createReqMock({ body: { content: "q" } });
      const res = createResMock();

      await createNewQuestionHandler(service)(
        req as NextApiRequest & { body: TestForm },
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(service.createQuestion).toHaveBeenCalledWith(
        { content: "q" },
        USER.userId
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it("returns 405 without calling the service on the wrong method", async () => {
      const service = createServiceMock();
      const req = createReqMock({ method: "GET" });
      const res = createResMock();

      await createNewQuestionHandler(service)(
        req as NextApiRequest & { body: TestForm },
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: "This method is not allowed",
          code: 405,
          details: "Only POST method is allowed",
        },
      });
      expect(service.createQuestion).not.toHaveBeenCalled();
    });

    it("writes no response when authentication fails", async () => {
      mockWithAuth.mockResolvedValue(null);
      const service = createServiceMock();
      const res = createResMock();

      await createNewQuestionHandler(service)(
        createReqMock() as NextApiRequest & { body: TestForm },
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("maps service errors to the unified envelope and logs them", async () => {
      const service = createServiceMock();
      (service.createQuestion as jest.Mock).mockResolvedValue({
        success: false,
        error: {
          message: "Invalid data",
          code: ServiceErrorCodes.BAD_REQUEST,
          details: "content required",
        },
      });
      const res = createResMock();

      await createNewQuestionHandler(service)(
        createReqMock({ body: { content: "" } }) as NextApiRequest & {
          body: TestForm;
        },
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: "Invalid data",
          code: 400,
          details: "content required",
        },
      });
      expect(mockLogApiError).toHaveBeenCalled();
    });

    it("returns 500 when the service throws", async () => {
      const service = createServiceMock();
      (service.createQuestion as jest.Mock).mockRejectedValue(
        new Error("unexpected")
      );
      const res = createResMock();

      await createNewQuestionHandler(service)(
        createReqMock() as NextApiRequest & { body: TestForm },
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: "Internal Server Error",
          code: 500,
          details: "An unexpected error occurred",
        },
      });
    });
  });

  describe("createRandomQuestionHandler", () => {
    it("returns the random question on GET", async () => {
      const service = createServiceMock();
      const doc: TestDoc = { content: "q" };
      (service.getRandomQuestion as jest.Mock).mockResolvedValue({
        success: true,
        data: doc,
      });
      const req = createReqMock({ method: "GET" });
      const res = createResMock();

      await createRandomQuestionHandler(service)(
        req,
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: doc });
    });

    it("rejects non-GET methods", async () => {
      const service = createServiceMock();
      const res = createResMock();

      await createRandomQuestionHandler(service)(
        createReqMock({ method: "POST" }),
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(res.status).toHaveBeenCalledWith(405);
      expect(service.getRandomQuestion).not.toHaveBeenCalled();
    });
  });

  describe("createQuestionByIdHandler", () => {
    it("returns 400 when the id query parameter is missing", async () => {
      const service = createServiceMock();
      const res = createResMock();

      await createQuestionByIdHandler(service)(
        createReqMock({ method: "GET", query: {} }),
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(service.getQuestionById).not.toHaveBeenCalled();
    });

    it("returns the question when the id is present", async () => {
      const service = createServiceMock();
      const doc: TestDoc = { content: "q" };
      (service.getQuestionById as jest.Mock).mockResolvedValue({
        success: true,
        data: doc,
      });
      const res = createResMock();

      await createQuestionByIdHandler(service)(
        createReqMock({ method: "GET", query: { id: "abc" } }),
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(service.getQuestionById).toHaveBeenCalledWith("abc");
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("createUpdateQuestionHandler", () => {
    it("returns the updated question on PUT", async () => {
      const service = createServiceMock();
      const doc: TestDoc = { content: "new" };
      (service.updateQuestion as jest.Mock).mockResolvedValue({
        success: true,
        data: doc,
      });
      const res = createResMock();

      await createUpdateQuestionHandler(service)(
        createReqMock({
          method: "PUT",
          query: { id: "abc" },
          body: { content: "new" },
        }) as NextApiRequest & { body: TestForm },
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(service.updateQuestion).toHaveBeenCalledWith(
        "abc",
        USER.userId,
        { content: "new" }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: doc });
    });

    it("returns 403 when the caller is not the author", async () => {
      const service = createServiceMock();
      (service.updateQuestion as jest.Mock).mockResolvedValue({
        success: false,
        error: {
          message: "Forbidden: you are not the author of this question",
          code: ServiceErrorCodes.FORBIDDEN,
        },
      });
      const res = createResMock();

      await createUpdateQuestionHandler(service)(
        createReqMock({ method: "PUT", query: { id: "abc" } }) as NextApiRequest & {
          body: TestForm;
        },
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("createDeleteQuestionHandler", () => {
    it("returns 200 on a successful delete", async () => {
      const service = createServiceMock();
      (service.deleteQuestion as jest.Mock).mockResolvedValue({
        success: true,
      });
      const res = createResMock();

      await createDeleteQuestionHandler(service)(
        createReqMock({ method: "DELETE", query: { id: "abc" } }),
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: null });
    });

    it("returns 405 for non-DELETE methods", async () => {
      const service = createServiceMock();
      const res = createResMock();

      await createDeleteQuestionHandler(service)(
        createReqMock({ method: "GET", query: { id: "abc" } }),
        res as unknown as NextApiResponse<ApiResponse>
      );

      expect(res.status).toHaveBeenCalledWith(405);
      expect(service.deleteQuestion).not.toHaveBeenCalled();
    });
  });
});
