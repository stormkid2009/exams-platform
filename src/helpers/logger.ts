import fs from "fs/promises";
import path from "path";

enum LogLevel {
  ERROR = "ERROR",
  INFO = "INFO",
}

interface ApiError {
  path?: string;
  method?: string;
  statusCode?: number;
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

const LOG_DIR = path.resolve("logs");
const LOG_FILE_PATH = path.join(LOG_DIR, "api-errors.log");
const MAX_LOG_SIZE = Number(process.env.MAX_LOG_SIZE) || 10 * 1024 * 1024; // 10MB default
const ROTATION_CHECK_INTERVAL = 1000 * 60 * 5; // Check rotation every 5 minutes

let lastRotationCheck = Date.now();
let writeQueue: Promise<void> = Promise.resolve();

async function ensureLogDirectory() {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create logs directory:", error);
  }
}

async function rotateLogFile() {
  const now = new Date();
  try {
    const stats = await fs.stat(LOG_FILE_PATH).catch(() => null);
    
    if (stats && stats.size >= MAX_LOG_SIZE) {
      const timestamp = now.toISOString().replace(/[:.]/g, '-');
      const newPath = path.join(LOG_DIR, `api-errors-${timestamp}.log`);
      await fs.rename(LOG_FILE_PATH, newPath);
    }
  } catch (error) {
    console.error("Log rotation failed:", error);
  }
}

async function safeAppendToLog(data: string) {
  writeQueue = writeQueue.then(async () => {
    try {
      await ensureLogDirectory();
      
      if (Date.now() - lastRotationCheck > ROTATION_CHECK_INTERVAL) {
        await rotateLogFile();
        lastRotationCheck = Date.now();
      }

      await fs.appendFile(LOG_FILE_PATH, data + "\n", "utf8");
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  });

  return writeQueue;
}

function createLogEntry(level: LogLevel, message: string, error?: ApiError): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    error: error && {
      ...error,
      stack: error.stack?.split("\n").slice(0, 5).join("\n") // Limit stack trace depth
    }
  };
}

export async function logApiError(
  message: string,
  error: Error,
  context: {
    path: string;
    method: string;
    statusCode: number;
    requestBody?: unknown;
  }
): Promise<void> {
  const logEntry = createLogEntry(LogLevel.ERROR, message, {
    ...context,
    errorName: error.name,
    errorMessage: error.message,
    stack: error.stack,
    requestBody: context.requestBody
  });

  await safeAppendToLog(JSON.stringify(logEntry));
}

export async function logError(message: string, error: Error): Promise<void> {
  const logEntry = createLogEntry(LogLevel.ERROR, message, {
    errorName: error.name,
    errorMessage: error.message,
    stack: error.stack
  });

  await safeAppendToLog(JSON.stringify(logEntry));
}