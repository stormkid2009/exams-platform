import connectToDB from "src/lib/mongooseClient";
import { OpenEnded } from "src/models/questions/openEnded.model";
import { logError } from "src/helpers/logger";
import { OpenEndedFormData } from "src/shared/schemas/openEnded.schema";



export interface OpenEndedServiceResponse {
    success: boolean;
    error?: {
        message: string;
        code: number;
        details?: string;
    };
}

export class OpenEndedService {
    static async createQuestion(
        data: OpenEndedFormData,
        contextInfo: { path: string; method: string }
    ): Promise<OpenEndedServiceResponse> {
        try {
            const {content,a,b,answer} = data;
            const question = new OpenEnded({
                type: "Open-Ended",
                content,
                elements:[a, b],
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