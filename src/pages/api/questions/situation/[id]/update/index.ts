import { withDbMiddleware } from "src/middleware/db-middleware";
import { validateBodyMiddleware } from "src/middleware/validate-body-middleware";
import { SituationService } from "src/services/situation.service";
import { situationSchema } from "src/shared/schemas/situation.schema";
import { createUpdateQuestionHandler } from "src/utils/api-handlers";

/**
 * PUT /api/questions/situation/[id]/update
 * Updates a Situation question when the caller is its author.
 */
export default withDbMiddleware(
  validateBodyMiddleware(situationSchema)(
    createUpdateQuestionHandler(SituationService)
  )
);
