import { withDbMiddleware } from "src/middleware/db-middleware";
import { SituationService } from "src/services/situation.service";
import { createRandomQuestionHandler } from "src/utils/api-handlers";

/**
 * GET /api/questions/situation/random
 * Returns a random Situation question to an authenticated user.
 */
export default withDbMiddleware(
  createRandomQuestionHandler(SituationService)
);
