import { withDbMiddleware } from "src/middleware/db-middleware";
import { GrammaireService } from "src/services/grammaire.service";
import { createDeleteQuestionHandler } from "src/utils/api-handlers";

/**
 * DELETE /api/questions/grammaire/[id]/delete
 * Deletes a Grammaire question when the caller is its author.
 */
export default withDbMiddleware(
  createDeleteQuestionHandler(GrammaireService)
);
