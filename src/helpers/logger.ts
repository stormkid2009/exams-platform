// src/hes/logger.ts

import fs from "fs";
import path from "path";

// Define log levels
enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

// Get log file path
const LOG_FILE_PATH = path.resolve("logs", "app.log");

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(LOG_FILE_PATH))) {
  fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
}

// Define types for log entry and error
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  } | null;
}

// Log message to file
function writeLog(level: LogLevel, message: string, error: Error | null = null): void {
  const timestamp = new Date().toISOString();
  const logEntry: LogEntry = {
    timestamp,
    level,
    message,
    error: error ? { name: error.name, message: error.message, stack: error.stack } : null,
  };

  const logString = JSON.stringify(logEntry) + "\n";
  fs.appendFileSync(LOG_FILE_PATH, logString, "utf8");
}

// Exported logError function for centralized error handling
export function logError(message: string, error: Error): void {
  writeLog(LogLevel.ERROR, message, error);
}

// Export additional logging functions if needed
export function logInfo(message: string): void {
  writeLog(LogLevel.INFO, message);
}

export function logWarn(message: string): void {
  writeLog(LogLevel.WARN, message);
}
