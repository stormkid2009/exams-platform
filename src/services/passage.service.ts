
import {Passage} from "src/models/questions/passage.model";
import {PassageFormData} from "src/shared/schemas/passage.schema";
import { logApiError } from "src/helpers/logger";
import connectToDB from "src/lib/mongooseClient";

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
            const {passage, relatedQuestions} = data;
            
            // Create the question object
            const question = new Passage({
                type: "RC",
                passage,
                relatedQuestions
            });

            await connectToDB();
            await question.save();

            return {
                success: true,
            };

        } catch (error) {
            if (error instanceof Error) {
                logApiError(
                    "Failed to create Passage question",
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