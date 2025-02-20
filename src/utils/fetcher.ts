// Create a new function that will fetch data from an api endpoint
// we give the function generic type or placeholder for incoming data which we dont know 
// what type it will be

interface FetcherResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

const fetcher = async <T>(data: unknown, path: string): Promise<FetcherResponse<T>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseData = await response.json();

    return {
      data: response.ok ? (responseData as T) : null,
      error: response.ok ? null : responseData.message || `HTTP error! status: ${response.status}`,
      status: response.status,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    };
  }
};

export default fetcher;