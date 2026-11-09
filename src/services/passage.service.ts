import { createQuestionService } from "src/services/base.service";
import { Passage } from "src/models/questions/passage.model";
import { toPassageDoc } from "src/shared/schemas/transforms";
import type { PassageDoc } from "src/shared/schemas/passage.document";
import type { PassageFormData } from "src/shared/schemas/passage.schema";

/**
 * Passage question service (random, by id, create, update, delete).
 */
export const PassageService = createQuestionService<PassageDoc, PassageFormData>(
  {
    model: Passage,
    toDocument: toPassageDoc,
    label: "Passage",
  }
);
