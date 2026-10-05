import fetcher from "./fetcher";

export async function submitQuestion<T>(path: string, data: T) {
  const response = await fetcher(data, path);
  if (response.error || !response.data) {
    throw new Error(response.error || "Failed to submit question");
  }
  return response.data;
}
