import connectToDB from "src/lib/mongoose-client";
import { Composition } from "src/models/questions/composition.model";
import { logError } from "src/utils/logger";
import { CompositionFormData } from "src/shared/schemas/composition.schema";

/**
 * Represents the response structure for CompositionService methods.
 */
export interface CompositionServiceResponse {
  success: boolean;
  error?: {
    message: string;
    code: number;
    details?: string;
  };
}

/**
 * CompositionService handles operations related to Composition questions.
 */
export class CompositionService {
  /**
   * Creates a new Composition question.
   *
   * This method transforms the provided form data into a Composition question entity,
   * connects to the database, and attempts to save the new question record.
   * If an error occurs during processing, it logs the error and returns a failure response.
   *
   * @param data - The form data for creating a Composition question.
   * @param contextInfo - Additional context information such as API path and method.
   * @returns A promise that resolves to a CompositionServiceResponse indicating success or error details.
   */
  static async createQuestion(
    data: CompositionFormData,
    contextInfo: { path: string; method: string }
  ): Promise<CompositionServiceResponse> {
    try {
      // Destructure the necessary fields from the form data.
      const { content, a, b, answer } = data;

      // Create a new Composition question instance with the provided data.
      const question = new Composition({
        type: "Open-Ended",
        content,
        elements: [a, b],
        answer,
      });

      // Establish a connection to the database.
      await connectToDB();

      // Save the newly created question to the database.
      await question.save();

      // Return a successful response.
      return {
        success: true,
      };
    } catch (error) {
      // Log the error using the logger utility for debugging purposes.
      await logError(
        "Failed to create Composition question",
        error instanceof Error ? error : new Error("Unknown error")
      );

      // Return a failure response with error details.
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
