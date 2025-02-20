import { Passage } from "src/models/questions/passage.model";
import { PassageFormData } from "src/shared/schemas/passage.schema";
import { logError } from "src/utils/logger";
import connectToDB from "src/lib/mongoose-client";

export interface PassageServiceResponse {
  success: boolean;
  error?: {
    message: string;
    code: number;
    details?: string;
  };
}

export class PassageService {
  static async createQuestion(
    data: PassageFormData,
    contextInfo: { path: string; method: string }
  ): Promise<PassageServiceResponse> {
    try {
      const { passage, relatedQuestions } = data;

      // Transform the relatedQuestions to match the schema
      const transformedQuestions = relatedQuestions.map((question) => ({
        type: "MCQ", // Ensure the type is set to MCQ
        content: question.content,
        options: [question.a, question.b, question.c, question.d], // Convert a, b, c, d to an options array
        rightAnswer: question.rightAnswer, // Keep the rightAnswer as is
      }));

      // Create the question object
      const question = new Passage({
        type: "RC",
        passage,
        relatedQuestions: transformedQuestions,
      });

      await connectToDB();
      await question.save();

      return {
        success: true,
      };
    } catch (error) {
      // Log the error for debugging
      await logError(
        "Failed to create Passage question",
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
