import { withDbMiddleware } from "src/middleware/db-middleware";
import { validateBodyMiddleware } from "src/middleware/validate-body-middleware";
import { PassageService } from "src/services/passage.service";
import { passageSchema } from "src/shared/schemas/passage.schema";
import { createUpdateQuestionHandler } from "src/utils/api-handlers";

/**
 * PUT /api/questions/passage/[id]/update
 * Updates a Passage question when the caller is its author.
 */
export default withDbMiddleware(
  validateBodyMiddleware(passageSchema)(
    createUpdateQuestionHandler(PassageService)
  )
);
