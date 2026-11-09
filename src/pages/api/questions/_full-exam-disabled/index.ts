import { withDbMiddleware } from "src/middleware/db-middleware";
import { GrammaireService } from "src/services/grammaire.service";
import { createRandomQuestionHandler } from "src/utils/api-handlers";

/**
 * Disabled placeholder for the future full-exam aggregator.
 *
 * The leading `_` keeps this folder out of Next.js routing. It currently
 * mirrors the Grammaire random handler and should be replaced when a real
 * multi-type exam endpoint exists.
 */
export default withDbMiddleware(
  createRandomQuestionHandler(GrammaireService)
);
