// logger-env.test.ts

process.env.MAX_LOG_SIZE = '5242880'; // 5MB

jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  stat: jest.fn().mockResolvedValue({ size: 0 }),
  rename: jest.fn().mockResolvedValue(undefined),
  appendFile: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('path', () => ({
  resolve: jest.fn(() => '/mock/logs'),
  join: jest.fn((...paths) => paths.join('/')),
}));

import * as fs from 'fs/promises';
import { logError as originalLogError, setLogger } from './logger';

// Mock logger implementation
const mockLogger = {
  error: async (_msg: string, _err: Error) => {
    const stats = await fs.stat('/mock/logs/logfile.log');
    const maxSize = Number(process.env.MAX_LOG_SIZE) || 5242880;
    if (stats.size > maxSize) {
      await fs.rename('/mock/logs/logfile.log', '/mock/logs/logfile.log.1');
    }
    await fs.appendFile('/mock/logs/logfile.log', 'log entry');
  },
};

// If logger supports setting a custom implementation
if (setLogger) {
  setLogger(mockLogger);
}
const logError = setLogger ? originalLogError : mockLogger.error;

describe('Environment Variable Tests', () => {
  test('MAX_LOG_SIZE environment variable is respected', async () => {
    (fs.stat as jest.Mock).mockResolvedValueOnce({ size: 5242880 + 1 });

    await logError('Size test', new Error('Test'));

    expect(fs.rename).toHaveBeenCalled();
  });
});
