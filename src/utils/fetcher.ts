// fetcher.ts

export interface FetcherResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

interface ErrorResponse {
  message: string;
}

const fetcher = async <T>(data: unknown, path: string): Promise<FetcherResponse<T>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // Set a 10-second timeout

  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId); // Clear the timeout if the request completes successfully

    let responseData:T | ErrorResponse;
    try {
      responseData = (await response.json()) as T | ErrorResponse; // Attempt to parse the JSON response
    } catch (jsonError) {
      // Handle JSON parsing errors explicitly
      return {
        data: null,
        error: 'Invalid JSON response', // Custom error message for invalid JSON
        status: response.status,
      };
    }

    return {
      data: response.ok ? (responseData as T) : null, // Return data if the response is successful
      error: response.ok ? null : ((responseData as ErrorResponse).message) || `HTTP error! status: ${response.status}`, // Return error message if not successful
      status: response.status,
    };
  } catch (error) {
    clearTimeout(timeoutId); // Ensure the timeout is cleared in case of an error

    if (error instanceof DOMException && error.name === 'AbortError') {
      // Handle timeout errors explicitly
      return {
        data: null,
        error: 'Request timed out', // Custom error message for timeouts
        status: 504, // Use HTTP status code 504 for Gateway Timeout
      };
    }

    // Handle all other errors
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500, // Default to HTTP status code 500 for server errors
    };
  }
};

export default fetcher;

