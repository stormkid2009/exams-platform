import { withDbMiddleware } from "src/middleware/db-middleware";
import { CompositionService } from "src/services/composition.service";
import { createDeleteQuestionHandler } from "src/utils/api-handlers";

/**
 * DELETE /api/questions/composition/[id]/delete
 * Deletes a Composition question when the caller is its author.
 */
export default withDbMiddleware(
  createDeleteQuestionHandler(CompositionService)
);
