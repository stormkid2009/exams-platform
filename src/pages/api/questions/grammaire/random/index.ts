import { withDbMiddleware } from "src/middleware/db-middleware";
import { GrammaireService } from "src/services/grammaire.service";
import { createRandomQuestionHandler } from "src/utils/api-handlers";

/**
 * GET /api/questions/grammaire/random
 * Returns a random Grammaire question to an authenticated user.
 */
export default withDbMiddleware(
  createRandomQuestionHandler(GrammaireService)
);
