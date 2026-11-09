import { withDbMiddleware } from "src/middleware/db-middleware";
import { PassageService } from "src/services/passage.service";
import { createDeleteQuestionHandler } from "src/utils/api-handlers";

/**
 * DELETE /api/questions/passage/[id]/delete
 * Deletes a Passage question when the caller is its author.
 */
export default withDbMiddleware(createDeleteQuestionHandler(PassageService));
