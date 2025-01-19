import connectToDB from "src/lib/mongooseClient";
import { OpenEnded } from "src/models/questions/openEnded.model";
import { logApiError } from "src/helpers/logger";
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
            const question = new OpenEnded({
                type: "Open-Ended",
                content: data.content,
                elements:data.elements,
                answer: data.answer,
            });

            await connectToDB();
            await question.save();

            return {
                success: true,
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