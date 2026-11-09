import { createQuestionService } from "src/services/base.service";
import { Situation } from "src/models/questions/situation.model";
import { toSituationDoc } from "src/shared/schemas/transforms";
import type { SituationDoc } from "src/shared/schemas/situation.document";
import type { SituationFormData } from "src/shared/schemas/situation.schema";

/**
 * Situation question service (random, by id, create, update, delete).
 */
export const SituationService = createQuestionService<
  SituationDoc,
  SituationFormData
>({
  model: Situation,
  toDocument: toSituationDoc,
  label: "Situation",
});
