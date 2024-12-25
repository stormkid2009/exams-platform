// Now we can use the absolute path by adding baseUrl options to the tsconfig.json file

import {validateBodyMiddleware , type ValidatedApiHandler} from 'src/middleware/validateBodyMiddleware'
import connectToDB from 'src/lib/mongooseClient'
import { Situation } from "src/models/questions/situation.model";
import { NextApiRequest, NextApiResponse } from "next";
import { Messages , ApiResponse} from 'src/types';
import { logApiError } from 'src/helpers/logger';
import { randomUUID } from 'crypto';
import { situationSchema , type SituationRequest } from 'src/zodValidation/situationSchema';

const msg: Messages = {
    success: 'Success to create new question',
    failure: 'Failed to create new question',
    wrongMethod: 'This method is not allowed',
    invalidData: 'Invalid question data provided'
};



const handler: ValidatedApiHandler<SituationRequest> = async (
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
        const { content, options, rightAnswers } = req.body;
    
        // Transform the data to match SituationQuestion interface
        const question = new Situation(
            {
                id: randomUUID(),
                type: "Multi-MCQ",
                content,
                options,
                rightAnswers
            }
        ) 

        await connectToDB();
        await question.save();
        return res.status(200).json({ 
            status: "success",
            message: msg.success,
            data: {questionId: question.id},
            details: null 
        });
    } catch (error) {
        if (error instanceof Error) {
          // Log the error with API context
          logApiError(
            "Failed to create situation question",
            error,
            {
              path: req.url || '/api/questions/category/situation',
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
            path: req.url || '/api/questions/category/situation',
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
    
    export default validateBodyMiddleware(situationSchema)(handler);