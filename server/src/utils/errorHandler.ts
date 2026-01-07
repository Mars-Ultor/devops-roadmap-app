/**
 * Utility for handling errors safely
 * Prevents leaking sensitive error details in production
 */

const isProduction = process.env.NODE_ENV === 'production';

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

/**
 * Creates a safe error response that doesn't leak details in production
 */
export function createErrorResponse(
  userMessage: string,
  error?: unknown
): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    message: userMessage,
  };

  // Only include error details in development
  if (!isProduction && error) {
    response.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return response;
}

/**
 * Logs error and returns sanitized response
 */
export function handleError(
  context: string,
  error: unknown,
  userMessage: string
): ErrorResponse {
  console.error(`${context}:`, error);
  return createErrorResponse(userMessage, error);
}

