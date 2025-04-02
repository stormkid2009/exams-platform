import { NextApiRequest,NextApiResponse } from "next";
import { SituationService } from "src/services/situation.service";
import { Messages,ApiResponse } from "src/types/common";
import { logApiError } from "src/utils/logger";

const msg:Messages = {
  success:"successfully retrieve random situation question  ",
  failure:"failed to retrieve random situation question",
  wrongMethod:"the method is not valid",
  invalidData:"the data is not valid",
} as const ;

const handler=async(
  req:NextApiRequest,
  res:NextApiResponse<ApiResponse>
):Promise<void> =>{

  const path = req.url || "/api/questions/situation/random";
  const method = req.method || "UNKOWN";
  if(method !== "GET"){
    // log the error if the request method is invalid
    await logApiError(
      "Invalid request method",
      new Error(msg.wrongMethod),
      {
        path,
        method,
        statusCode:405,
      }
    );
    // return a 405 Method not allowed response
    return res.status(405).json({
      status:"error",
      message:msg.wrongMethod,
      data:null,
      details:"Only GET method is allowed",

    })
  }


  try {
    const result = await SituationService.getRandomQuestion({});
    if(!result.data){
      // log the error details returned from the service
      logApiError(
        "Failed to retrieve random situation question",
        new Error(result.error?.message || msg.failure),
        {
          path,
          method,
          statusCode:result.error?.code || 500,
        }
      );
      // Respond with the appropriate error code , message , and details
      return res.status(result.error?.code || 500).json({
        status:"error",
        message:result.error?.message || msg.failure,
        data:null,
        details:result.error?.details || "Could not retrieve random question",
      });
    }

    // On Success , respoond with a 200 status and the question data
    res.status(200).json({
      status:"success",
      message:msg.success,
      data:result.data,
    });
    
  } catch (error) {
    // log any unexpected errros using the logging utility
    logApiError(
     "unexpected error in random grammaire question handler",
      error instanceof Error ? error : new Error("Unknown error"),
      {
        path,
        method,
        statusCode: 500,
      }
    );

    res.status(500).json({
      status:"error",
      message:"Internal Server Error",
      data:null,
      details:"An unexpected error occured",
    });
    
  }
}

export default handler;
