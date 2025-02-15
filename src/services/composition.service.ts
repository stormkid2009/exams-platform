import connectToDB from "src/lib/mongooseClient";
import { Composition } from "src/models/questions/composition.model";
import { logError } from "src/helpers/logger";
import { CompositionFormData } from "src/shared/schemas/composition.schema";

export interface CompositionServiceResponse {
  success: boolean;
  error?: {
    message: string;
    code: number;
    details?: string;
  };
}

export class CompositionService {
  static async createQuestion(
    data: CompositionFormData,
    contextInfo: { path: string; method: string }
  ): Promise<CompositionServiceResponse> {
    try {
      const { content, a, b, answer } = data;
      const question = new Composition({
        type: "Open-Ended",
        content,
        elements: [a, b],
        answer,
      });

      await connectToDB();
      await question.save();

      return {
        success: true,
      };
    } catch (error) {
      // Log the error for debugging
      await logError(
        "Failed to create Composition question",
        error instanceof Error ? error : new Error("Unknown error")
      );

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
