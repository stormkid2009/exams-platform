
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
            const {a, b, c, d, e,content, rightAnswers} = data;
            // Create an array of options and validate that all options are provided
            const options = [a, b, c, d, e];
            if (!options.every(Boolean)) {
                throw new Error("All options (a, b, c, d, e) must be provided.");
            }
            // Map the options to their indices
            const optionMapping = ['a', 'b', 'c', 'd', 'e'];

            // Extract indices of right answers
            const rightAnswerIndices = rightAnswers
                .filter((answer) => optionMapping.includes(answer)) // Validate rightAnswers
                .map((answer) => optionMapping.indexOf(answer)); // Get indices

            if (rightAnswerIndices.length === 0) {
                throw new Error("No valid right answers provided.");
            }

            // Create the question object
            const question = new Situation({
                type: "Multi-MCQ",
                content,
                options,
                rightAnswers: rightAnswerIndices,
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