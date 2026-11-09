// src/types/common.ts

/**
 * Error payload shared by every API route.
 */
export interface ApiError {
  message: string;
  code: number;
  details?: string;
}

/**
 * Unified API response envelope.
 *
 * HTTP status remains the transport signal; the body only reports whether the
 * operation succeeded and carries either `data` or `error`.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Standard messages used by the question API handlers.
 */
export interface Messages {
  success: string;
  failure: string;
  wrongMethod: string;
  invalidData: string;
}
