import { withDbMiddleware } from "src/middleware/db-middleware";
import { CompositionService } from "src/services/composition.service";
import { createQuestionByIdHandler } from "src/utils/api-handlers";

/**
 * GET /api/questions/composition/[id]
 * Returns a single Composition question by its MongoDB `_id`.
 */
export default withDbMiddleware(
  createQuestionByIdHandler(CompositionService)
);
