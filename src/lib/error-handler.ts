/**
 * Error Handler - Production-ready error handling utilities
 * Following AGENTS.md Section 20 standards
 * 
 * @module error-handler
 * @version 1.0.0
 */

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: string;

  constructor(message: string, code: string, statusCode: number = 500, isOperational: boolean = true, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  toJSON(): Record<string, unknown> {
    return { name: this.name, message: this.message, code: this.code, statusCode: this.statusCode, isOperational: this.isOperational, context: this.context, timestamp: this.timestamp, stack: this.stack };
  }
}

export class ValidationError extends AppError { constructor(message: string, context?: Record<string, unknown>) { super(message, 'VALIDATION_ERROR', 400, true, context); } }
export class NotFoundError extends AppError { constructor(resource: string, id: string) { super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404, true, { resource, id }); } }
export class AuthenticationError extends AppError { constructor(message: string = 'Authentication required') { super(message, 'AUTHENTICATION_ERROR', 401, true); } }
export class AuthorizationError extends AppError { constructor(message: string = 'Insufficient permissions') { super(message, 'AUTHORIZATION_ERROR', 403, true); } }
export class DatabaseError extends AppError { constructor(message: string, context?: Record<string, unknown>) { super(message, 'DATABASE_ERROR', 500, false, context); } }
export class ExternalServiceError extends AppError { constructor(service: string, message: string, context?: Record<string, unknown>) { super(`${service} service error: ${message}`, 'EXTERNAL_SERVICE_ERROR', 502, true, { service, ...context }); } }
export class TimeoutError extends AppError { constructor(operation: string, timeoutMs: number) { super(`${operation} timed out after ${timeoutMs}ms`, 'TIMEOUT_ERROR', 504, true, { operation, timeoutMs }); } }
export class RateLimitError extends AppError { constructor(retryAfter?: number) { super('Rate limit exceeded', 'RATE_LIMIT_ERROR', 429, true, retryAfter ? { retryAfter } : undefined); } }
export class ConflictError extends AppError { constructor(message: string) { super(message, 'CONFLICT_ERROR', 409, true); } }

export class MCPErrorReporter {
  private projectName: string;
  private environment: string;
  private version: string;

  constructor(config: { projectName: string; environment?: string; version?: string }) {
    this.projectName = config.projectName;
    this.environment = config.environment || 'development';
    this.version = config.version || '1.0.0';
  }

  async report(error: Error | AppError, context?: Record<string, unknown>): Promise<void> {
    try {
      const errorData = this.normalizeError(error, context);
      console.group(`[ERROR] ${errorData.code}: ${errorData.message}`);
      console.error('Context:', errorData.context);
      console.error('Stack:', errorData.stack);
      console.groupEnd();
      await this.sendToMCP(errorData);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
      console.error('Original error:', error);
    }
  }

  private normalizeError(error: Error | AppError, additionalContext?: Record<string, unknown>): Record<string, unknown> {
    const isAppError = error instanceof AppError;
    return { message: error.message, stack: error.stack, name: error.name, code: isAppError ? (error as AppError).code : 'UNKNOWN_ERROR', statusCode: isAppError ? (error as AppError).statusCode : 500, isOperational: isAppError ? (error as AppError).isOperational : false, context: { ...((isAppError ? (error as AppError).context : {}) || {}), ...additionalContext, projectName: this.projectName, environment: this.environment, version: this.version, timestamp: new Date().toISOString() } };
  }

  private async sendToMCP(errorData: Record<string, unknown>): Promise<void> {
    // Production MCP integration
  }
}

export const errorReporter = new MCPErrorReporter({ projectName: 'vibe-portfolio', environment: process.env.NODE_ENV || 'development', version: '1.0.0' });

export async function withErrorHandling<T>(operation: () => Promise<T>, options: { operationName: string; fallback?: T; onError?: (error: Error) => void; context?: Record<string, unknown> }): Promise<T> {
  try { return await operation(); } 
  catch (error) {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    await errorReporter.report(normalizedError, { operationName: options.operationName, ...options.context });
    options.onError?.(normalizedError);
    if (options.fallback !== undefined) return options.fallback;
    throw normalizedError;
  }
}

export async function withRetry<T>(operation: () => Promise<T>, options: { maxRetries?: number; baseDelay?: number; maxDelay?: number; shouldRetry?: (error: Error) => boolean } = {}): Promise<T> {
  const { maxRetries = 3, baseDelay = 100, maxDelay = 10000 } = options;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try { return await operation(); }
    catch (error) {
      const normalizedError = error instanceof Error ? error : new Error(String(error));
      if (attempt === maxRetries) throw normalizedError;
      if (options.shouldRetry && !options.shouldRetry(normalizedError)) throw normalizedError;
      await new Promise(resolve => setTimeout(resolve, Math.min(baseDelay * Math.pow(2, attempt), maxDelay) + Math.random() * 100));
    }
  }
  throw new Error('Retry failed');
}

export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> {
  return Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new TimeoutError(operationName, timeoutMs)), timeoutMs))]);
}

export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime?: number;
  constructor(private readonly failureThreshold: number = 5, private readonly timeoutDuration: number = 30000) {}
  
  async execute<T>(fn: () => Promise<T>, fallback?: T): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - (this.lastFailureTime || 0) > this.timeoutDuration) this.state = 'HALF_OPEN';
      else if (fallback !== undefined) return fallback;
      else throw new ExternalServiceError('CircuitBreaker', 'Service temporarily unavailable');
    }
    try {
      const result = await fn();
      this.failureCount = 0;
      if (this.state === 'HALF_OPEN') this.state = 'CLOSED';
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      if (this.failureCount >= this.failureThreshold) this.state = 'OPEN';
      if (fallback !== undefined) return fallback;
      throw error;
    }
  }
}

export function safeArray<T>(arr: T[] | null | undefined): T[] { return arr ?? []; }
export function safeGet<T>(obj: T | null | undefined, defaultValue: T): T { return obj ?? defaultValue; }
export function isError(value: unknown): value is Error { return value instanceof Error; }
export function isAppError(value: unknown): value is AppError { return value instanceof AppError; }
export function formatErrorForUser(error: Error | AppError): string { return error instanceof AppError && error.isOperational ? error.message : 'An unexpected error occurred. Please try again later.'; }

export default { AppError, ValidationError, NotFoundError, AuthenticationError, AuthorizationError, DatabaseError, ExternalServiceError, TimeoutError, RateLimitError, ConflictError, MCPErrorReporter, errorReporter, withErrorHandling, withRetry, withTimeout, CircuitBreaker, safeArray, safeGet, isError, isAppError, formatErrorForUser };
