/**
 * useErrorReporter - React hook for error reporting
 * Following AGENTS.md Section 20 standards
 * 
 * @module useErrorReporter
 * @version 1.0.0
 */

import { useCallback, useRef } from 'react';
import { errorReporter, AppError, withErrorHandling, withRetry } from '../src/lib/error-handler';

interface UseErrorReporterOptions {
  componentName?: string;
}

export function useErrorReporter(options: UseErrorReporterOptions = {}) {
  const { componentName = 'UnknownComponent' } = options;
  const errorsRef = useRef<Error[]>([]);

  const reportError = useCallback(async (error: Error | unknown, context?: Record<string, unknown>) => {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    await errorReporter.report(normalizedError, { component: componentName, ...context });
    errorsRef.current.push(normalizedError);
  }, [componentName]);

  const handleAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    operationOptions: { operationName: string; fallback?: T }
  ): Promise<T | undefined> => {
    return withErrorHandling(operation, {
      operationName: `${componentName}.${operationOptions.operationName}`,
      fallback: operationOptions.fallback,
      context: { component: componentName }
    });
  }, [componentName]);

  const retryOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    retryOptions: { maxRetries?: number }
  ): Promise<T> => {
    return withRetry(operation, {
      maxRetries: retryOptions.maxRetries,
      shouldRetry: (error) => {
        const message = error.message.toLowerCase();
        return message.includes('network') || message.includes('timeout');
      }
    });
  }, []);

  return { reportError, handleAsync, retryOperation };
}

export default useErrorReporter;
