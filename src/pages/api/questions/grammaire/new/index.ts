import { withDbMiddleware } from "src/middleware/db-middleware";
import { validateBodyMiddleware } from "src/middleware/validate-body-middleware";
import { GrammaireService } from "src/services/grammaire.service";
import { grammaireSchema } from "src/shared/schemas/grammaire.schema";
import { createNewQuestionHandler } from "src/utils/api-handlers";

/**
 * POST /api/questions/grammaire/new
 * Creates a Grammaire question for the authenticated user (201 on success).
 */
export default withDbMiddleware(
  validateBodyMiddleware(grammaireSchema)(
    createNewQuestionHandler(GrammaireService)
  )
);
