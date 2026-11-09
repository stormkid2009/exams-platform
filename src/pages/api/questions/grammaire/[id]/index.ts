import { withDbMiddleware } from "src/middleware/db-middleware";
import { GrammaireService } from "src/services/grammaire.service";
import { createQuestionByIdHandler } from "src/utils/api-handlers";

/**
 * GET /api/questions/grammaire/[id]
 * Returns a single Grammaire question by its MongoDB `_id`.
 */
export default withDbMiddleware(
  createQuestionByIdHandler(GrammaireService)
);
