import connectToDB from 'src/lib/mongooseClient'
import { Passage } from 'src/models/questions/passage.model'
import { NextApiRequest, NextApiResponse } from "next";
import { Messages } from 'src/types';
import { randomUUID } from 'crypto';

const msg: Messages = {
    success: "Success to create new passage question",
    failure: "Failed to create new passage question",
    wrongMethod: "This method is not allowed",
    invalidData: "Invalid request data"
};

// Type for the expected request body
type PassageRequestBody = {
    passage: string;
    relatedQuestions: Array<{
        content: string;
        options: [string, string, string, string];
        rightAnswer: number;
    }>;
};

// Validate request body fields
function validateRequestBody(body: any): body is PassageRequestBody {
    // Check if passage exists and is non-empty string
    if (typeof body.passage !== 'string' || body.passage.trim().length === 0) {
        return false;
    }

    // Check if relatedQuestions is an array and not empty
    if (!Array.isArray(body.relatedQuestions) || body.relatedQuestions.length === 0) {
        return false;
    }

    // Validate each question in relatedQuestions
    return body.relatedQuestions.every(question => 
        typeof question.content === 'string' && 
        question.content.trim().length > 0 &&
        Array.isArray(question.options) &&
        question.options.length === 4 &&
        question.options.every((opt: any) => typeof opt === 'string' && opt.trim().length > 0) &&
        typeof question.rightAnswer === 'number' && 
        question.rightAnswer >= 0 && 
        question.rightAnswer <= 3
    );
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    if (req.method !== "POST") {
        res.status(405).json({ 
            error: msg.wrongMethod,
            details: "Only POST method is allowed"
        });
        return;
    }

    // Validate request body
    if (!validateRequestBody(req.body)) {
        res.status(400).json({ 
            error: msg.invalidData,
            details: "Request must include: passage (string) and relatedQuestions (array of questions with content, options[4], and rightAnswer)"
        });
        return;
    }

    try {
        await connectToDB();

        // Transform the request data to match our model
        const passageData = {
            id: randomUUID(),
            passage: req.body.passage,
            relatedQuestions: req.body.relatedQuestions.map(q => ({
                id: randomUUID(),
                type: "MCQ" as const,
                content: q.content,
                options: q.options,
                rightAnswers: [q.rightAnswer] // Convert single rightAnswer to array format
            }))
        };

        const passageDoc = new Passage(passageData);
        await passageDoc.save();

        res.status(200).json({ 
            message: msg.success,
            questionId: passageData.id
        });
    } catch (error: any) {
        console.error("Error creating passage question:", error);
        res.status(500).json({ 
            error: msg.failure,
            details: error.message
        });
    }
}
