import { Situation } from "src/models/questions/situation.model";
import { SituationFormData } from "src/shared/schemas/situation.schema";
import { logError } from "src/utils/logger";
import connectToDB from "src/lib/mongoose-client";

export interface SituationServiceResponse {
  success: boolean;
  error?: {
    message: string;
    code: number;
    details?: string;
  };
}

export class SituationService {
  static async createQuestion(
    data: SituationFormData,
    contextInfo: { path: string; method: string }
  ): Promise<SituationServiceResponse> {
    try {
      const { a, b, c, d, e, content, firstAnswer, secondAnswer } = data;

      // Create the question object
      const question = new Situation({
        type: "Multi-MCQ",
        content,
        options: [a, b, c, d, e],
        rightAnswers: [firstAnswer, secondAnswer],
      });

      await connectToDB();
      await question.save();

      return {
        success: true,
      };
    } catch (error) {
      // Log the error for debugging
      await logError(
        "Failed to create Situation question",
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
