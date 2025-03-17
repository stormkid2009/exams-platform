import { Passage } from "src/models/questions/passage.model";
import { PassageFormData } from "src/shared/schemas/passage.schema";
import { logError } from "src/utils/logger";
import connectToDB from "src/lib/mongoose-client";

/**
 * Represents the response structure for PassageService methods.
 */
export interface PassageServiceResponse {
  success: boolean;
  error?: {
    message: string;
    code: number;
    details?: string;
  };
}

/**
 * PassageService handles operations related to Passage questions.
 */
export class PassageService {
  /**
   * Creates a new Passage question.
   *
   * This method transforms the provided Passage form data into a Passage question entity,
   * sets up the related questions with appropriate schema transformations, connects to the database,
   * and attempts to save the created question record.
   *
   * @param data - The form data for creating a Passage question.
   * @param contextInfo - Additional context information such as API path and method.
   * @returns A promise that resolves to a PassageServiceResponse indicating success or error details.
   */
  static async createQuestion(
    data: PassageFormData,
    contextInfo: { path: string; method: string }
  ): Promise<PassageServiceResponse> {
    try {
      // Destructure the necessary fields from the passage form data.
      const { passage, relatedQuestions } = data;

      // Transform the relatedQuestions to match the expected schema.
      const transformedQuestions = relatedQuestions.map((question) => ({
        type: "MCQ", // Set the type to MCQ for multiple-choice questions.
        content: question.content,
        options: [question.a, question.b, question.c, question.d], // Create the options array from individual options.
        rightAnswer: question.rightAnswer, // Keep the correct answer as provided in the form.
      }));

      // Create a new instance of a Passage question with the provided data.
      const question = new Passage({
        type: "RC", // RC denotes Reading Comprehension type question.
        passage,
        relatedQuestions: transformedQuestions,
      });

      // Establish a connection to the database.
      await connectToDB();

      // Save the newly created Passage question to the database.
      await question.save();

      // Return a successful response upon completion.
      return {
        success: true,
      };
    } catch (error) {
      // Log any error encountered during the process for debugging.
      await logError(
        "Failed to create Passage question",
        error instanceof Error ? error : new Error("Unknown error")
      );

      // Return a failure response with the error details.
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
