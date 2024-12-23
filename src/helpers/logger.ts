// src/helpers/logger.ts
import fs from "fs";
import path from "path";

// Define log levels
enum LogLevel {
  ERROR = "ERROR",
  INFO = "INFO",
}

// API specific error interface
interface ApiError {
  path: string;
  method: string;
  statusCode: number;
  errorName: string;
  errorMessage: string;
  stack?: string;
  requestBody?: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: ApiError;
}

// Get log file path
const LOG_FILE_PATH = path.resolve("logs", "api-errors.log");

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(LOG_FILE_PATH))) {
  fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
}

// Log API errors
export function logApiError(
  message: string,
  error: Error,
  {
    path,
    method,
    statusCode,
    requestBody,
  }: {
    path: string;
    method: string;
    statusCode: number;
    requestBody?: unknown;
  }
): void {
  const timestamp = new Date().toISOString();
  
  const logEntry: LogEntry = {
    timestamp,
    level: LogLevel.ERROR,
    message,
    error: {
      path,
      method,
      statusCode,
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
      requestBody,
    },
  };

  // Write to log file
  fs.appendFileSync(LOG_FILE_PATH, JSON.stringify(logEntry) + "\n", "utf8");
}

// Regular error logging for non-API errors
export function logError(message: string, error: Error): void {
  const timestamp = new Date().toISOString();
  
  const logEntry: LogEntry = {
    timestamp,
    level: LogLevel.ERROR,
    message,
    error: {
      path: '',
      method: '',
      statusCode: 500,
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    },
  };

  fs.appendFileSync(LOG_FILE_PATH, JSON.stringify(logEntry) + "\n", "utf8");
}