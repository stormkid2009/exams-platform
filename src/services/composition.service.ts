import { createQuestionService } from "src/services/base.service";
import { Composition } from "src/models/questions/composition.model";
import { toCompositionDoc } from "src/shared/schemas/transforms";
import type { CompositionDoc } from "src/shared/schemas/composition.document";
import type { CompositionFormData } from "src/shared/schemas/composition.schema";

/**
 * Composition question service (random, by id, create, update, delete).
 */
export const CompositionService = createQuestionService<
  CompositionDoc,
  CompositionFormData
>({
  model: Composition,
  toDocument: toCompositionDoc,
  label: "Composition",
});
