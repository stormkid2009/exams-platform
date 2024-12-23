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
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10 MB

// Function to rotate log file if it exceeds the maximum size
function rotateLogFile() {
  // Ensure the logs directory exists
  const logDir = path.dirname(LOG_FILE_PATH);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Check if the log file exists
  if (fs.existsSync(LOG_FILE_PATH)) {
    // If it exists, check its size
    if (fs.statSync(LOG_FILE_PATH).size >= MAX_LOG_SIZE) {
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('T')[0];
      const newLogFilePath = path.resolve("logs", `api-errors-${timestamp}.log`);
      fs.renameSync(LOG_FILE_PATH, newLogFilePath);
    }
  } else {
    // If the log file does not exist, create it
    fs.writeFileSync(LOG_FILE_PATH, '', 'utf8'); // Create an empty log file
  }
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
  rotateLogFile(); // Check and rotate log file if necessary

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
  rotateLogFile(); // Check and rotate log file if necessary

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