import { withDbMiddleware } from "src/middleware/db-middleware";
import { validateBodyMiddleware } from "src/middleware/validate-body-middleware";
import { SituationService } from "src/services/situation.service";
import { situationSchema } from "src/shared/schemas/situation.schema";
import { createNewQuestionHandler } from "src/utils/api-handlers";

/**
 * POST /api/questions/situation/new
 * Creates a Situation question for the authenticated user (201 on success).
 */
export default withDbMiddleware(
  validateBodyMiddleware(situationSchema)(
    createNewQuestionHandler(SituationService)
  )
);
