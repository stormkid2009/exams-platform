import fetcher from "./fetcher";

/**
 * Submits a question payload and throws when the API reports an error.
 *
 * Create endpoints return `201` with no data, so only `response.error` is
 * treated as a failure. Returning `null` here is expected on success.
 *
 * @param path - The question create endpoint.
 * @param data - The validated form payload.
 * @returns The response data, or `null` for create endpoints.
 * @throws When the API returns an error or the network request fails.
 */
export async function submitQuestion<T>(
  path: string,
  data: unknown
): Promise<T | null> {
  const response = await fetcher<T>(data, path);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}
