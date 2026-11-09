import { withDbMiddleware } from "src/middleware/db-middleware";
import { PassageService } from "src/services/passage.service";
import { createRandomQuestionHandler } from "src/utils/api-handlers";

/**
 * GET /api/questions/passage/random
 * Returns a random Passage question to an authenticated user.
 */
export default withDbMiddleware(createRandomQuestionHandler(PassageService));
