import type { GrammaireFormData } from "./grammaire.schema";
import type { SituationFormData } from "./situation.schema";
import type { CompositionFormData } from "./composition.schema";
import type { PassageFormData } from "./passage.schema";
import type { GrammaireDoc } from "./grammaire.document";
import type { SituationDoc } from "./situation.document";
import type { CompositionDoc } from "./composition.document";
import type { PassageDoc } from "./passage.document";

/**
 * Transforms Grammaire form data (flat keys) into the DB document shape.
 *
 * - Maps flat option keys (a, b, c, d) into an options tuple.
 * - Wraps the rightAnswer key into a single-element tuple.
 */
export function toGrammaireDoc(input: GrammaireFormData, authorId: string): GrammaireDoc {
  return {
    type: "MCQ",
    content: input.content,
    options: [input.a, input.b, input.c, input.d],
    rightAnswer: [input.rightAnswer],
    authorId,
  };
}

/**
 * Transforms Situation form data (flat keys) into the DB document shape.
 *
 * - Maps flat option keys (a, b, c, d, e) into an options tuple.
 * - Combines firstAnswer and secondAnswer into a rightAnswer tuple.
 */
export function toSituationDoc(input: SituationFormData, authorId: string): SituationDoc {
  return {
    type: "Multi-MCQ",
    content: input.content,
    options: [input.a, input.b, input.c, input.d, input.e],
    rightAnswer: [input.firstAnswer, input.secondAnswer],
    authorId,
  };
}

/**
 * Transforms Composition form data (flat keys) into the DB document shape.
 *
 * - Maps flat element keys (a, b) into an elements tuple.
 */
export function toCompositionDoc(input: CompositionFormData, authorId: string): CompositionDoc {
  return {
    type: "Open-Ended",
    content: input.content,
    elements: [input.a, input.b],
    answer: input.answer,
    authorId,
  };
}

/**
 * Transforms Passage form data into the DB document shape.
 *
 * - Recursively transforms each related question via toGrammaireDoc.
 * - Note: relatedQuestions are sub-documents and do NOT need individual authorIds;
 *   the parent passage document holds the single authorId.
 */
export function toPassageDoc(input: PassageFormData, authorId: string): PassageDoc {
  return {
    type: "RC",
    passage: input.passage,
    relatedQuestions: input.relatedQuestions.map((q) =>
      toGrammaireDoc(q, authorId)
    ) as [GrammaireDoc, ...GrammaireDoc[]],
    authorId,
  };
}
