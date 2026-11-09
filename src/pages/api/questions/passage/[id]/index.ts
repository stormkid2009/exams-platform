import { withDbMiddleware } from "src/middleware/db-middleware";
import { PassageService } from "src/services/passage.service";
import { createQuestionByIdHandler } from "src/utils/api-handlers";

/**
 * GET /api/questions/passage/[id]
 * Returns a single Passage question by its MongoDB `_id`.
 */
export default withDbMiddleware(createQuestionByIdHandler(PassageService));
