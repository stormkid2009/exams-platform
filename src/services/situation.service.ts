
import {Situation} from "src/models/questions/situation.model";
import {SituationFormData} from "src/shared/schemas/situation.schema";
import { logApiError } from "src/helpers/logger";
import connectToDB from "src/lib/mongooseClient";

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
            const {a, b, c, d, e,content, firstAnswer, secondAnswer} = data;
            
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
            if (error instanceof Error) {
                logApiError(
                    "Failed to create situation question",
                    error,
                    {
                        path: contextInfo.path,
                        method: contextInfo.method,
                        statusCode: error.name === "MongoNetworkError" ? 503 : 500,
                        requestBody: data
                    }
                );

                return {
                    success: false,
                    error: {
                        message: error.name === "MongoNetworkError" 
                            ? "Service Unavailable"
                            : "Failed to create question",
                        code: error.name === "MongoNetworkError" ? 503 : 500,
                        details: error.name === "MongoNetworkError"
                            ? "Database connection error, please try again later."
                            : error.message
                    }
                };
            }

            // Handle unknown errors
            logApiError(
                "Unknown error occurred",
                new Error("Unknown error"),
                {
                    path: contextInfo.path,
                    method: contextInfo.method,
                    statusCode: 500,
                    requestBody: data
                }
            );

            return {
                success: false,
                error: {
                    message: "Failed to create question",
                    code: 500,
                    details: "An unexpected error occurred"
                }
            };
        }
    }
}