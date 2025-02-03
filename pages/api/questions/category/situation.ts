// Now we can use the absolute path by adding baseUrl options to the tsconfig.json file

import {
  validateBodyMiddleware,
  type ValidatedApiHandler,
} from "src/middleware/validateBodyMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import { Messages, ApiResponse } from "src/types/common";
import {
  situationSchema,
  type SituationFormData,
} from "src/shared/schemas/situation.schema";
import { SituationService } from "src/services/situation.service";

const msg: Messages = {
  success: "Success to create new question",
  failure: "Failed to create new question",
  wrongMethod: "This method is not allowed",
  invalidData: "Invalid question data provided",
} as const;

const handler: ValidatedApiHandler<SituationFormData> = async (
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
  const result = await SituationService.createQuestion(req.body, {
    path: req.url || "/api/questions/category/situation",
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
  });
  
  };

export default validateBodyMiddleware(situationSchema)(handler);
