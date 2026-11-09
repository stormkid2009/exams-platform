// fetcher.ts
import { useAuthStore } from "src/store/auth-store";
import type { ApiResponse } from "src/types/common";

/**
 * Interface representing the standardized response from the fetcher function.
 */
export interface FetcherResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Options controlling the HTTP request issued by {@link fetcher}.
 */
export interface FetcherOptions {
  /** HTTP method to use; defaults to `POST`. */
  method?: "GET" | "POST";
}

/**
 * A utility function to call the JSON API.
 *
 * It uses the Fetch API with a configurable timeout (10 seconds), attaches the
 * bearer token from the auth store, and unwraps the unified `ApiResponse`
 * envelope exactly once. Callers receive `{ data, error, status }` and never
 * need to inspect `success`/`error.code` themselves.
 *
 * `GET` requests omit the body and the `Content-Type` header; `data` is ignored
 * for them, so pass `null` (or anything) as the first argument.
 *
 * @param data - The payload to be sent in the request body (POST only).
 * @param path - The URL path to which the request is sent.
 * @param options - Request options; only `method` is supported today.
 * @returns A promise that resolves to a FetcherResponse containing either the data or an error.
 */
const fetcher = async <T>(
  data: unknown,
  path: string,
  { method = "POST" }: FetcherOptions = {}
): Promise<FetcherResponse<T>> => {
  // Create an AbortController to allow for request cancellation on timeout.
  const controller = new AbortController();
  // Set a 10-second timeout to abort the request if it takes too long.
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    // Retrieve token from auth store.
    const token = useAuthStore.getState().token;

    const headers: Record<string, string> = {};
    if (method !== "GET") {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Execute the request; GET has no body, POST sends the JSON payload.
    const response = await fetch(path, {
      method,
      headers,
      body: method === "GET" ? undefined : JSON.stringify(data),
      signal: controller.signal,
    });

    // Clear the timeout if the request completes before the timeout deadline.
    clearTimeout(timeoutId);

    let body: ApiResponse<T>;
    try {
      // Attempt to parse the JSON response.
      body = (await response.json()) as ApiResponse<T>;
    } catch {
      // Handle JSON parsing errors explicitly by returning a custom error response.
      return {
        data: null,
        error: "Invalid JSON response",
        status: response.status,
      };
    }

    if (!response.ok || !body.success) {
      return {
        data: null,
        error: body.error?.message || `HTTP error! status: ${response.status}`,
        status: response.status,
      };
    }

    return {
      data: body.data ?? null,
      error: null,
      status: response.status,
    };
  } catch (error) {
    // Clear the timeout to avoid any lingering timers.
    clearTimeout(timeoutId);

    // Check if the error is due to request timeout.
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        data: null,
        error: "Request timed out",
        status: 504, // HTTP 504 Gateway Timeout
      };
    }

    // Handle any other errors that occur.
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: 500, // Default HTTP status code for server errors.
    };
  }
};

export default fetcher;
