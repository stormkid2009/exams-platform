import { useCallback } from "react";
import { submitQuestion } from "src/utils/submit-question";

/**
 * Returns a stable submit handler for one question-create endpoint.
 *
 * @param path - The question create API path.
 * @returns A callback that submits the validated form data and rethrows API errors.
 */
export function useQuestionCreate<TForm>(
  path: string
): (data: TForm) => Promise<void> {
  return useCallback(
    async (data: TForm): Promise<void> => {
      await submitQuestion<null>(path, data);
    },
    [path]
  );
}
