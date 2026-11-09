import { withDbMiddleware } from "src/middleware/db-middleware";
import { SituationService } from "src/services/situation.service";
import { createQuestionByIdHandler } from "src/utils/api-handlers";

/**
 * GET /api/questions/situation/[id]
 * Returns a single Situation question by its MongoDB `_id`.
 */
export default withDbMiddleware(
  createQuestionByIdHandler(SituationService)
);
