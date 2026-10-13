export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNPROCESSABLE_ENTITY"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: ErrorCode = "INTERNAL_SERVER_ERROR",
    statusCode = 500,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, "BAD_REQUEST", 400, details);
  }

  static unauthorized(message = "Authentication required") {
    return new AppError(message, "UNAUTHORIZED", 401);
  }

  static forbidden(message = "Access denied: Owner privileges required") {
    return new AppError(message, "FORBIDDEN", 403);
  }

  static notFound(resource = "Resource") {
    return new AppError(`${resource} not found`, "NOT_FOUND", 404);
  }

  static conflict(message: string) {
    return new AppError(message, "CONFLICT", 409);
  }

  static unprocessable(message: string, details?: unknown) {
    return new AppError(message, "UNPROCESSABLE_ENTITY", 422, details);
  }

  static tooManyRequests(message = "Too many requests. Please try again later.") {
    return new AppError(message, "TOO_MANY_REQUESTS", 429);
  }

  static internal(message = "An unexpected internal server error occurred.") {
    return new AppError(message, "INTERNAL_SERVER_ERROR", 500);
  }
}
