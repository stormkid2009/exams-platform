import {PassageService} from "src/services/passage.service";
import { NextApiRequest, NextApiResponse } from "next";
import {
  PassageFormData,
  PassageSchema,
} from "src/shared/schemas/passage.schema";
import {
  validateBodyMiddleware,
  ValidatedApiHandler,
} from "src/middleware/validateBodyMiddleware";
import { Messages,ApiResponse } from "src/types/common";

// Response messages
const msg: Messages = {
  success: "Success to create new passage question",
  failure: "Failed to create new passage question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid request data",
} as const;

const handler: ValidatedApiHandler<PassageFormData> = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: msg.wrongMethod,
      data: null,
      details: "Only POST method is allowed",
    });
  }
const result = await PassageService.createQuestion(req.body, {
  path: req.url || "/api/questions/category/passage",
  method: req.method,
});

if (!result.success) {
  // Log the error for debugging
  console.log(result.error);
  return res.status(result.error!.code).json({
    status: "error",
    message: result.error!.message,
    data: null,
    details: result.error!.details,
  });
}

return res.status(200).json({
  status: "success",
  message: msg.success,
  data: null,
})
  
  
};

// Export the handler wrapped with the validateBodyMiddleware
export default validateBodyMiddleware(PassageSchema)(handler);
