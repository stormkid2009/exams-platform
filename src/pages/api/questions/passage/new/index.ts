import { withDbMiddleware } from "src/middleware/db-middleware";
import { validateBodyMiddleware } from "src/middleware/validate-body-middleware";
import { PassageService } from "src/services/passage.service";
import { passageSchema } from "src/shared/schemas/passage.schema";
import { createNewQuestionHandler } from "src/utils/api-handlers";

/**
 * POST /api/questions/passage/new
 * Creates a Passage question for the authenticated user (201 on success).
 */
export default withDbMiddleware(
  validateBodyMiddleware(passageSchema)(
    createNewQuestionHandler(PassageService)
  )
);
