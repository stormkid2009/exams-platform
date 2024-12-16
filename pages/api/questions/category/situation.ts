// Now we can use the absolute path by adding baseUrl options to the tsconfig.json file
import connectToDB from 'src/lib/mongooseClient'
import { Situation } from "src/models/questions/situation.model";
import { NextApiRequest, NextApiResponse } from "next";
import { Messages, SituationQuestion } from 'src/types';
import { randomUUID } from 'crypto';

const msg: Messages = {
    success: 'Success to create new question',
    failure: 'Failed to create new question',
    wrongMethod: 'This method is not allowed',
    invalidData: 'Invalid question data provided'
};

// Type for the expected request body
type SituationRequestBody = {
    content: string;
    options: [string, string, string, string, string];
    rightAnswers: [number, number];
};

// Validate request body fields
function validateRequestBody(body: any): body is SituationRequestBody {
    return (
        typeof body.content === 'string' && 
        body.content.trim().length > 0 &&
        Array.isArray(body.options) &&
        body.options.length === 5 &&
        body.options.every((opt: any) => typeof opt === 'string' && opt.trim().length > 0) &&
        Array.isArray(body.rightAnswers) &&
        body.rightAnswers.length === 2 &&
        body.rightAnswers.every((index: any) => 
            typeof index === 'number' && 
            index >= 0 && 
            index < 5
        )
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
            details: "Request must include: content (string), options (array of 5 strings), and rightAnswers (array of 2 numbers between 0-4)"
        });
        return;
    }

    const { content, options, rightAnswers } = req.body;

    // Transform the data to match SituationQuestion interface
    const question: SituationQuestion = {
        id: randomUUID(),
        type: "Multi-MCQ",
        content,
        options,
        rightAnswers
    };

    try {
        await connectToDB();
        const situationDoc = new Situation(question);
        await situationDoc.save();
        res.status(200).json({ 
            message: msg.success,
            questionId: question.id 
        });
    } catch (error: any) {
        console.error("Error saving question:", error.message);
        res.status(500).json({ 
            error: msg.failure,
            details: error.message
        });
    }
}