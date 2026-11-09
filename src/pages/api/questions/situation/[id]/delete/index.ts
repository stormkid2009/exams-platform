import { withDbMiddleware } from "src/middleware/db-middleware";
import { SituationService } from "src/services/situation.service";
import { createDeleteQuestionHandler } from "src/utils/api-handlers";

/**
 * DELETE /api/questions/situation/[id]/delete
 * Deletes a Situation question when the caller is its author.
 */
export default withDbMiddleware(
  createDeleteQuestionHandler(SituationService)
);
