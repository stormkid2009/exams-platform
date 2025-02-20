import { GrammaireFormData } from "src/shared/schemas/grammaire.schema";
import { Grammaire } from "src/models/questions/grammaire.model";
import { logError } from "src/utils/logger";
import connectToDB from "src/lib/mongoose-client";

export interface GrammaireServiceResponse {
  success: boolean;
  error?: {
    message: string;
    code: number;
    details?: string;
  };
}

export class GrammaireService {
  static async createQuestion(
    data: GrammaireFormData,
    contextInfo: { path: string; method: string }
  ): Promise<GrammaireServiceResponse> {
    try {
      const answer = [data.rightAnswer];
      const { a, b, c, d, content } = data;
      const question = new Grammaire({
        type: "MCQ",
        content,
        options: [a, b, c, d],
        rightAnswer: answer,
      });

      await connectToDB();
      await question.save();

      return {
        success: true,
      };
    } catch (error) {
      // Log the error for debugging
      await logError(
        "Failed to create Grammaire question",
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
