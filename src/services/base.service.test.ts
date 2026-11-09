import type { Model } from "mongoose";
import {
  createQuestionService,
  ServiceErrorCodes,
  type ServiceResponse,
} from "src/services/base.service";

jest.mock("src/utils/logger", () => ({
  logError: jest.fn(),
}));

// Mongoose pulls in the MongoDB driver, which needs TextEncoder (absent in
// jsdom). The service only uses `isValidObjectId`, so stub just that.
jest.mock("mongoose", () => ({
  isValidObjectId: (id: string) => /^[a-f\d]{24}$/i.test(id),
}));

interface TestDoc {
  content: string;
  authorId: string;
}

interface TestForm {
  content: string;
}

/**
 * Builds a Mongoose-model-shaped mock with the methods `createQuestionService`
 * uses, so the shared logic can be tested without a database.
 *
 * @returns The mock model plus handles to its individual jest mocks.
 */
function createModelMock() {
  const save = jest.fn();
  const aggregate = jest.fn();
  const findById = jest.fn();
  const findOneAndUpdate = jest.fn();
  const deleteOne = jest.fn();

  // `new model(...)` is used by createQuestion, so the mock must be callable.
  const model = jest.fn().mockImplementation(() => ({ save }));

  Object.assign(model, {
    aggregate,
    findById,
    findOneAndUpdate,
    deleteOne,
  });

  return {
    model: model as unknown as Model<TestDoc>,
    aggregate,
    findById,
    findOneAndUpdate,
    deleteOne,
    save,
  };
}

const toDocument = (data: TestForm, authorId: string): TestDoc => ({
  ...data,
  authorId,
});

describe("createQuestionService", () => {
  const AUTHOR_ID = "user-1";
  const QUESTION_ID = "507f1f77bcf86cd799439011";

  let mocks: ReturnType<typeof createModelMock>;
  let service: ReturnType<typeof createQuestionService<TestDoc, TestForm>>;

  beforeEach(() => {
    jest.clearAllMocks();
    mocks = createModelMock();
    service = createQuestionService<TestDoc, TestForm>({
      model: mocks.model,
      toDocument,
      label: "Test",
    });
  });

  describe("getRandomQuestion", () => {
    it("returns the sampled document", async () => {
      const doc: TestDoc = { content: "q", authorId: AUTHOR_ID };
      mocks.aggregate.mockResolvedValue([doc]);

      await expect(service.getRandomQuestion()).resolves.toEqual({
        success: true,
        data: doc,
      });
      expect(mocks.aggregate).toHaveBeenCalledWith([
        { $match: {} },
        { $sample: { size: 1 } },
      ]);
    });

    it("returns 404 when the collection is empty", async () => {
      mocks.aggregate.mockResolvedValue([]);

      await expect(service.getRandomQuestion()).resolves.toEqual({
        success: false,
        error: {
          message: "No questions found",
          code: ServiceErrorCodes.NOT_FOUND,
        },
      });
    });

    it("returns 500 with details when the query throws", async () => {
      mocks.aggregate.mockRejectedValue(new Error("boom"));

      const result = await service.getRandomQuestion();

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ServiceErrorCodes.INTERNAL_ERROR);
      expect(result.error?.details).toBe("boom");
    });
  });

  describe("getQuestionById", () => {
    it("returns 400 for a malformed ObjectId", async () => {
      const result = await service.getQuestionById("not-an-id");

      expect(result).toEqual({
        success: false,
        error: {
          message: "Invalid question id",
          code: ServiceErrorCodes.BAD_REQUEST,
        },
      });
      expect(mocks.findById).not.toHaveBeenCalled();
    });

    it("returns the document when it exists", async () => {
      const doc: TestDoc = { content: "q", authorId: AUTHOR_ID };
      mocks.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(doc),
      });

      await expect(service.getQuestionById(QUESTION_ID)).resolves.toEqual({
        success: true,
        data: doc,
      });
    });

    it("returns 404 when no document matches", async () => {
      mocks.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await service.getQuestionById(QUESTION_ID);

      expect(result.error?.code).toBe(ServiceErrorCodes.NOT_FOUND);
    });
  });

  describe("createQuestion", () => {
    it("saves a document with the author id", async () => {
      mocks.save.mockResolvedValue(undefined);

      await expect(
        service.createQuestion({ content: "q" }, AUTHOR_ID)
      ).resolves.toEqual({ success: true });

      expect(mocks.model).toHaveBeenCalledWith({
        content: "q",
        authorId: AUTHOR_ID,
      });
      expect(mocks.save).toHaveBeenCalled();
    });

    it("returns 500 when saving fails", async () => {
      mocks.save.mockRejectedValue(new Error("duplicate"));

      const result = await service.createQuestion({ content: "q" }, AUTHOR_ID);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe(ServiceErrorCodes.INTERNAL_ERROR);
      expect(result.error?.details).toBe("duplicate");
    });
  });

  describe("updateQuestion", () => {
    it("returns the updated document", async () => {
      const doc: TestDoc = { content: "new", authorId: AUTHOR_ID };
      mocks.findOneAndUpdate.mockResolvedValue({
        toObject: () => doc,
      });

      await expect(
        service.updateQuestion(QUESTION_ID, AUTHOR_ID, { content: "new" })
      ).resolves.toEqual({ success: true, data: doc });

      expect(mocks.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: QUESTION_ID, authorId: AUTHOR_ID },
        { $set: { content: "new", authorId: AUTHOR_ID } },
        { new: true, runValidators: true }
      );
    });

    it("returns 403 when the caller does not own the question", async () => {
      mocks.findOneAndUpdate.mockResolvedValue(null);

      const result = await service.updateQuestion(
        QUESTION_ID,
        AUTHOR_ID,
        { content: "new" }
      );

      expect(result.error?.code).toBe(ServiceErrorCodes.FORBIDDEN);
    });
  });

  describe("deleteQuestion", () => {
    it("returns success when a document was deleted", async () => {
      mocks.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await expect(
        service.deleteQuestion(QUESTION_ID, AUTHOR_ID)
      ).resolves.toEqual({ success: true });
    });

    it("returns 403 when nothing matched the ownership filter", async () => {
      mocks.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const result: ServiceResponse = await service.deleteQuestion(
        QUESTION_ID,
        AUTHOR_ID
      );

      expect(result.error?.code).toBe(ServiceErrorCodes.FORBIDDEN);
    });
  });
});
