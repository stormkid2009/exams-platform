import fetcher from "./fetcher";

// Type definitions
interface RequestData {
  key: string;
}

interface SuccessResponse {
  result: string;
}

interface ErrorResponse {
  message: string;
}

describe("fetcher", () => {
  const mockPath = "/api/test";
  const mockData: RequestData = { key: "value" };
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it("should return data on successful response", async () => {
    const successResponse: SuccessResponse = { result: "success" };
    
    const mockFetch = jest.fn().mockImplementation(async () => ({
      ok: true,
      status: 200,
      json: async () => successResponse
    }));
    global.fetch = mockFetch;
  
    const response = await fetcher<SuccessResponse>(mockData, mockPath);
    
    expect(mockFetch).toHaveBeenCalledWith(mockPath, expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockData),
      signal: expect.any(AbortSignal),
    }));

    expect(response).toEqual({
      data: successResponse,
      error: null,
      status: 200,
    });
  });

  it("should handle HTTP errors", async () => {
    const errorResponse: ErrorResponse = { message: "Not Found" };
    
    const mockFetch = jest.fn().mockImplementation(async () => ({
      ok: false,
      status: 404,
      json: async () => errorResponse
    }));
    global.fetch = mockFetch;

    const response = await fetcher<null>(mockData, mockPath);

    expect(response).toEqual({
      data: null,
      error: "Not Found",
      status: 404,
    });
  });

  it("should handle generic errors", async () => {
    const errorMessage = "Network Error";
    const mockFetch = jest.fn().mockRejectedValue(new Error(errorMessage));
    global.fetch = mockFetch;

    const response = await fetcher<null>(mockData, mockPath);

    expect(response).toEqual({
      data: null,
      error: errorMessage,
      status: 500,
    });
  });

  it("should handle timeout errors", async () => {
    const mockFetch = jest.fn().mockImplementation(() => {
      const abortError = new DOMException("Request aborted", "AbortError");
      return Promise.reject(abortError);
    });
    global.fetch = mockFetch;

    const response = await fetcher<null>(mockData, mockPath);

    expect(response).toEqual({
      data: null,
      error: "Request timed out",
      status: 504,
    });
  }, 15000);

  it("should handle JSON parsing errors", async () => {
    const mockFetch = jest.fn().mockImplementation(async () => ({
      ok: true,
      status: 200,
      json: async () => { throw new SyntaxError("Unexpected token") }
    }));
    global.fetch = mockFetch;

    const response = await fetcher<null>(mockData, mockPath);

    expect(response).toEqual({
      data: null,
      error: "Invalid JSON response",
      status: 200,
    });
  });
});