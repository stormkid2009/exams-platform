
// src/types/common.ts
export interface ApiResponse {
    status: 'success' | 'error';
    message: string;
    data: unknown;  // Using unknown is safer than any
    details?: string; // Made optional with ? instead of | null | undefined
  }
  
  export interface Messages {
    success: string;
    failure: string;
    wrongMethod: string;
    invalidData: string;
  }