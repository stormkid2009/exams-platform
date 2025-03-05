import * as fs from 'fs/promises';
import * as nodePath from 'path';

// Setup mocks BEFORE importing the logger
jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  stat: jest.fn().mockResolvedValue({ size: 0 }),
  rename: jest.fn().mockResolvedValue(undefined),
  appendFile: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('path', () => ({
  resolve: jest.fn(() => '/mock/logs'),
  join: jest.fn((...paths) => paths.join('/'))
}));

const mockConsoleError = jest.fn();
console.error = mockConsoleError;

describe('Logger Module', () => {
  const originalEnv = { ...process.env };
  const mockLogDir = '/mock/logs';
  const mockLogFilePath = `${mockLogDir}/api-errors.log`;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    
    // Reset mocked modules to their initial state
    (fs.appendFile as jest.Mock).mockResolvedValue(undefined);
    (fs.stat as jest.Mock).mockResolvedValue({ size: 0 });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('logApiError writes structured error log with correct format', async () => {
    // Import the logger inside the test to ensure environment variables
    // are properly set before import
    const { logApiError } = require('./logger');
    
    // Arrange
    const error = new Error('Test error');
    const context = { path: '/test', method: 'GET', statusCode: 500, requestBody: { key: 'value' } };
    
    // Act
    await logApiError('Test message', error, context);
    
    // Assert
    expect(fs.mkdir).toHaveBeenCalled();
    expect(fs.appendFile).toHaveBeenCalled();
    
    // Get the actual JSON string that was written to the log file
    const appendCallArgs = (fs.appendFile as jest.Mock).mock.calls[0];
    const logJson = appendCallArgs[1];
    
    // Parse the JSON to check its structure
    const parsedLog = JSON.parse(logJson);
    
    // Check that the log has the expected structure without exact matching
    expect(parsedLog).toMatchObject({
      level: 'ERROR',
      message: 'Test message',
      error: {
        path: '/test',
        method: 'GET',
        statusCode: 500,
        errorName: 'Error',
        errorMessage: 'Test error',
        requestBody: { key: 'value' }
      }
    });
    
    // Ensure the timestamp is there but don't check its exact value
    expect(parsedLog.timestamp).toBeDefined();
    expect(typeof parsedLog.timestamp).toBe('string');
    
    // Check that the stack is there but don't check its content
    expect(parsedLog.error.stack).toBeDefined();
  });

  test('logError writes a generic error log with correct format', async () => {
    // Import the logger inside the test
    const { logError } = require('./logger');
    
    // Arrange
    const error = new Error('Generic error');
    
    // Act
    await logError('Generic message', error);
    
    // Assert
    const appendCallArgs = (fs.appendFile as jest.Mock).mock.calls[0];
    const logJson = appendCallArgs[1];
    const parsedLog = JSON.parse(logJson);
    
    expect(parsedLog).toMatchObject({
      level: 'ERROR',
      message: 'Generic message',
      error: {
        errorName: 'Error',
        errorMessage: 'Generic error',
      }
    });
  });

  test('log rotation occurs when exceeding MAX_LOG_SIZE', async () => {
    // Import the logger inside the test
    const { logError } = require('./logger');
    
    // Save original Date.now
    const originalDateNow = Date.now;
    
    try {
      // First, trigger a rotation check by making Date.now return a very large number
      Date.now = jest.fn().mockReturnValue(Number.MAX_SAFE_INTEGER);
      
      // Mock the file size to be large enough to trigger rotation
      (fs.stat as jest.Mock).mockResolvedValueOnce({ size: 20 * 1024 * 1024 }); // 20MB
      
      // Act - call the function with mocked conditions
      await logError('Test message', new Error('Rotation test'));
      
      // Assert
      expect(fs.stat).toHaveBeenCalled();
      expect(fs.rename).toHaveBeenCalled();
      
      // Check that rename was called with correct source path
      const renameArgs = (fs.rename as jest.Mock).mock.calls[0];
      expect(renameArgs[0]).toBe(mockLogFilePath);
      
      // Check that the target path matches the expected pattern
      expect(renameArgs[1]).toMatch(/\/mock\/logs\/api-errors-.*\.log/);
    } finally {
      // Restore original Date.now
      Date.now = originalDateNow;
    }
  });

  test('handles file system errors gracefully', async () => {
    // Import the logger inside the test
    const { logError } = require('./logger');
    
    // Arrange
    const fsError = new Error('File system error');
    (fs.mkdir as jest.Mock).mockRejectedValueOnce(fsError);
    
    // Act
    await logError('Test message', new Error('Test error'));
    
    // Assert
    expect(console.error).toHaveBeenCalledWith('Failed to create logs directory:', fsError);
    // Despite the error, the code should continue and try to write the log
    expect(fs.appendFile).toHaveBeenCalled();
  });

  test('queue-based writing prevents race conditions', async () => {
    // Import the logger inside the test
    const { logError } = require('./logger');
    
    // Arrange
    let resolveFirst: (value?: unknown) => void;
    const firstAppendPromise = new Promise(resolve => {
      resolveFirst = resolve;
    });
    
    // Setup the mock to delay the first call and resolve immediately for the second
    (fs.appendFile as jest.Mock)
      .mockImplementationOnce(() => firstAppendPromise)
      .mockImplementationOnce(() => Promise.resolve());
    
    // Act
    const firstLog = logError('First message', new Error('First error'));
    const secondLog = logError('Second message', new Error('Second error'));
    
    // Let the second log attempt to process
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Resolve the first delayed write
    resolveFirst!();
    
    // Wait for both logs to complete
    await Promise.all([firstLog, secondLog]);
    
    // Assert
    const calls = (fs.appendFile as jest.Mock).mock.calls;
    expect(calls.length).toBe(2);
    expect(calls[0][1]).toContain('First message');
    expect(calls[1][1]).toContain('Second message');
  });

  
});
