import { withDbMiddleware } from "src/middleware/db-middleware";
import { validateBodyMiddleware } from "src/middleware/validate-body-middleware";
import { CompositionService } from "src/services/composition.service";
import { compositionSchema } from "src/shared/schemas/composition.schema";
import { createNewQuestionHandler } from "src/utils/api-handlers";

/**
 * POST /api/questions/composition/new
 * Creates a Composition question for the authenticated user (201 on success).
 */
export default withDbMiddleware(
  validateBodyMiddleware(compositionSchema)(
    createNewQuestionHandler(CompositionService)
  )
);
