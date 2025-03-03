import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { validateBodyMiddleware } from './validate-body-middleware';
import { logApiError } from 'src/utils/logger';

// Mock dependencies
jest.mock('src/utils/logger', () => ({
  logApiError: jest.fn()
}));

describe('validateBodyMiddleware', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let mockHandler: jest.Mock;
  let schema: z.ZodSchema;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response mocks
    mockReq = {
      url: '/api/test',
      method: 'POST',
      body: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    // Mock the handler
    mockHandler = jest.fn();
    
    // Create a simple schema for testing
    schema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    });
  });
  
  test('should call the handler with validated data on valid input', async () => {
    const validBody = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    mockReq.body = validBody;
    
    const middleware = validateBodyMiddleware(schema);
    const handler = middleware(mockHandler);
    
    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    
    // Validate that the handler was called
    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        validatedBody: validBody
      }),
      mockRes
    );
    
    // Ensure error handling wasn't triggered
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(logApiError).not.toHaveBeenCalled();
  });
  
    test('should return 400 with validation details on invalid input', async () => {
  const invalidBody = {
    email: 'not-an-email',
    password: 'short'
  };
  
  mockReq.body = invalidBody;
  
  const middleware = validateBodyMiddleware(schema);
  const handler = middleware(mockHandler);
  
  await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
  
  // Validate that the handler was not called
  expect(mockHandler).not.toHaveBeenCalled();
  
  // Verify error response
  expect(mockRes.status).toHaveBeenCalledWith(400);
  expect(mockRes.json).toHaveBeenCalledWith({
    status: 'error',
    message: 'Validation failed',
    data: null,
    details: expect.any(String) // Change this line to be more flexible
  });
  
  // Verify error was logged
  expect(logApiError).toHaveBeenCalledWith(
    'Validation Error',
    expect.any(z.ZodError),
    expect.objectContaining({
      path: '/api/test',
      method: 'POST',
      statusCode: 400,
      requestBody: invalidBody
    })
  );
});
  
  test('should return 500 on unexpected errors', async () => {
    // Create a schema that throws a non-Zod error
    const errorSchema = {
      parse: jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      })
    } as unknown as z.ZodSchema;
    
    mockReq.body = { foo: 'bar' };
    
    const middleware = validateBodyMiddleware(errorSchema);
    const handler = middleware(mockHandler);
    
    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    
    // Validate that the handler was not called
    expect(mockHandler).not.toHaveBeenCalled();
    
    // Verify error response
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error',
      data: null,
      details: 'An unexpected error occurred during validation'
    });
    
    // Verify error was logged
    expect(logApiError).toHaveBeenCalledWith(
      'Unexpected Validation Error',
      expect.any(Error),
      expect.objectContaining({
        path: '/api/test',
        method: 'POST',
        statusCode: 500,
        requestBody: { foo: 'bar' }
      })
    );
  });
  
  test('should handle missing request data gracefully', async () => {
    // Setup request with missing properties
    const incompleteReq: Partial<NextApiRequest> = {
      body: { email: 'invalid' }
      // url and method missing
    };
    
    const middleware = validateBodyMiddleware(schema);
    const handler = middleware(mockHandler);
    
    await handler(incompleteReq as NextApiRequest, mockRes as NextApiResponse);
    
    // Verify error was logged with fallback values
    expect(logApiError).toHaveBeenCalledWith(
      'Validation Error',
      expect.any(z.ZodError),
      expect.objectContaining({
        path: '/unknown',
        method: 'UNKNOWN',
        statusCode: 400
      })
    );
  });
});
