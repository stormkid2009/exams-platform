import { withDbMiddleware } from "src/middleware/db-middleware";
import { validateBodyMiddleware } from "src/middleware/validate-body-middleware";
import { CompositionService } from "src/services/composition.service";
import { compositionSchema } from "src/shared/schemas/composition.schema";
import { createUpdateQuestionHandler } from "src/utils/api-handlers";

/**
 * PUT /api/questions/composition/[id]/update
 * Updates a Composition question when the caller is its author.
 */
export default withDbMiddleware(
  validateBodyMiddleware(compositionSchema)(
    createUpdateQuestionHandler(CompositionService)
  )
);
