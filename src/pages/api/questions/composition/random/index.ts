import { NextApiRequest,NextApiResponse } from "next";
import { CompositionService } from "src/services/composition.service";
import { Messages ,ApiResponse} from "src/types/common";
import { logApiError } from "src/utils/logger";


const msg:Messages = {
  success:"successfully retrieve random grammaire question  ",
  failure:"failed to retrieve random grammaire question",
  wrongMethod:"the method is not valid",
  invalidData:"the data is not valid",
} as const;

const handler=async(
  req:NextApiRequest,
  res:NextApiResponse<ApiResponse>
):Promise<void> =>{
  const path = req.url || "/api/questions/composition/random";
  const method = req.method || "UNKNOWN";

  if(method !== "GET"){
    //log the error if the request method is invlid
    await logApiError(
      "Invalid request method",
      new Error(msg.wrongMethod),
      {
        path,
        method,
        statusCode:405,
      }
    );
    // Return a 405 method Not allowed response
    return res.status(405).json({
      status:"error",
      message:msg.wrongMethod,
      data:null,
      details:"Only GET method is allowed",
    });
  }

  
try {
 const result = await CompositionService.getRandomQuestion({});
    
    if(!result.success){
      // log the error details returned from the service
      await logApiError(
        "Failed to retrieve random composition question",
        new Error (result.error?.message || msg.failure),
        {
          path,
          method,
          statusCode:result.error?.code || 500,
        }
      );
      //Respond with the appropriate error code , message ,and details
      return res.status(result.error?.code || 500).json({
         status: "error",
        message: result.error?.message || msg.failure,
        data: null,
        details: result.error?.details || "Could not retrieve a random question",
      });

    }
    // On success , respond with a 200 status and the question data
    res.status(200).json({

      status: "success",
      message: msg.success,
      data: result.data,
    });
} catch (error) {
  // log any unexpected errors using the logging utility
  await logApiError(

    "Unexpected error in random grammar question handler",
      error instanceof Error ? error : new Error("Unknown error"),
      {
        path,
        method,
        statusCode: 500,
      }
    );
  // Return a generic 500 Internal Server Error response
 res.status(500).json({

      status: "error",
      message: "Internal Server Error",
      data: null,
      details: "An unexpected error occurred",
    });
}
}

export default handler;
