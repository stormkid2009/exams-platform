import { createQuestionService } from "src/services/base.service";
import { Grammaire } from "src/models/questions/grammaire.model";
import { toGrammaireDoc } from "src/shared/schemas/transforms";
import type { GrammaireDoc } from "src/shared/schemas/grammaire.document";
import type { GrammaireFormData } from "src/shared/schemas/grammaire.schema";

/**
 * Grammaire question service (random, by id, create, update, delete).
 */
export const GrammaireService = createQuestionService<
  GrammaireDoc,
  GrammaireFormData
>({
  model: Grammaire,
  toDocument: toGrammaireDoc,
  label: "Grammaire",
});
