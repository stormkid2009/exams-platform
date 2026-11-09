import { withDbMiddleware } from "src/middleware/db-middleware";
import { CompositionService } from "src/services/composition.service";
import { createRandomQuestionHandler } from "src/utils/api-handlers";

/**
 * GET /api/questions/composition/random
 * Returns a random Composition question to an authenticated user.
 */
export default withDbMiddleware(
  createRandomQuestionHandler(CompositionService)
);
