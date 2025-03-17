// fetcher.ts

/**
 * Interface representing the standardized response from the fetcher function.
 */
export interface FetcherResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Interface representing an error response returned by the API.
 */
interface ErrorResponse {
  message: string;
}

/**
 * A utility function to make POST requests with a JSON payload.
 *
 * It uses the Fetch API with a configurable timeout (10 seconds) and returns a uniform response
 * containing the parsed data, an error message if applicable, and the HTTP status code.
 *
 * @param data - The payload to be sent in the request body.
 * @param path - The URL path to which the request is sent.
 * @returns A promise that resolves to a FetcherResponse containing either the data or an error.
 */
const fetcher = async <T>(
  data: unknown,
  path: string
): Promise<FetcherResponse<T>> => {
  // Create an AbortController to allow for request cancellation on timeout.
  const controller = new AbortController();
  // Set a 10-second timeout to abort the request if it takes too long.
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    // Execute the fetch request with POST method, JSON headers, and stringified body.
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    // Clear the timeout if the request completes before the timeout deadline.
    clearTimeout(timeoutId);

    let responseData: T | ErrorResponse;
    try {
      // Attempt to parse the JSON response.
      responseData = (await response.json()) as T | ErrorResponse;
    } catch (jsonError) {
      // Handle JSON parsing errors explicitly by returning a custom error response.
      return {
        data: null,
        error: "Invalid JSON response",
        status: response.status,
      };
    }

    // Return a successful response if the HTTP status is ok; otherwise, return the error message.
    return {
      data: response.ok ? (responseData as T) : null,
      error: response.ok
        ? null
        : (responseData as ErrorResponse).message ||
          `HTTP error! status: ${response.status}`,
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
