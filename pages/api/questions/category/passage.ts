import connectToDB from 'src/lib/mongooseClient'
import { Passage } from 'src/models/questions/passage.model'
import { NextApiRequest, NextApiResponse } from "next";
import { logApiError } from "src/helpers/logger";
import { PassageRequestBody, PassageSchema } from "src/shared/schemas/passage.schema";
import { validateBodyMiddleware, ValidatedApiHandler } from "src/middleware/validateBodyMiddleware";
import { Messages } from 'src/types';
import { ApiResponse, BaseQuestion } from "src/types";

// Response messages
const msg: Messages = {
    success: "Success to create new passage question",
    failure: "Failed to create new passage question",
    wrongMethod: "This method is not allowed",
    invalidData: "Invalid request data"
} as const;





const  handler: ValidatedApiHandler<PassageRequestBody> = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) => {
    if (req.method !== "POST") {
        return res.status(405).json({ 
            status: "error",
            message: msg.wrongMethod,
            data: null,
            details: "Only POST method is allowed"
        });
    }

    

    try {
        await connectToDB();
        const {passage,relatedQuestions} = req.body;
        // Transform the request data to match our model
        const passageData = new Passage(
            {
                passage,
                relatedQuestions: relatedQuestions.map((q: BaseQuestion) =>  ({
                    type: "MCQ" as const,
                    content: q.content,
                    options: q.options,
                    rightAnswers: q.rightAnswers // Convert single rightAnswer to array format
                }))
            }
        );

        await connectToDB();
        await passageData.save();

        return res.status(200).json({
            status: "success", 
            message: msg.success,
            data:{questionId: passageData.id},
            details:null
        });
    } catch (error) {
        if (error instanceof Error) {
            logApiError(
                "Failed to create passage question",
                error,
                {
                    path: req.url || '/api/questions/category/passage',
                    method: req.method,
                    statusCode: error.name === "MongoNetworkError" ? 503 : 500,
                    requestBody: req.body
                }
            );

            if (error.name === "MongoNetworkError") {
                return res.status(503).json({ 
                    status: "error",
                    message: "Service Unavailable",
                    data: null,
                    details: "Database connection error, please try again later."
                });
            }

            return res.status(500).json({ 
                status: "error",
                message: msg.failure,
                data: null,
                details: error.message
            });
        }

        // For unknown errors
        logApiError(
            "Unknown error occurred",
            new Error("Unknown error"),
            {
                path: req.url || '/api/questions/category/passage',
                method: req.method,
                statusCode: 500,
                requestBody: req.body
            }
        );

        return res.status(500).json({ 
            status: "error",
            message: msg.failure,
            data: null,
            details: "An unexpected error occurred"
        });
    }
};

// Export the handler wrapped with the validateBodyMiddleware
export default validateBodyMiddleware(PassageSchema)(handler);