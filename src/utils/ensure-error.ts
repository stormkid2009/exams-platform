/**
 * Normalizes an unknown thrown value into an `Error` instance.
 *
 * TypeScript types caught values as `unknown`, so this avoids repeating
 * `error instanceof Error ? error : new Error(...)` at every call site.
 *
 * @param error - The caught value.
 * @param fallbackMessage - Message used when the value is not an `Error`.
 * @returns The original `Error` or a new one carrying the fallback message.
 */
export function ensureError(
  error: unknown,
  fallbackMessage = "Unknown error"
): Error {
  return error instanceof Error ? error : new Error(fallbackMessage);
}
