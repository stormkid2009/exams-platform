
import { GrammaireRequest } from "src/shared/schemas/grammaire.schema";
import { Grammaire } from "src/models/questions/grammaire.model";
import { logApiError } from "src/helpers/logger";
import connectToDB from "src/lib/mongooseClient";

export interface GrammaireServiceResponse {
    success: boolean;
    questionId?: string;
    error?: {
        message: string;
        code: number;
        details?: string;
    };
}

export class GrammaireService {
    static async createQuestion(
        data: GrammaireRequest,
        contextInfo: { path: string; method: string }
    ): Promise<GrammaireServiceResponse> {
        try {
            const question = new Grammaire({
                type: "MCQ",
                content: data.content,
                options: data.options,
                rightAnswers: [data.rightAnswers]
            });

            await connectToDB();
            await question.save();

            return {
                success: true,
                questionId: question.id
            };

        } catch (error) {
            if (error instanceof Error) {
                logApiError(
                    "Failed to create grammar question",
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