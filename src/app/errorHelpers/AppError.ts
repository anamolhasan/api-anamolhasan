/**
 * Application level error carrying an HTTP status code.
 * Thrown by services/controllers/middlewares for controlled failures
 * and converted to the unified error envelope by the global handler.
 */
class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
