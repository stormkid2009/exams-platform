import { withDbMiddleware } from "src/middleware/db-middleware";
import { validateBodyMiddleware } from "src/middleware/validate-body-middleware";
import { GrammaireService } from "src/services/grammaire.service";
import { grammaireSchema } from "src/shared/schemas/grammaire.schema";
import { createUpdateQuestionHandler } from "src/utils/api-handlers";

/**
 * PUT /api/questions/grammaire/[id]/update
 * Updates a Grammaire question when the caller is its author.
 */
export default withDbMiddleware(
  validateBodyMiddleware(grammaireSchema)(
    createUpdateQuestionHandler(GrammaireService)
  )
);
